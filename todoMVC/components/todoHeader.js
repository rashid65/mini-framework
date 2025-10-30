import RashidFramework from '../../src/framework.js';
import { todoStore, todoActions } from './todoApp.js';

export const TodoHeader = RashidFramework.createComponent(() => {
    const handleSubmit = (e) => {
        e.preventDefault();
        todoActions.addTodo(todoStore.newTodo);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            todoActions.addTodo(todoStore.newTodo);
        }
    };

    return RashidFramework.createElement('header', { className: 'header' }, [
        RashidFramework.createElement('h1', {}, 'todos'),
        RashidFramework.createElement('input', {
            className: 'new-todo',
            placeholder: 'What needs to be done?',
            value: todoStore.newTodo,
            oninput: (e) => todoActions.updateNewTodo(e.target.value),
            onkeypress: handleKeyPress,
            autoFocus: true
        })
    ]);
});