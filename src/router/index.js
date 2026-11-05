import {createRouter, createWebHistory} from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', redirect: '/dashboard'},
    {
      path: '/dashboard',
      component: DashboardView,
      children: [
        {path: '', name: 'measures', component: () => import('@/components/dashboard/ModulesAndMeasuresView.vue')},
        {path: 'history', name: 'history', component: () => import('@/components/dashboard/HistoryView.vue')},
        {path: 'modules', name: 'modules-management', component: () => import('@/components/dashboard/ModulesManagementView.vue')},
        {path: 'accounts', name: 'accounts-management', component: () => import('@/components/dashboard/AccountsManagementView.vue')}
      ]
    }
  ]
})

export default router