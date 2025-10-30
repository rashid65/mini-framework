import { appendTo, diff, patch } from "./view.js";
import { on } from "./state.js";
import { attachEventHandler } from "./eventDelegation.js";

// Route Storage
const routes = {};
let defaultRoute = null;
const paramRoutes = [];

/**
 *  Registers a route in the application router
 *  enabling SPA functionality by mapping URLs to component render functions
 *  1- string - route
 *  2- function -  component function that returns vDOM
 */
export function registerRoute(path, component) {
    // ensure it starts with '/'
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    routes[cleanPath] = component;
}

/**
 *  Registers a route that can include dynamic parameters
 *  1- string - route pattern with parameters (e.g. "/user/:id")
 *  2- function - component to render
 */
export function registerParamRoute(pattern, component) {
    const cleanPattern = pattern.startsWith('/') ? pattern : `/${pattern}`;

    // check if route has parameter
    if (cleanPattern.includes(':')) {
        // convert pattern to regex for matching
        const regexPattern = cleanPattern.replace(
            /:([^\/]+)/g,
            '(?<$1>[^\/]+)'
        );

        paramRoutes.push({
            pattern: cleanPattern,
            regex: new RegExp(`^${regexPattern}$`),
            component
        });
    } else {
        // Regular route without parameters
        routes[cleanPattern] = component;
    }
}

/** 
 *  Find matching route and extract parameters
 *  1- string - current URL path
 *  Return route info with component and param
 */
function findMatchingRoute(path) {
    // Ensure path starts with '/'
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    // first try exact match
    if (routes[cleanPath]) {
        return {
            component: routes[cleanPath],
            params: {}
        };
    }

    // Try parameter routes
    for (const route of paramRoutes) {
        const match = cleanPath.match(route.regex);
        if (match) {
            return {
                component: route.component,
                params: match.groups || {}
            };
        }
    }

    // No matching route found
    return {
        component: defaultRoute,
        params: {}
    };
}

/** 
 *  sets the default route when path is not matched
 *  1- function component - Component function for the default rout
 *  */
export function setDefaultRoute(component) {
    defaultRoute = component;
}

/**
 *  Navigates to a specific route using History API
 *  render the corresponding component for the new route (SPA)
 * 1- string - path
     */
export function navigateTo(path, state = {}) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (window.location.pathname === cleanPath) {
        // Already on this path – no history push, no redundant render
        return;
    }
    history.pushState(state, '', cleanPath);
    renderCurrentRoute();
}

// Returns all registered registered routes
export function getRoutes() {
    return { ...routes }; // copy better than direct
}

// return the current active route based on URL path
export function getCurrentRoute() {
    const currentPath = window.location.pathname;
    const routeInfo = findMatchingRoute(currentPath);

    return {
        path: currentPath || '/',
        component: routeInfo.component,
        params: routeInfo.params
    };
}

// Renders the current route based on URL path
export function renderCurrentRoute() {
    const containerElement = document.querySelector(routerConfig.container);
    if (!containerElement) {
        console.error('Container element not found');
        return;
    }

    const currentPath = window.location.pathname;
    const { component, params } = findMatchingRoute(currentPath);

    if (!component) return;

    // First time: full mount
    if (!containerElement._currentVNode) {
        const vElement = component(params);
        appendTo(vElement, containerElement);
        // CRITICAL: store current vnode so future diffs work
        containerElement._currentVNode = vElement;
    } else {
        // Subsequent manual calls should diff instead of wiping
        const newVNode = component(params);
        const patches = diff(containerElement._currentVNode, newVNode);
        if (containerElement.firstChild) {
            patch(containerElement.firstChild, patches);
        }
        containerElement._currentVNode = newVNode;
    }
}

// Router configuration
const routerConfig = {
    container: null,
    initialized: false
};


// Initialize router listeners
export function initRouter(container) {
    // Store container refrence
    routerConfig.container = container;

    // Only initialize once
    if (routerConfig.initialized) return;

    attachEventHandler(window, 'popstate', () => {
        renderCurrentRoute();
    });

    // Re-render on any global state change
    on('stateChange', () => {
        const containerElement = document.querySelector(routerConfig.container);
        if (!containerElement || !containerElement._currentVNode) return;

        const currentPath = window.location.pathname;
        const { component, params } = findMatchingRoute(currentPath);
        if (!component) return;

        const newVNode = component(params);
        const patches = diff(containerElement._currentVNode, newVNode);
        if (containerElement.firstChild) {
            patch(containerElement.firstChild, patches);
        }
        containerElement._currentVNode = newVNode;
    });

    // Initial render
    renderCurrentRoute();
    routerConfig.initialized = true;
}