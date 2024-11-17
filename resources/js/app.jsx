import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';  // Importer GoogleOAuthProvider

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Récupérez votre CLIENT_ID à partir des variables d'environnement pour des raisons de sécurité
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <App {...props} />
            </GoogleOAuthProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});