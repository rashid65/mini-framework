/**
 * Simplified Event System
 * Uses DOM element properties (onevent) for efficient event handling
 */

// Storage for event handlers and custom events
const elementHandlers = new WeakMap();
const customEvents = new Map();

/**
 * Core function to attach event handlers using element properties
 */
export function attachEventHandler(element, eventType, handler) {
    const propName = 'on' + eventType.toLowerCase();
    
    // Initialize handler storage for this element
    if (!elementHandlers.has(element)) {
        elementHandlers.set(element, new Map());
    }
    
    const handlers = elementHandlers.get(element);
    
    // First handler for this event type - set up the property
    if (!handlers.has(eventType)) {
        handlers.set(eventType, new Set());
        
        // Create master handler that calls all registered handlers
        element[propName] = (event) => {
            const eventHandlers = handlers.get(eventType);
            if (eventHandlers) {
                eventHandlers.forEach(h => h.call(element, event));
            }
        };
    }
    
    // Add handler to the set
    handlers.get(eventType).add(handler);
}

/**
 * Remove a specific event handler
 */
export function removeEventHandler(element, eventType, handler) {
    if (!elementHandlers.has(element)) return;
    
    const handlers = elementHandlers.get(element);
    const eventHandlers = handlers.get(eventType);
    
    if (eventHandlers) {
        eventHandlers.delete(handler);
        
        // Clean up if no more handlers
        if (eventHandlers.size === 0) {
            element['on' + eventType.toLowerCase()] = null;
            handlers.delete(eventType);
        }
    }
}

/**
 * Event delegation - handle events on child elements through a parent
 */
export function delegateEvent(eventType, container, selector, handler) {
    const containerEl = typeof container === 'string' 
        ? document.querySelector(container) 
        : container;
    
    if (!containerEl) {
        console.warn(`Container not found: ${container}`);
        return () => {};
    }
    
    const delegatedHandler = (event) => {
        // Check if event target matches selector
        const target = event.target.closest(selector);
        if (target && containerEl.contains(target)) {
            handler.call(target, event, target);
        }
    };
    
    attachEventHandler(containerEl, eventType, delegatedHandler);
    
    // Return cleanup function
    return () => removeEventHandler(containerEl, eventType, delegatedHandler);
}

/**
 * Batch register multiple events with a simple config object
 */
export function registerEvents(container, eventMap) {
    const cleanupFunctions = [];
    
    for (const [config, handler] of Object.entries(eventMap)) {
        const [eventType, selector] = config.split(':').map(s => s.trim());
        
        if (eventType && selector) {
            const cleanup = delegateEvent(eventType, container, selector, handler);
            cleanupFunctions.push(cleanup);
        }
    }
    
    // Return single cleanup function for all events
    return () => cleanupFunctions.forEach(fn => fn());
}

/**
 * Custom event system - subscribe to named events
 */
export function on(eventName, handler) {
    if (!customEvents.has(eventName)) {
        customEvents.set(eventName, new Set());
    }
    
    customEvents.get(eventName).add(handler);
    
    // Return unsubscribe function
    return () => {
        const handlers = customEvents.get(eventName);
        if (handlers) {
            handlers.delete(handler);
            if (handlers.size === 0) {
                customEvents.delete(eventName);
            }
        }
    };
}

/**
 * Custom event system - emit named events
 */
export function emit(eventName, data) {
    const handlers = customEvents.get(eventName);
    if (handlers) {
        handlers.forEach(handler => {
            try {
                handler(data);
            } catch (error) {
                console.error(`Event handler error (${eventName}):`, error);
            }
        });
    }
}

/**
 * Keyboard shortcuts helper
 */
export function createKeyboardShortcuts(element, shortcuts) {
    const targetEl = typeof element === 'string' 
        ? document.querySelector(element) 
        : element || document;
    
    const keyHandler = (event) => {
        // Build key combination string
        const keys = [
            event.ctrlKey && 'Ctrl',
            event.altKey && 'Alt', 
            event.shiftKey && 'Shift',
            event.metaKey && 'Meta',
            event.key
        ].filter(Boolean).join('+');
        
        const handler = shortcuts[keys];
        if (handler) {
            handler(event);
        }
    };
    
    attachEventHandler(targetEl, 'keydown', keyHandler);
    
    return () => removeEventHandler(targetEl, 'keydown', keyHandler);
}

/**
 * Throttled scroll handler
 */
export function createScrollHandler(element, handler, delay = 100) {
    const targetEl = typeof element === 'string' 
        ? document.querySelector(element) 
        : element || window;
    
    let timeoutId = null;
    
    const throttledHandler = (event) => {
        if (timeoutId) return;
        
        timeoutId = setTimeout(() => {
            handler(event);
            timeoutId = null;
        }, delay);
    };
    
    attachEventHandler(targetEl, 'scroll', throttledHandler);
    
    return () => {
        if (timeoutId) clearTimeout(timeoutId);
        removeEventHandler(targetEl, 'scroll', throttledHandler);
    };
}