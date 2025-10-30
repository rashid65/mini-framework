import RashidFramework from '../../src/framework.js';
import { todoStore, todoActions } from './todoApp.js';

export const TodoFooter = RashidFramework.createComponent(() => {
    if (!todoStore.todos || todoStore.todos.length === 0) {
        return RashidFramework.createElement('footer', { className: 'footer', style: { display: 'none' } }, []);
    }

    const activeTodos = todoStore.todos.filter(todo => !todo.completed);
    const completedTodos = todoStore.todos.filter(todo => todo.completed);
    const activeCount = activeTodos.length; 

    return RashidFramework.createElement('footer', { className: 'footer' }, [
        RashidFramework.createElement('span', { className: 'todo-count' }, [
            RashidFramework.createElement('strong', {}, activeCount.toString()),
            ` item${activeCount === 1 ? '' : 's'} left`
        ]),
        RashidFramework.createElement('ul', { className: 'filters' }, [
            RashidFramework.createElement('li', {}, [
                RashidFramework.createElement('a', {
                    href: '#/',
                    className: todoStore.filter === 'all' ? 'selected' : '',
                    onclick: (e) => {
                        e.preventDefault();
                        if (todoStore.filter !== 'all') todoActions.setFilter('all');
                        RashidFramework.navigateTo('/');
                    }
                }, 'All')
            ]),
            RashidFramework.createElement('li', {}, [
                RashidFramework.createElement('a', {
                    href: '#/active',
                    className: todoStore.filter === 'active' ? 'selected' : '',
                    onclick: (e) => {
                        e.preventDefault();
                        if (todoStore.filter !== 'active') todoActions.setFilter('active');
                        RashidFramework.navigateTo('/active');
                    }
                }, 'Active')
            ]),
            RashidFramework.createElement('li', {}, [
                RashidFramework.createElement('a', {
                    href: '#/completed',
                    className: todoStore.filter === 'completed' ? 'selected' : '',
                    onclick: (e) => {
                        e.preventDefault();
                        if (todoStore.filter !== 'completed') todoActions.setFilter('completed');
                        RashidFramework.navigateTo('/completed');
                    }
                }, 'Completed')
            ])
        ]),
        completedTodos.length > 0 ? RashidFramework.createElement('button', {
            className: 'clear-completed',
            onclick: () => todoActions.clearCompleted()
        }, 'Clear completed') : null
    ].filter(Boolean));
});