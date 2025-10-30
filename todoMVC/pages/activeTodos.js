import RashidFramework from '../../src/framework.js';
import { TodoMain } from '../components/todoMain.js';
import { TodoFooter } from '../components/todoFooter.js';
import { TodoHeader } from '../components/todoHeader.js';
import { todoActions, todoStore } from '../components/todoApp.js';

export const ActiveTodosPage = RashidFramework.createComponent((state) => {
    if (!state._inited) {
        state._inited = true;
        if (todoStore.filter !== 'active') todoActions.setFilter('active');
    }

    return RashidFramework.createElement('div', {}, [
        TodoHeader(),
        TodoMain(),
        TodoFooter()
    ]);
}, { _inited: false });