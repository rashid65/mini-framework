import * as View from './view.js';
import * as Router from './router.js';
import * as State from './state.js';
import * as EventSystem from './eventDelegation.js';

const RashidFramework = {
    // View functionality
    createElement: View.createElement,
    render: View.render,
    appendTo: View.appendTo,
    diff: View.diff,
    diffAttributes: View.diffAttributes, 
    diffChildren: View.diffChildren,      
    patch: View.patch,

    // Router functionality
    registerRoute: Router.registerRoute,
    registerParamRoute: Router.registerParamRoute,
    setDefaultRoute: Router.setDefaultRoute,
    navigateTo: Router.navigateTo,
    initRouter: Router.initRouter,
    getRoutes: Router.getRoutes,
    getCurrentRoute: Router.getCurrentRoute,

    // State managment
    createState: State.createState,
    createComponent: State.createComponent,
    createSignal: State.createSignal,
    createStore: State.createStore,       
    on: State.on,
    emit: State.emit,
    getState: State.getState,

    // Event System
    delegateEvent: EventSystem.delegateEvent,
    registerEvents: EventSystem.registerEvents,
    onCustomEvent: EventSystem.on,
    emitCustomEvent: EventSystem.emit,
    createKeyboardShortcuts: EventSystem.createKeyboardShortcuts,
    createScrollHandler: EventSystem.createScrollHandler,
};

// Export the framework
if (typeof window !== 'undefined') {
    window.RashidFramework = RashidFramework;
    window.createElement = View.createElement;
    window.render = View.render;
    window.appendTo = View.appendTo;
    window.createComponent = State.createComponent;
    window.createSignal = State.createSignal;
}

export default RashidFramework;