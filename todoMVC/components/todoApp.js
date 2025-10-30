import RashidFramework from "../../src/framework.js";

// localStorage key for todos
const STORAGE_KEY = 'rashid-todomvc-todos';

// Load todos from localStorage or use default
function loadTodosFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.warn('Error loading todos from localStorage:', error);
    }
    
    // Return default todos if nothing in storage or error occurred
    return [
        { id: 1, text: 'welcome to rashid TODO List', completed: false },
        { id: 2, text: 'click to toggle complete', completed: false },
        { id: 3, text: 'double click to edit', completed: false },
        { id: 4, text: 'click x to delete', completed: false }
    ];
}

// Save todos to localStorage
function saveTodosToStorage(todos) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.warn('Error saving todos to localStorage:', error);
    }
}

// Create state with loaded todos
export const todoStore = RashidFramework.createState({
    todos: loadTodosFromStorage(),
    newTodo: '',
    filter: 'all',
    editingId: null,
    editingText: ''
});

// Subscribe to todos changes and save to localStorage
RashidFramework.on('stateChange', (data) => {
    if (data.property === 'todos') {
        saveTodosToStorage(data.value);
    }
});

let toggleDebounce = {};

//- Todo actions
export const todoActions = {
    // Add new todo
    addTodo: (text) => {
        if (text.trim()) {
            const newTodo = {
                id: Date.now(),
                text: text.trim(),
                completed: false
            };
            todoStore.todos = [...todoStore.todos, newTodo];
            todoStore.newTodo = ''; // Clear input after adding
        }
    },

    // Toggle todo completion with debouncing
    toggleTodo: (id) => {
        if (toggleDebounce[id]) return; // Prevent rapid toggles
        toggleDebounce[id] = true;
        
        todoStore.todos = todoStore.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        
        setTimeout(() => {
            delete toggleDebounce[id];
        }, 100); // 100ms debounce
    },

    // Delete a todo
    deleteTodo: (id) => {
        // Cancel editing if we're deleting the item being edited
        if (todoStore.editingId === id) {
            todoStore.editingId = null;
            todoStore.editingText = '';
        }
        todoStore.todos = todoStore.todos.filter(todo => todo.id !== id);
    },

    // Toggle all todos with debouncing
    toggleAll: () => {
        if (toggleDebounce.all) return;
        toggleDebounce.all = true;
        
        const allCompleted = todoStore.todos.every(todo => todo.completed);
        todoStore.todos = todoStore.todos.map(todo => ({
            ...todo,
            completed: !allCompleted
        }));
        
        setTimeout(() => {
            delete toggleDebounce.all;
        }, 100);
    },
    
    // Clear completed todos
    clearCompleted: () => {
        // Cancel editing if we're clearing a completed item being edited
        if (todoStore.editingId) {
            const editingTodo = todoStore.todos.find(todo => todo.id === todoStore.editingId);
            if (editingTodo && editingTodo.completed) {
                todoStore.editingId = null;
                todoStore.editingText = '';
            }
        }
        todoStore.todos = todoStore.todos.filter(todo => !todo.completed);
    },

    // Update filter
    setFilter: (filter) => {
        if (todoStore.filter === filter) return; // prevent redundant emits
        todoStore.filter = filter;
    },

    // Update new todo input
    updateNewTodo: (value) => {
        todoStore.newTodo = value;
    },

    // Start editing a todo
    startEditing: (id) => {
        const todo = todoStore.todos.find(todo => todo.id === id);
        if (todo) {
            todoStore.editingId = id;
            todoStore.editingText = todo.text; // Set to current text
        }
    },

    // Update editing text - FIXED: Allow empty strings
    updateEditingText: (text) => {
        // Don't use || operator here, allow empty strings
        todoStore.editingText = text;
    },

    // Save edit - FIXED to match TodoMVC behavior
    saveEdit: (id) => {
        // If no editing is happening, do nothing
        if (todoStore.editingId !== id) return;
        
        // Use the current editing text, not a fallback
        const currentText = todoStore.editingText;
        const trimmedText = (currentText || '').trim();
        
        if (trimmedText === '') {
            // FIXED: Cancel edit instead of deleting todo when empty
            // This reverts to original text (standard TodoMVC behavior)
            todoActions.cancelEdit();
        } else {
            // Update todo text
            todoStore.todos = todoStore.todos.map(todo =>
                todo.id === id ? { ...todo, text: trimmedText } : todo
            );
            // Clear editing state after successful save
            todoStore.editingId = null;
            todoStore.editingText = '';
        }
    },

    // Cancel edit - revert to original text
    cancelEdit: () => {
        todoStore.editingId = null;
        todoStore.editingText = '';
    },

    // Clear all todos (for testing)
    clearAllTodos: () => {
        todoStore.todos = [];
        todoStore.editingId = null;
        todoStore.editingText = '';
    },

    // Reset to default todos
    resetToDefaults: () => {
        todoStore.todos = [
            { id: Date.now(), text: 'welcome to rashid TODO List', completed: false },
            { id: Date.now() + 1, text: 'click to toggle complete', completed: false },
            { id: Date.now() + 2, text: 'double click to edit', completed: false },
            { id: Date.now() + 3, text: 'click x to delete', completed: false }
        ];
        todoStore.editingId = null;
        todoStore.editingText = '';
    }
};