import RashidFramework from '../src/framework.js';
import { AllTodosPage } from './pages/allTodos.js';
import { ActiveTodosPage } from './pages/activeTodos.js';
import { CompletedTodosPage } from './pages/completedTodos.js';
import { ErrorPage } from './pages/errorPage.js';

// Register routes
RashidFramework.registerRoute('/', AllTodosPage);
RashidFramework.registerRoute('/active', ActiveTodosPage);
RashidFramework.registerRoute('/completed', CompletedTodosPage);

// Set error page as default route for unknown URLs
RashidFramework.setDefaultRoute(ErrorPage);

// Initialize router
RashidFramework.initRouter('#app-root');

// Navigation helper function for testing
window.todoMVC = {
    showAll: () => RashidFramework.navigateTo('/'),
    showActive: () => RashidFramework.navigateTo('/active'),
    showCompleted: () => RashidFramework.navigateTo('/completed'),
    show404: () => RashidFramework.navigateTo('/nonexistent-page')
};