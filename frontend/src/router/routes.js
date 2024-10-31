import UserLogin from 'layouts/UserLogin.vue';
import MainLayout from 'layouts/MainLayout.vue';
import ErrorNotFound from 'pages/ErrorNotFound.vue';

const routes = [
  {
    path: '/',
    name: 'home-page',
    component: UserLogin, // Default layout
  },
  {
    path: '/main',
    name: 'main-layout',
    component: MainLayout, // Main layout for authenticated users
  },
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound, // 404 page
  }
];

export default routes; // Export the routes for use in the router
