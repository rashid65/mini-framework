import { diff, patch, appendTo } from './view.js';

// Event system
const eventSubscribers = {};
let globalState = {};

// Sets up a state container with a subscription system.
export function createStore(initialState = {}) {
    const subscribers = new Set();

    // Internal state storage
    let state = { ...initialState };

    // Notify all subscribers
    function notifySubscribers() {
        subscribers.forEach(callback => callback(state));
    }

    return {
        // Get the entire state or specific key
        getState(key) {
            if (key) return state[key];
            return { ...state };
        },

        // Set a single key value pair
        setState(key, value) {
            if (state[key] === value) return; // no change, no notify
            state[key] = value;
            notifySubscribers();
        },

        // Update multiple values at once
        updateState(partialState) {
            let hasChanges = false;

            for (const key in partialState) {
                if (state[key] !== partialState[key]) {
                    state[key] = partialState[key];
                    hasChanges = true;
                }
            }

            if (hasChanges) notifySubscribers();
        },

        // Subscribe to state changes
        subscribe(callback) {
            subscribers.add(callback);
            return () => subscribers.delete(callback); // return unsubscribe function (for clean way when stopping listening)
        }
    }
}

// creates a reactive state object that triggers UI updates on change
export function createState(initialState = {}) {
    globalState = new Proxy(initialState, {
        set: (target, property, value) => {
            // Avoid emitting if value didn't change (prevents render loops)
            if (target[property] === value) return true;
            target[property] = value;
            emit('stateChange', {property, value});
            return true;
        }
    });
    return globalState;
}

// create a component with isolated state and lifecycle
// create reusable UI elements with their own state that can receive external props.
export function createComponent(renderFn, initialState = {}) {
    let container = null;
    let currentVNode = null;
    const componentState = new Proxy(initialState, {
        set: (target, property, value) => {
            const oldValue = target[property];
            target[property] = value;

            // only re-render if value changed
            if (oldValue !== value && container) {
                const newVNode = renderFn(target);
                const patches = diff(currentVNode, newVNode);
                if (container.firstChild) {
                    patch(container.firstChild, patches);
                }
                currentVNode = newVNode;
            }
            return true;
        }
    });

    return (props = {}, mountTo = null) => {
        // merge props into component state
        Object.assign(componentState, props);
        const vNode = renderFn(componentState);

        // if mounting point provided, render component there
        if (mountTo) {
            container = typeof mountTo === 'string' ? document.querySelector(mountTo) : mountTo;
            if (container) {
                appendTo(vNode, container);
                currentVNode = vNode;
            }
        }
        return vNode;
    };
}

// subscribe to an event
// create event listener for framework events, allowing components to respond to system events like state changes.
// export function on(event, callback) {
//     if (!eventSubscribers[event]) {
//         eventSubscribers[event] = [];
//     }
//     eventSubscribers[event].push(callback);
// }

// broadcast an event to all subscribers
// Notifies all subscribers about the event
// export function emit(event, data) {
//     if (eventSubscribers[event]) {
//         eventSubscribers[event].forEach(callback => callback(data));
//     }
// }

// create a signal (reactive value) with subscription capability
// allowing specific UI elements to update when only their data dependencies change
export function createSignal(initialValue) {
    let value = initialValue;
    const subscribers = new Set();

    return {
        get: () => value,
        set: (newValue) => {
            value = newValue;
            subscribers.forEach(callback => callback(value));
        },
        subscribe: (callback) => {
            subscribers.add(callback);
            return () => subscribers.delete(callback); // return unsubscribe function
        }
    };
}

export function getState() {
    return globalState;
}