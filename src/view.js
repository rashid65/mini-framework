import { attachEventHandler, removeEventHandler } from './eventDelegation.js';

/** 
 * Creates a new DOM element with these parameters:
 * 1- string - tag          - HTML tag
 * 2- object - attributes   - (class, id, style, etc)
 * 3- array[str] - children - child elements
 *
 * the return value is a DOM element (virtual)  
 */
export function createElement(tag, attributes = {}, children = []) {
    return {
        tag,
        attributes,
        children: Array.isArray(children) ? children : [children]
    };
}

/** 
 *  transform virtual DOM element to an actual DOM element 
 *  1- object - vElement
 *  
 *  returns an actual usuable DOM element 
 */
export function render(vElement) {
    // handle text nodes 
    // (some children can be text/number and not an element object)
    if (typeof vElement === 'string' || typeof vElement === 'number') {
        return document.createTextNode(vElement);
    }

    const element = document.createElement(vElement.tag);

    // Set attributes using unified helper
    Object.entries(vElement.attributes || {}).forEach(([key, value]) => {
        setElementAttribute(element, key, value);
    });

    // Render and append children
    vElement.children.forEach(child => {
        element.appendChild(render(child));
    });

    return element;
}

// Unified attribute setter for both render and patch operations
function setElementAttribute(element, key, value) {
    if (key === 'className') {
        element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
    } else if (key === 'data' && typeof value === 'object') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
            element.dataset[dataKey] = dataValue;
        });
    } else if (key.startsWith('on') && typeof value === 'function') {
        const eventType = key.slice(2).toLowerCase();
        
        // Clean up existing handler
        if (element._eventHandlers?.[eventType]) {
            removeEventHandler(element, eventType, element._eventHandlers[eventType]);
        }
        
        // Attach new handler
        attachEventHandler(element, eventType, value);
        if (!element._eventHandlers) element._eventHandlers = {};
        element._eventHandlers[eventType] = value;
    } else {
        // Generic property/attribute setting
        if (key in element) {
            element[key] = value;
        }
        element.setAttribute(key, value);
    }
}

// Unified attribute remover
function removeElementAttribute(element, key) {
    if (key === 'className') {
        element.className = '';
    } else if (key === 'style') {
        element.removeAttribute('style');
    } else if (key.startsWith('on')) {
        const eventType = key.slice(2).toLowerCase();
        if (element._eventHandlers?.[eventType]) {
            removeEventHandler(element, eventType, element._eventHandlers[eventType]);
            delete element._eventHandlers[eventType];
        }
    } else {
        if (key in element) {
            element[key] = element.tagName === 'INPUT' && key === 'value' ? '' : false;
        }
        element.removeAttribute(key);
    }
}

export function diff(oldVNode, newVNode) {
    // Type mismatch or different tags
    if (typeof oldVNode !== typeof newVNode || 
        (oldVNode?.tag && oldVNode.tag !== newVNode?.tag)) {
        return { type: 'REPLACE', newVNode };
    }

    // Text nodes
    if (typeof newVNode === 'string' || typeof newVNode === 'number') {
        return oldVNode !== newVNode ? { type: 'TEXT', content: newVNode } : { type: 'NONE' };
    }

    // Compare attributes and children
    const attributesDiff = diffAttributes(oldVNode.attributes || {}, newVNode.attributes || {});
    const childrenDiff = diffChildren(oldVNode.children || [], newVNode.children || []);

    // No changes
    if (attributesDiff.length === 0 && childrenDiff.every(patch => patch.type === 'NONE')) {
        return { type: 'NONE' };
    }

    return {
        type: 'UPDATE',
        attributes: attributesDiff,
        children: childrenDiff
    };
}

export function diffAttributes(oldAttrs, newAttrs) {
    const patches = [];
    const allKeys = new Set([...Object.keys(oldAttrs), ...Object.keys(newAttrs)]);

    allKeys.forEach(key => {
        const oldValue = oldAttrs[key];
        const newValue = newAttrs[key];

        if (oldValue === newValue) return;

        if (newValue === undefined) {
            patches.push({ type: 'REMOVE_ATTRIBUTE', key });
        } else {
            // Handle boolean attributes
            const booleanAttrs = ['checked', 'disabled', 'selected'];
            if (booleanAttrs.includes(key) && !newValue) {
                patches.push({ type: 'REMOVE_ATTRIBUTE', key });
            } else {
                patches.push({ type: 'SET_ATTRIBUTE', key, value: newValue });
            }
        }
    });

    return patches;
}

export function diffChildren(oldChildren, newChildren) {
    const patches = [];
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];

        if (i >= oldChildren.length) {
            patches.push({ type: 'APPEND_CHILD', vNode: newChild });
        } else if (i >= newChildren.length) {
            patches.push({ type: 'REMOVE_CHILD', index: i });
        } else {
            // Check for key-based replacement
            const oldKey = oldChild?.attributes?.key;
            const newKey = newChild?.attributes?.key;
            
            if ((oldKey || newKey) && oldKey !== newKey) {
                patches.push({ type: 'REPLACE', newVNode: newChild });
            } else {
                patches.push(diff(oldChild, newChild));
            }
        }
    }

    return patches;
}

export function patch(domNode, patches) {
    if (!patches || patches.type === 'NONE') return domNode;

    switch (patches.type) {
        case 'REPLACE': {
            const newNode = render(patches.newVNode);
            domNode.parentNode.replaceChild(newNode, domNode);
            return newNode;
        }
        case 'TEXT':
            domNode.textContent = patches.content;
            return domNode;
        case 'UPDATE':
            // Apply attribute patches
            patches.attributes.forEach(({ type, key, value }) => {
                if (type === 'SET_ATTRIBUTE') {
                    setElementAttribute(domNode, key, value);
                } else if (type === 'REMOVE_ATTRIBUTE') {
                    removeElementAttribute(domNode, key);
                }
            });

            // Apply children patches
            applyChildrenPatches(domNode, patches.children);
            return domNode;
        default:
            return domNode;
    }
}

function applyChildrenPatches(domNode, childrenPatches) {
    if (!childrenPatches?.length) return;

    // Process patches by type for better DOM stability
    const operations = { updates: [], appends: [], removals: [] };

    childrenPatches.forEach((patchObj, index) => {
        if (!patchObj || patchObj.type === 'NONE') return;

        switch (patchObj.type) {
            case 'APPEND_CHILD':
                operations.appends.push(patchObj);
                break;
            case 'REMOVE_CHILD':
                operations.removals.push(patchObj.index);
                break;
            default:
                operations.updates.push({ patch: patchObj, index });
        }
    });

    // Apply updates first
    operations.updates.forEach(({ patch: patchObj, index }) => {
        const targetNode = domNode.childNodes[index];
        if (targetNode) patch(targetNode, patchObj);
    });

    // Apply appends
    operations.appends.forEach(({ vNode }) => {
        domNode.appendChild(render(vNode));
    });

    // Apply removals in reverse order
    operations.removals
        .sort((a, b) => b - a)
        .forEach(index => {
            const child = domNode.childNodes[index];
            if (child) domNode.removeChild(child);
        });
}

/** 
 *  adds the virtual element to a real DOM container,
 *  used to mount components to the page  
 * 1- object - vElement
 * 2- HTML Element - container
 */
export function appendTo(vElement, container) {
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }

    if (!container) {
        throw new Error('Container not found');
    }

    if (!container._currentVNode) {
        // Initial render
        container.appendChild(render(vElement));
        container._currentVNode = vElement;
    } else {
        // Update existing
        const patches = diff(container._currentVNode, vElement);
        if (container.firstChild) {
            patch(container.firstChild, patches);
        }
        container._currentVNode = vElement;
    }
}