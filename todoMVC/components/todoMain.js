import RashidFramework from '../../src/framework.js';
import { todoStore, todoActions } from './todoApp.js';

export const TodoMain = RashidFramework.createComponent(() => {
    if (!todoStore.todos || todoStore.todos.length === 0) {
        return RashidFramework.createElement('section', { className: 'main', style: { display: 'none' } }, []);
    }

    const visibleTodos = getVisibleTodos(todoStore.todos, todoStore.filter);
    const allCompleted = todoStore.todos.every(todo => todo.completed);

    return RashidFramework.createElement('section', { className: 'main' }, [
        RashidFramework.createElement('input', {
            id: 'toggle-all',
            className: 'toggle-all',
            type: 'checkbox',
            checked: allCompleted,
            onchange: () => todoActions.toggleAll()
        }),
        RashidFramework.createElement('label', { for: 'toggle-all' }, 'Mark all as complete'),
        RashidFramework.createElement('ul', { className: 'todo-list' },
            visibleTodos.map(todo => createTodoItem(todo))
        )
    ]);
});

function createTodoItem(todo) {
    const isEditing = todoStore.editingId === todo.id;
    
    // Build class name based on state
    let className = '';
    if (todo.completed) className += 'completed';
    if (isEditing) className += (className ? ' ' : '') + 'editing';

    const children = [];

    // Always include the view div (hidden when editing)
    children.push(
        RashidFramework.createElement('div', { className: 'view' }, [
            RashidFramework.createElement('input', {
                className: 'toggle',
                type: 'checkbox',
                checked: todo.completed,
                onchange: () => todoActions.toggleTodo(todo.id) 
            }),
            RashidFramework.createElement('label', {
                ondblclick: () => todoActions.startEditing(todo.id)
            }, todo.text),
            RashidFramework.createElement('button', {
                className: 'destroy',
                onclick: () => todoActions.deleteTodo(todo.id)
            })
        ])
    );

    // Add edit input when editing
    if (isEditing) {
        children.push(
            RashidFramework.createElement('input', {
                className: 'edit',
                // FIXED: Use explicit check for undefined/null instead of ||
                value: todoStore.editingText !== undefined && todoStore.editingText !== null 
                    ? todoStore.editingText 
                    : todo.text,
                oninput: (e) => todoActions.updateEditingText(e.target.value),
                onkeydown: (e) => handleEditKeyDown(e, todo.id),
                onblur: (e) => handleEditBlur(e, todo.id),
                autoFocus: true
            })
        );
    }

    return RashidFramework.createElement('li', {
        key: todo.id,
        className: className.trim()
    }, children);
}

// Flag to prevent race conditions between blur and keydown events
let isProcessingEdit = false;

function handleEditKeyDown(e, todoId) {
    if (isProcessingEdit) return;
    
    if (e.key === 'Enter') {
        e.preventDefault();
        isProcessingEdit = true;
        todoActions.saveEdit(todoId);
        // Reset flag after a short delay
        setTimeout(() => { isProcessingEdit = false; }, 50);
    } else if (e.key === 'Escape') {
        e.preventDefault();
        isProcessingEdit = true;
        todoActions.cancelEdit();
        setTimeout(() => { isProcessingEdit = false; }, 50);
    }
}

function handleEditBlur(e, todoId) {
    if (isProcessingEdit) return;
    
    // Small delay to prevent race condition with keydown
    setTimeout(() => {
        if (!isProcessingEdit && todoStore.editingId === todoId) {
            todoActions.saveEdit(todoId);
        }
    }, 10);
}

function getVisibleTodos(todos, filter) {
    switch (filter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}