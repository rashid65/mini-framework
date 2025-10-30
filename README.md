
# RashidFramework - Mini Framework

A lightweight, modern JavaScript framework for building interactive web applications with Virtual DOM, reactive state management, history-based routing, and efficient event delegation.

## 🚀 Framework Overview

RashidFramework provides a complete set of tools for modern web development:

### Core Features

- **🎯 Virtual DOM**: Efficient DOM updates using virtual element diffing and patching
- **⚡ Reactive State Management**: Global state stores with subscription-based updates and signals
- **🛣️ History-Based Router**: SPA routing with parameterized routes and navigation API
- **📡 Event Delegation**: Optimized event handling with custom events and keyboard shortcuts  
- **🔧 Component System**: Reusable components with automatic re-rendering on state changes
- **📦 Modular Architecture**: Import only what you need - tree-shakeable modules

## 🎮 Quick Demo - Running TodoMVC

Want to see the framework in action? Try the included TodoMVC example:

### Option 1: Using the Development Server
```bash
# Install dependencies and start dev server
npm install
npm start
```

This will automatically open the TodoMVC demo in your browser.

### Option 2: Direct File Access
Simply open `todoMVC/index.html` directly in your browser (some features may be limited due to CORS restrictions).

### What You'll See
- ✅ Add, edit, and delete todos
- ✅ Mark todos as complete/incomplete  
- ✅ Filter between All, Active, and Completed todos
- ✅ Clear all completed todos
- ✅ Persistent storage (todos saved in localStorage)
- ✅ Responsive design that works on mobile

The TodoMVC implementation demonstrates all core framework features including Virtual DOM updates, state management, event handling, and component composition.

## 📖 Getting Started

### Installation & Import

```javascript
// Import the complete framework
import RashidFramework from './src/framework.js';

// Or import specific modules
import { createElement, render } from './src/view.js';
import { createState, createComponent } from './src/state.js';
import { registerRoute, initRouter } from './src/router.js';
```

## 🏗️ Creating Elements

### Basic Element Creation

The `createElement` function is the foundation of the framework, creating virtual DOM elements:

```javascript
// Simple element with text content
const heading = createElement('h1', {}, 'Welcome to RashidFramework');

// Element with attributes
const button = createElement('button', {
  className: 'btn primary',
  id: 'submit-btn'
}, 'Click Me');

// Element with multiple children
const container = createElement('div', { className: 'container' }, [
  createElement('h2', {}, 'Title'),
  createElement('p', {}, 'This is a paragraph'),
  createElement('span', {}, 'Additional text')
]);
```

### Advanced Element Creation

```javascript
// Element with complex attributes
const complexElement = createElement('div', {
  className: 'card user-profile',
  id: 'user-card-123',
  'data-user': '123',
  style: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px'
  }
}, [
  createElement('img', { 
    src: 'avatar.jpg', 
    alt: 'User Avatar',
    className: 'avatar'
  }),
  createElement('h3', {}, 'John Doe'),
  createElement('p', { className: 'email' }, 'john@example.com')
]);

// Element with data attributes
const dataElement = createElement('article', {
  className: 'post',
  data: {
    id: '12345',
    category: 'technology',
    published: '2025-01-01'
  }
}, 'Article content here');
```

### Rendering Elements to DOM

```javascript
// Create a virtual element
const app = createElement('div', { className: 'app' }, [
  createElement('header', {}, 'My App'),
  createElement('main', {}, 'Content goes here')
]);

// Render to actual DOM
const domElement = render(app);

// Append to existing DOM element
appendTo(domElement, document.getElementById('root'));

// Or use the utility function
appendTo(render(app), '#root'); // Accepts selector string
```

## ⚙️ Element Attributes

### Standard HTML Attributes

```javascript
// Basic attributes
const link = createElement('a', {
  href: 'https://example.com',
  target: '_blank',
  rel: 'noopener noreferrer'
}, 'Visit Example');

// Form elements
const input = createElement('input', {
  type: 'email',
  placeholder: 'Enter your email',
  required: true,
  className: 'form-control'
});

// Custom attributes
const customElement = createElement('div', {
  'aria-label': 'Custom component',
  'data-testid': 'main-container',
  role: 'region'
}, 'Content');
```

### Style Objects

```javascript
// Inline styles as objects
const styledDiv = createElement('div', {
  style: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '1rem',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
}, 'Styled Content');

// Dynamic styles
const dynamicElement = createElement('div', {
  className: 'dynamic-element',
  style: {
    width: `${width}px`,
    height: `${height}px`,
    transform: `rotate(${rotation}deg)`
  }
}, 'Dynamic');
```

### Data Attributes

```javascript
// Data attributes using the data object
const productCard = createElement('div', {
  className: 'product-card',
  data: {
    productId: '12345',
    category: 'electronics',
    price: '299.99',
    inStock: 'true'
  }
}, [
  createElement('h3', {}, 'Product Name'),
  createElement('p', {}, '$299.99')
]);

// Access in DOM: element.dataset.productId, element.dataset.category, etc.
```

## 📡 Event Handling

### Basic Event Handlers

```javascript
// Click events
const button = createElement('button', {
  className: 'btn',
  onClick: (event) => {
    console.log('Button clicked!', event);
    alert('Hello World!');
  }
}, 'Click Me');

// Form events
const form = createElement('form', {
  onSubmit: (event) => {
    event.preventDefault();
    console.log('Form submitted');
    // Handle form data
  }
}, [
  createElement('input', {
    type: 'text',
    onChange: (event) => {
      console.log('Input changed:', event.target.value);
    },
    onFocus: () => console.log('Input focused'),
    onBlur: () => console.log('Input blurred')
  }),
  createElement('button', { type: 'submit' }, 'Submit')
]);
```

### Advanced Event Patterns

```javascript
// Multiple event handlers
const interactiveElement = createElement('div', {
  className: 'interactive',
  onClick: handleClick,
  onMouseEnter: handleMouseEnter,
  onMouseLeave: handleMouseLeave,
  onKeyDown: (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick(event);
    }
  }
}, 'Interactive Element');

// Event delegation with custom logic
const listContainer = createElement('ul', {
  onClick: (event) => {
    // Event delegation pattern
    const listItem = event.target.closest('li');
    if (listItem) {
      const itemId = listItem.dataset.id;
      console.log('List item clicked:', itemId);
    }
  }
}, items.map(item => 
  createElement('li', { data: { id: item.id } }, item.name)
));
```

### Custom Events and Event System

```javascript
import { on, emit, createKeyboardShortcuts } from './src/eventDelegation.js';

// Custom event listeners
on('user:login', (userData) => {
  console.log('User logged in:', userData);
  updateUserInterface(userData);
});

on('cart:updated', (cartData) => {
  updateCartCounter(cartData.itemCount);
});

// Emit custom events
const loginButton = createElement('button', {
  onClick: () => {
    // Simulate login
    const userData = { id: 123, name: 'John Doe' };
    emit('user:login', userData);
  }
}, 'Login');

// Keyboard shortcuts
createKeyboardShortcuts({
  'Ctrl+S': (event) => {
    event.preventDefault();
    saveDocument();
  },
  'Ctrl+N': (event) => {
    event.preventDefault(); 
    createNewDocument();
  },
  'Escape': () => {
    closeModal();
  }
});
```

## 🏗️ Nesting Elements

### Simple Nesting

```javascript
// Single child
const wrapper = createElement('div', { className: 'wrapper' }, 
  createElement('p', {}, 'Single child')
);

// Array of children
const navigation = createElement('nav', { className: 'main-nav' }, [
  createElement('a', { href: '/' }, 'Home'),
  createElement('a', { href: '/about' }, 'About'),
  createElement('a', { href: '/contact' }, 'Contact')
]);
```

### Complex Nested Structures

```javascript
// Deep nesting with multiple levels
const blogPost = createElement('article', { className: 'blog-post' }, [
  createElement('header', { className: 'post-header' }, [
    createElement('h1', { className: 'post-title' }, 'Blog Post Title'),
    createElement('div', { className: 'post-meta' }, [
      createElement('span', { className: 'author' }, 'By John Doe'),
      createElement('span', { className: 'date' }, 'January 1, 2025'),
      createElement('div', { className: 'tags' }, [
        createElement('span', { className: 'tag' }, 'JavaScript'),
        createElement('span', { className: 'tag' }, 'Framework'),
        createElement('span', { className: 'tag' }, 'Tutorial')
      ])
    ])
  ]),
  createElement('div', { className: 'post-content' }, [
    createElement('p', {}, 'First paragraph of the blog post...'),
    createElement('blockquote', {}, 'An inspiring quote'),
    createElement('p', {}, 'Second paragraph with more content...'),
    createElement('ul', {}, [
      createElement('li', {}, 'First bullet point'),
      createElement('li', {}, 'Second bullet point'),
      createElement('li', {}, 'Third bullet point')
    ])
  ]),
  createElement('footer', { className: 'post-footer' }, [
    createElement('div', { className: 'social-share' }, 'Share this post'),
    createElement('div', { className: 'comments' }, 'Comments section')
  ])
]);
```

### Dynamic Nesting with Arrays

```javascript
// Generate nested elements from data
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' }
];

const userList = createElement('div', { className: 'user-list' }, [
  createElement('h2', {}, 'User Directory'),
  createElement('div', { className: 'users' }, 
    users.map(user => 
      createElement('div', { 
        className: 'user-card',
        data: { userId: user.id }
      }, [
        createElement('h3', { className: 'user-name' }, user.name),
        createElement('p', { className: 'user-email' }, user.email),
        createElement('button', {
          className: 'contact-btn',
          onClick: () => contactUser(user.id)
        }, 'Contact')
      ])
    )
  )
]);

// Conditional nesting
const conditionalElement = createElement('div', {}, [
  createElement('h1', {}, 'Welcome'),
  ...(isLoggedIn ? [
    createElement('p', {}, 'Welcome back!'),
    createElement('button', { onClick: logout }, 'Logout')
  ] : [
    createElement('p', {}, 'Please log in'),
    createElement('button', { onClick: showLoginForm }, 'Login')
  ]),
  createElement('footer', {}, 'Footer content')
]);
```

---

## 🏛️ How the Framework Works

### Virtual DOM Architecture

RashidFramework uses a Virtual DOM approach for efficient DOM updates:

```javascript
// 1. Virtual elements are plain JavaScript objects
const vElement = {
  tag: 'div',
  attributes: { className: 'container' },
  children: ['Hello World']
};

// 2. The render function converts virtual elements to real DOM
const realElement = render(vElement); // Creates actual HTMLDivElement

// 3. Diffing compares old vs new virtual trees
const oldVTree = createElement('div', {}, 'Old content');
const newVTree = createElement('div', {}, 'New content'); 
const patches = diff(oldVTree, newVTree);

// 4. Patching applies minimal changes to real DOM
patch(realElement, patches);
```

### State Management System

The framework provides reactive state management with automatic UI updates:

```javascript
// Global state store
const store = createStore({ count: 0, user: null });

// Components automatically re-render when state changes
const Counter = createComponent(() => {
  const state = store.getState();
  
  return createElement('div', {}, [
    createElement('p', {}, `Count: ${state.count}`),
    createElement('button', {
      onClick: () => store.setState('count', state.count + 1)
    }, 'Increment')
  ]);
});

// Signals for fine-grained reactivity
const [count, setCount] = createSignal(0);
const doubleCount = createSignal(() => count() * 2);
```

### Router Implementation

History-based SPA routing with parameter extraction:

```javascript
// Router matches URLs to components
registerRoute('/user/:id', UserProfile);
registerRoute('/posts/:category/:slug', BlogPost);

// Navigation updates browser history
navigateTo('/user/123'); // Updates URL bar, renders UserProfile with {id: '123'}

// Route parameters automatically passed to components
const UserProfile = createComponent((params) => {
  return createElement('div', {}, `User ID: ${params.id}`);
});
```

### Event Delegation System

Efficient event handling using element properties:

```javascript
// Events are stored in WeakMap for memory efficiency
const elementHandlers = new WeakMap();

// Single event handler per element+event type combination
element.onclick = (event) => {
  handlers.forEach(handler => handler.call(element, event));
};

// Custom events use central event bus
const customEvents = new Map();
emit('user:action', data); // Triggers all 'user:action' listeners
```

### Component Lifecycle

Components integrate with state management for reactive updates:

```javascript
const Component = createComponent((props, state) => {
  // Component function called on initial render and state changes
  
  // Subscribe to state changes
  const unsubscribe = store.subscribe(() => {
    // Re-render component when state changes
    const newVTree = Component(props);
    const patches = diff(oldVTree, newVTree);
    patch(domElement, patches);
  });
  
  return createElement(/* ... */);
});
```

---

## 📚 Complete API Reference

### View Module (`view.js`)

#### `createElement(tag, attributes, children)`
Creates a virtual DOM element.
- **tag** `{string}`: HTML tag name
- **attributes** `{object}`: Element attributes and properties
- **children** `{array|string|number}`: Child elements or text content
- **Returns**: Virtual element object

```javascript
const element = createElement('div', { className: 'box' }, [
  createElement('span', {}, 'Text content')
]);
```

#### `render(vElement)`
Converts virtual element to real DOM element.
- **vElement** `{object}`: Virtual element from createElement
- **Returns**: HTMLElement

```javascript
const domElement = render(vElement);
```

#### `appendTo(element, target)`
Appends element to target container.
- **element** `{HTMLElement}`: Element to append
- **target** `{HTMLElement|string}`: Target container or selector
- **Returns**: void

```javascript
appendTo(domElement, '#app');
appendTo(domElement, document.body);
```

#### `diff(oldVTree, newVTree)`
Compares two virtual trees and returns patches.
- **oldVTree** `{object}`: Previous virtual element
- **newVTree** `{object}`: New virtual element  
- **Returns**: Array of patch operations

#### `patch(element, patches)`
Applies patches to real DOM element.
- **element** `{HTMLElement}`: Target DOM element
- **patches** `{array}`: Patches from diff function

### State Module (`state.js`)

#### `createStore(initialState)`
Creates a reactive state store.
- **initialState** `{object}`: Initial state object
- **Returns**: Store object with methods

```javascript
const store = createStore({ count: 0 });
store.setState('count', 1);
store.subscribe((state) => console.log(state));
```

#### `createComponent(renderFunction)`
Creates a reactive component.
- **renderFunction** `{function}`: Function returning virtual element
- **Returns**: Component function

```javascript
const MyComponent = createComponent((props) => {
  return createElement('div', {}, props.message);
});
```

#### `createSignal(initialValue)`
Creates a reactive signal.
- **initialValue** `{any}`: Initial signal value
- **Returns**: `[getter, setter]` array

```javascript
const [count, setCount] = createSignal(0);
console.log(count()); // 0
setCount(5);
console.log(count()); // 5
```

#### Global Event System
- `on(eventName, callback)`: Subscribe to custom event
- `emit(eventName, data)`: Emit custom event
- `getState(key?)`: Get global state value

### Router Module (`router.js`)

#### `registerRoute(path, component)`
Registers a static route.
- **path** `{string}`: URL path
- **component** `{function}`: Component function

#### `registerParamRoute(path, component)`  
Registers a parameterized route.
- **path** `{string}`: URL path with parameters (e.g., '/user/:id')
- **component** `{function}`: Component function receiving params

#### `initRouter(containerSelector)`
Initializes the router system.
- **containerSelector** `{string}`: CSS selector for app container

#### `navigateTo(path)`
Programmatically navigate to route.
- **path** `{string}`: Target route path

#### `getCurrentRoute()`
Get current route information.
- **Returns**: Object with path, component, and params

#### `getRoutes()`
Get all registered routes.
- **Returns**: Object mapping paths to components

### Event System Module (`eventDelegation.js`)

#### `attachEventHandler(element, eventType, handler)`
Attach event handler to element.
- **element** `{HTMLElement}`: Target element
- **eventType** `{string}`: Event type (e.g., 'click')
- **handler** `{function}`: Event handler function

#### `createKeyboardShortcuts(shortcuts)`
Set up keyboard shortcuts.
- **shortcuts** `{object}`: Map of key combinations to handlers

```javascript
createKeyboardShortcuts({
  'Ctrl+S': () => save(),
  'Escape': () => close()
});
```

#### Custom Events
- `on(eventName, callback)`: Listen for custom event
- `emit(eventName, data)`: Emit custom event

---

## 🛠️ Practical Examples

### Complete Todo Application

```javascript
import RashidFramework from './src/framework.js';

const { createElement, createStore, createComponent, render, appendTo } = RashidFramework;

// State management
const todoStore = createStore({
  todos: [],
  filter: 'all' // all, active, completed
});

// Actions
const actions = {
  addTodo(text) {
    const todos = todoStore.getState('todos');
    todoStore.setState('todos', [
      ...todos,
      { id: Date.now(), text, completed: false }
    ]);
  },
  
  toggleTodo(id) {
    const todos = todoStore.getState('todos');
    todoStore.setState('todos', todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  },
  
  deleteTodo(id) {
    const todos = todoStore.getState('todos');
    todoStore.setState('todos', todos.filter(todo => todo.id !== id));
  },
  
  setFilter(filter) {
    todoStore.setState('filter', filter);
  }
};

// Components
const TodoItem = createComponent((todo) => {
  return createElement('li', { 
    className: todo.completed ? 'completed' : ''
  }, [
    createElement('input', {
      type: 'checkbox',
      checked: todo.completed,
      onChange: () => actions.toggleTodo(todo.id)
    }),
    createElement('span', { className: 'todo-text' }, todo.text),
    createElement('button', {
      className: 'delete-btn',
      onClick: () => actions.deleteTodo(todo.id)
    }, '×')
  ]);
});

const TodoList = createComponent(() => {
  const { todos, filter } = todoStore.getState();
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return createElement('ul', { className: 'todo-list' },
    filteredTodos.map(todo => TodoItem(todo))
  );
});

const TodoApp = createComponent(() => {
  let inputValue = '';
  
  return createElement('div', { className: 'todo-app' }, [
    createElement('h1', {}, 'Todo List'),
    createElement('form', {
      onSubmit: (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
          actions.addTodo(inputValue.trim());
          inputValue = '';
          e.target.reset();
        }
      }
    }, [
      createElement('input', {
        type: 'text',
        placeholder: 'Add a new todo...',
        onChange: (e) => { inputValue = e.target.value; }
      }),
      createElement('button', { type: 'submit' }, 'Add')
    ]),
    TodoList(),
    createElement('div', { className: 'filters' }, [
      createElement('button', {
        className: todoStore.getState('filter') === 'all' ? 'active' : '',
        onClick: () => actions.setFilter('all')
      }, 'All'),
      createElement('button', {
        className: todoStore.getState('filter') === 'active' ? 'active' : '',
        onClick: () => actions.setFilter('active')
      }, 'Active'),
      createElement('button', {
        className: todoStore.getState('filter') === 'completed' ? 'active' : '',
        onClick: () => actions.setFilter('completed')
      }, 'Completed')
    ])
  ]);
});

// Initialize app
appendTo(render(TodoApp()), '#app');

// Re-render on state changes
todoStore.subscribe(() => {
  appendTo(render(TodoApp()), '#app');
});
```

### Router Example with Multiple Pages

```javascript
import { registerRoute, registerParamRoute, setDefaultRoute, initRouter } from './src/router.js';

// Page components
const HomePage = createComponent(() => {
  return createElement('div', { className: 'page' }, [
    createElement('h1', {}, 'Welcome Home'),
    createElement('p', {}, 'This is the homepage'),
    createElement('a', { href: '/about' }, 'Go to About')
  ]);
});

const AboutPage = createComponent(() => {
  return createElement('div', { className: 'page' }, [
    createElement('h1', {}, 'About Us'),
    createElement('p', {}, 'Learn more about our company'),
    createElement('a', { href: '/contact' }, 'Contact Us')
  ]);
});

const UserPage = createComponent((params) => {
  return createElement('div', { className: 'page' }, [
    createElement('h1', {}, `User Profile: ${params.id}`),
    createElement('p', {}, `Viewing user ${params.id}`),
    createElement('a', { href: '/' }, 'Back to Home')
  ]);
});

const NotFoundPage = createComponent(() => {
  return createElement('div', { className: 'page error' }, [
    createElement('h1', {}, '404 - Page Not Found'),
    createElement('a', { href: '/' }, 'Go Home')
  ]);
});

// Register routes
registerRoute('/', HomePage);
registerRoute('/about', AboutPage);
registerRoute('/contact', ContactPage);
registerParamRoute('/user/:id', UserPage);
setDefaultRoute(NotFoundPage);

// Initialize router
initRouter('#app');
```