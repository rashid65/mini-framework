import RashidFramework from '../../src/framework.js';
import { TodoHeader } from '../components/todoHeader.js';
import { TodoMain } from '../components/todoMain.js';
import { TodoFooter } from '../components/todoFooter.js';
import { todoActions, todoStore } from '../components/todoApp.js';

export const AllTodosPage = RashidFramework.createComponent((state) => {
    if (!state._inited) {
        state._inited = true;
        if (todoStore.filter !== 'all') todoActions.setFilter('all');
    }

    return RashidFramework.createElement('div', {}, [
        TodoHeader(),
        TodoMain(),
        TodoFooter()
    ]);
}, { _inited: false });