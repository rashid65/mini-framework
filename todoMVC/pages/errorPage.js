import RashidFramework from '../../src/framework.js';

export const ErrorPage = RashidFramework.createComponent(() => {
    return RashidFramework.createElement('div', { className: 'error-page' }, [
        RashidFramework.createElement('div', { className: 'error-content' }, [
            RashidFramework.createElement('h1', { className: 'error-title' }, '404'),
            RashidFramework.createElement('h2', { className: 'error-subtitle' }, 'Page Not Found'),
            RashidFramework.createElement('p', { className: 'error-message' }, 
                'The page you are looking for does not exist.'
            ),
            RashidFramework.createElement('div', { className: 'error-actions' }, [
                RashidFramework.createElement('button', {
                    className: 'error-btn secondary',
                    onClick: () => window.history.back()
                }, 'Go Back')
            ])
        ])
    ]);
});