import {createRouter, createWebHistory} from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

import adminRoutes from '@/router/admin.router.js'
import gardeRoutes from '@/router/garde.router.js'
import sdisRoutes from '@/router/sdis.router.js'
import gestionnaireRoutes from '@/router/gestionnaire.router.js'
import {useAuthStore} from "@/stores/modules/auth.store.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: '/dashboard',
            component: DashboardView,
            meta: {
                requiresAuth: true,
                roles: ['admin', 'garde', 'gestionnaire']
            },
            children: [
                {
                    path: '',
                    name: 'measures',
                    component: () => import('@/components/dashboard/ModulesAndMeasuresView.vue'),
                },
                {
                    path: 'history',
                    name: 'history',
                    component: () => import('@/components/dashboard/HistoryView.vue'),
                },
                {
                    path: 'modules',
                    name: 'modules-management',
                    component: () => import('@/components/dashboard/ModulesManagementView.vue'),
                },
                {
                    path: 'accounts',
                    name: 'accounts-management',
                    component: () => import('@/components/dashboard/AccountsManagementView.vue'),
                    meta: {
                        roles: ['admin']
                    }
                },
            ]
        },
        {
            path: '/account',
            component: () => import('@/views/AccountView.vue'),
            meta: {requiresAuth: true}
        },
        {
            path: '/login',
            component: () => import('@/views/LoginView.vue')
        },
        {
            path: '/',
            component: () => import('@/views/HomeView.vue')
        },
    ]
})

router.beforeEach((to, from) => {
    const authStore = useAuthStore();

    // verify auth
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return '/login';
    }

    // verify permissions
    if (to.meta.roles) {
        const userRights = authStore.currentUser?.rights || [];

        const hasRole = to.meta.roles.some(role =>
            userRights.includes(role)
        );

        if (!hasRole) {
            // to avoid a redirection loop
            if (to.path !== '/') {
                return '/';
            }

            return false;
        }
    }

    return true;
});



export default router