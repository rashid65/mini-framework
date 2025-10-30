import RashidFramework from '../../src/framework.js';
import { TodoFooter } from '../components/todoFooter.js';
import { TodoHeader } from '../components/todoHeader.js';
import { TodoMain } from '../components/todoMain.js';
import { todoActions, todoStore } from '../components/todoApp.js';

export const CompletedTodosPage = RashidFramework.createComponent((state) => {
    if (!state._inited) {
        state._inited = true;
        if (todoStore.filter !== 'completed') todoActions.setFilter('completed');
    }

    return RashidFramework.createElement('div', {}, [
        TodoHeader(),
        TodoMain(),
        TodoFooter()
    ]);
}, { _inited: false });