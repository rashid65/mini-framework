# 🚀 Building Apps with RashidFramework - Step by Step Guide

This guide will walk you through building a complete web application using RashidFramework, from setup to deployment.

## 📋 Prerequisites

Before you start, make sure you have:
- Basic knowledge of HTML, CSS, and JavaScript
- A modern web browser
- A code editor (VS Code recommended)
- Node.js installed (for development server, optional)

## 🛠️ Step 1: Project Setup

### 1.1 Create Project Structure

Create a new directory for your project:

```
my-app/
├── index.html
├── style.css
├── app.js
└── src/
    ├── framework.js
    ├── view.js
    ├── state.js
    ├── router.js
    └── eventDelegation.js
```

### 1.2 Copy Framework Files

Copy all the framework files from the `src/` directory into your project's `src/` folder.

### 1.3 Create Basic HTML Structure

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My RashidFramework App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- App container where your framework will render -->
    <div id="app"></div>
    
    <!-- Load your app -->
    <script type="module" src="app.js"></script>
</body>
</html>
```

## 🎯 Step 2: Your First Component

### 2.1 Import the Framework

Create `app.js` and import what you need:

```javascript
// Import the framework
import RashidFramework from './src/framework.js';

// Destructure the functions you'll use
const { 
    createElement, 
    render, 
    appendTo, 
    createComponent, 
    createStore 
} = RashidFramework;
```

### 2.2 Create Your First Component

```javascript
// Simple greeting component
const Greeting = createComponent((props) => {
    return createElement('div', { className: 'greeting' }, [
        createElement('h1', {}, `Hello, ${props.name}!`),
        createElement('p', {}, 'Welcome to your new app')
    ]);
});

// Render to the page
const app = Greeting({ name: 'World' });
appendTo(render(app), '#app');
```

### 2.3 Add Some Basic Styling

Create `style.css`:

```css
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

#app {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.greeting {
    text-align: center;
    padding: 20px;
}

.greeting h1 {
    color: #007bff;
    margin-bottom: 10px;
}
```

**🎉 Test your setup:** Open `index.html` in a browser. You should see your greeting!

## 📊 Step 3: Adding State Management

### 3.1 Create a Store

```javascript
// Create a global state store
const appStore = createStore({
    user: { name: 'Guest', isLoggedIn: false },
    todos: [],
    currentPage: 'home'
});
```

### 3.2 Create Interactive Components

```javascript
// Header component with user status
const Header = createComponent(() => {
    const { user } = appStore.getState();
    
    return createElement('header', { className: 'app-header' }, [
        createElement('h1', {}, 'My Todo App'),
        createElement('div', { className: 'user-info' }, [
            createElement('span', {}, `Welcome, ${user.name}`),
            createElement('button', {
                className: user.isLoggedIn ? 'logout-btn' : 'login-btn',
                onClick: toggleLogin
            }, user.isLoggedIn ? 'Logout' : 'Login')
        ])
    ]);
});

// Login/logout functionality
function toggleLogin() {
    const { user } = appStore.getState();
    const newUser = user.isLoggedIn 
        ? { name: 'Guest', isLoggedIn: false }
        : { name: 'John Doe', isLoggedIn: true };
    
    appStore.setState('user', newUser);
}
```

### 3.3 Connect Components to State

```javascript
// Todo input component
const TodoInput = createComponent(() => {
    let inputValue = '';
    
    return createElement('div', { className: 'todo-input' }, [
        createElement('input', {
            type: 'text',
            placeholder: 'Add a new todo...',
            className: 'todo-field',
            onChange: (e) => { inputValue = e.target.value; },
            onKeyDown: (e) => {
                if (e.key === 'Enter' && inputValue.trim()) {
                    addTodo(inputValue.trim());
                    inputValue = '';
                    e.target.value = '';
                }
            }
        }),
        createElement('button', {
            className: 'add-btn',
            onClick: () => {
                if (inputValue.trim()) {
                    addTodo(inputValue.trim());
                    inputValue = '';
                    document.querySelector('.todo-field').value = '';
                }
            }
        }, 'Add Todo')
    ]);
});

// Add todo function
function addTodo(text) {
    const todos = appStore.getState('todos');
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    appStore.setState('todos', [...todos, newTodo]);
}
```

## 📝 Step 4: Building a Complete Todo App

### 4.1 Todo List Component

```javascript
const TodoList = createComponent(() => {
    const todos = appStore.getState('todos');
    
    if (todos.length === 0) {
        return createElement('div', { className: 'empty-state' }, [
            createElement('p', {}, 'No todos yet. Add one above!')
        ]);
    }
    
    return createElement('ul', { className: 'todo-list' },
        todos.map(todo => TodoItem(todo))
    );
});

const TodoItem = createComponent((todo) => {
    return createElement('li', {
        className: `todo-item ${todo.completed ? 'completed' : ''}`,
        'data-id': todo.id
    }, [
        createElement('input', {
            type: 'checkbox',
            checked: todo.completed,
            onChange: () => toggleTodo(todo.id)
        }),
        createElement('span', { 
            className: 'todo-text',
            onClick: () => toggleTodo(todo.id)
        }, todo.text),
        createElement('button', {
            className: 'delete-btn',
            onClick: () => deleteTodo(todo.id)
        }, '×')
    ]);
});

// Todo actions
function toggleTodo(id) {
    const todos = appStore.getState('todos');
    const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    appStore.setState('todos', updatedTodos);
}

function deleteTodo(id) {
    const todos = appStore.getState('todos');
    appStore.setState('todos', todos.filter(todo => todo.id !== id));
}
```

### 4.2 Main App Component

```javascript
const App = createComponent(() => {
    return createElement('div', { className: 'app' }, [
        Header(),
        createElement('main', { className: 'main-content' }, [
            TodoInput(),
            TodoList()
        ]),
        createElement('footer', { className: 'app-footer' }, [
            createElement('p', {}, `Total todos: ${appStore.getState('todos').length}`)
        ])
    ]);
});
```

### 4.3 Set Up Auto Re-rendering

```javascript
// Function to render the entire app
function renderApp() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = ''; // Clear previous content
    appendTo(render(App()), appElement);
}

// Initial render
renderApp();

// Re-render when state changes
appStore.subscribe(() => {
    renderApp();
});
```

## 🛣️ Step 5: Adding Routing (Multi-Page App)

### 5.1 Import Router Functions

```javascript
import { 
    registerRoute, 
    registerParamRoute, 
    setDefaultRoute, 
    initRouter, 
    navigateTo 
} from './src/router.js';
```

### 5.2 Create Page Components

```javascript
// Home page
const HomePage = createComponent(() => {
    const { user, todos } = appStore.getState();
    const completedTodos = todos.filter(todo => todo.completed).length;
    
    return createElement('div', { className: 'page home-page' }, [
        createElement('h2', {}, 'Dashboard'),
        createElement('div', { className: 'stats' }, [
            createElement('div', { className: 'stat-card' }, [
                createElement('h3', {}, todos.length.toString()),
                createElement('p', {}, 'Total Todos')
            ]),
            createElement('div', { className: 'stat-card' }, [
                createElement('h3', {}, completedTodos.toString()),
                createElement('p', {}, 'Completed')
            ])
        ]),
        createElement('div', { className: 'recent-todos' }, [
            createElement('h3', {}, 'Recent Todos'),
            ...todos.slice(-3).map(todo => 
                createElement('p', { 
                    className: `recent-todo ${todo.completed ? 'completed' : ''}` 
                }, todo.text)
            )
        ])
    ]);
});

// Todos page
const TodosPage = createComponent(() => {
    return createElement('div', { className: 'page todos-page' }, [
        createElement('h2', {}, 'Manage Todos'),
        TodoInput(),
        TodoList()
    ]);
});

// About page
const AboutPage = createComponent(() => {
    return createElement('div', { className: 'page about-page' }, [
        createElement('h2', {}, 'About This App'),
        createElement('p', {}, 'Built with RashidFramework - a lightweight JavaScript framework.'),
        createElement('ul', {}, [
            createElement('li', {}, 'Virtual DOM for efficient updates'),
            createElement('li', {}, 'Reactive state management'),
            createElement('li', {}, 'Client-side routing'),
            createElement('li', {}, 'Event delegation')
        ])
    ]);
});
```

### 5.3 Navigation Component

```javascript
const Navigation = createComponent(() => {
    const currentPath = window.location.pathname;
    
    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/todos', label: 'Todos' },
        { path: '/about', label: 'About' }
    ];
    
    return createElement('nav', { className: 'main-nav' }, [
        createElement('ul', { className: 'nav-list' },
            navItems.map(item =>
                createElement('li', {}, [
                    createElement('a', {
                        href: item.path,
                        className: currentPath === item.path ? 'active' : '',
                        onClick: (e) => {
                            e.preventDefault();
                            navigateTo(item.path);
                        }
                    }, item.label)
                ])
            )
        )
    ]);
});
```

### 5.4 Update Main App with Router

```javascript
const App = createComponent(() => {
    return createElement('div', { className: 'app' }, [
        Header(),
        Navigation(),
        createElement('main', { 
            className: 'main-content',
            id: 'router-container' 
        }, [
            // Router content will be injected here
        ])
    ]);
});

// Register routes
registerRoute('/', HomePage);
registerRoute('/todos', TodosPage);
registerRoute('/about', AboutPage);
setDefaultRoute(HomePage);

// Initialize router
initRouter('#router-container');

// Update rendering for router
function renderApp() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = '';
    appendTo(render(App()), appElement);
    
    // Re-initialize router after re-render
    initRouter('#router-container');
}
```

## 🎨 Step 6: Enhanced Styling

Add more comprehensive CSS to `style.css`:

```css
/* Add to existing styles */

/* Navigation */
.main-nav {
    background: #007bff;
    border-radius: 6px;
    margin-bottom: 20px;
}

.nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
}

.nav-list a {
    display: block;
    padding: 12px 20px;
    color: white;
    text-decoration: none;
    transition: background-color 0.2s;
}

.nav-list a:hover,
.nav-list a.active {
    background: rgba(255, 255, 255, 0.2);
}

/* Stats Dashboard */
.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 6px;
    text-align: center;
}

.stat-card h3 {
    font-size: 2em;
    margin: 0 0 10px 0;
    color: #007bff;
}

/* Todo Components */
.todo-input {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.todo-field {
    flex: 1;
    padding: 12px;
    border: 2px solid #e1e5e9;
    border-radius: 6px;
    font-size: 16px;
}

.add-btn {
    padding: 12px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.todo-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.todo-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-bottom: 1px solid #e1e5e9;
}

.todo-item.completed .todo-text {
    text-decoration: line-through;
    color: #6c757d;
}

.todo-text {
    flex: 1;
    cursor: pointer;
}

.delete-btn {
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    width: 30px;
    height: 30px;
    cursor: pointer;
}

.empty-state {
    text-align: center;
    padding: 40px;
    color: #6c757d;
}
```

## 🚀 Step 7: Advanced Features

### 7.1 Local Storage Persistence

```javascript
// Save state to localStorage
function saveToStorage() {
    const state = appStore.getState();
    localStorage.setItem('todoApp', JSON.stringify({
        todos: state.todos,
        user: state.user
    }));
}

// Load state from localStorage
function loadFromStorage() {
    const saved = localStorage.getItem('todoApp');
    if (saved) {
        const data = JSON.parse(saved);
        appStore.updateState(data);
    }
}

// Auto-save on state changes
appStore.subscribe(saveToStorage);

// Load on app start
loadFromStorage();
```

### 7.2 Custom Events and Notifications

```javascript
import { on, emit } from './src/eventDelegation.js';

// Set up notification system
const showNotification = (message, type = 'info') => {
    const notification = createElement('div', {
        className: `notification ${type}`,
        style: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#28a745' : '#007bff',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '6px',
            zIndex: '1000'
        }
    }, message);
    
    appendTo(render(notification), document.body);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
};

// Listen for todo events
on('todo:added', (todo) => {
    showNotification(`Added: ${todo.text}`, 'success');
});

on('todo:completed', (todo) => {
    showNotification(`Completed: ${todo.text}`, 'success');
});

// Update add todo function to emit events
function addTodo(text) {
    const todos = appStore.getState('todos');
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    appStore.setState('todos', [...todos, newTodo]);
    emit('todo:added', newTodo);
}
```

## 📦 Step 8: Build and Deploy

### 8.1 Production Build (Optional)

For a simple deployment, your files are ready as-is. For production optimization:

1. **Minify your JavaScript**: Use tools like Terser
2. **Bundle modules**: Use Rollup or Webpack if needed
3. **Optimize assets**: Compress images and CSS

### 8.2 Deployment Options

**Static Hosting (GitHub Pages, Netlify, Vercel):**
1. Upload your files to your hosting provider
2. Set up your build process if using one
3. Configure routing for SPA (single-page app)

**Simple Server Setup:**
```javascript
// server.js (if using Node.js)
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('.'));

// Handle client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

## 🎯 Next Steps and Best Practices

### Performance Tips
- Use `createSignal()` for frequently changing values
- Implement component-level state when global state isn't needed
- Use event delegation for lists with many items

### Code Organization
```
my-app/
├── index.html
├── style.css
├── app.js
├── src/                 # Framework files
├── components/          # Your reusable components
│   ├── Header.js
│   ├── TodoItem.js
│   └── Navigation.js
├── pages/              # Page components
│   ├── HomePage.js
│   ├── TodosPage.js
│   └── AboutPage.js
├── utils/              # Helper functions
│   ├── storage.js
│   └── notifications.js
└── assets/             # Images, fonts, etc.
```

### Testing Your App
- Test in multiple browsers
- Check responsive design on different screen sizes
- Test with JavaScript disabled (graceful degradation)
- Verify routing works with direct URL access

### Debugging Tips
- Use browser DevTools to inspect virtual DOM elements
- Add logging to state changes: `appStore.subscribe(console.log)`
- Use `debugger` statements for step-through debugging

## 🏁 Conclusion

Congratulations! You've built a complete web application using RashidFramework. You now know how to:

- ✅ Set up a project structure
- ✅ Create interactive components
- ✅ Manage application state
- ✅ Handle user events
- ✅ Implement client-side routing
- ✅ Style your application
- ✅ Add advanced features like persistence and notifications
- ✅ Deploy your application

Keep exploring the framework's capabilities and building more complex applications!