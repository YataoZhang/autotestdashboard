import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useTeamStore } from '@/stores/team';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import NotFound from '../views/NotFound/index.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'root',
            redirect: { name: 'plans_home' }
        },
        {
            path: '/login',
            name: 'login',
            beforeEnter: async () => {
                const user = useUserStore();
                await user.loading;
                if (user.isLogin) {
                    return { to: 'plans_home' };
                }
            },
            component: LoginView
        },
        {
            path: '/signup',
            name: 'signup',
            component: SignupView
        },
        {
            path: '/team',
            name: 'team',
            component: HomeView,
            redirect: { name: 'team_home' },
            children: [
                {
                    path: '',
                    name: 'team_home',
                    meta: { requireAuth: true },
                    component: () => import('../views/Team/Index.vue')
                },
                {
                    path: 'create',
                    name: 'team_create',
                    meta: { requireAuth: true },
                    component: () => import('../views/Team/Create.vue')
                },
                {
                    path: ':id',
                    name: 'team_profile',
                    meta: { requireAuth: true },
                    component: () => import('../views/Team/Profile/Index.vue')
                }
            ]
        },
        {
            path: '/plans',
            name: 'plans',
            component: HomeView,
            redirect: { name: 'plans_home' },
            children: [
                {
                    path: 'home',
                    name: 'plans_home',
                    meta: { requireAuth: true, requireTeamSelected: true },
                    component: () => import('../views/TestPlans/List/Index.vue')
                },
                {
                    path: ':id',
                    name: 'plans_verbose',
                    meta: { requireAuth: true, requireTeamSelected: true },
                    component: () =>
                        import('../views/TestPlans/Verbose/Index.vue')
                },
                {
                    path: 'alert',
                    name: 'plans_alert',
                    meta: { requireAuth: true },
                    component: () =>
                        import('../views/TestPlans/Alert/Index.vue')
                }
            ]
        },
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
    ]
});

router.beforeEach(async (to, from) => {
    const user = useUserStore();
    await user.loading;
    if (to.meta.requireAuth && !user.isLogin) {
        return { name: 'login' };
    }
    const team = useTeamStore();
    if (to.meta.requireTeamSelected && !team.currentTeam.id) {
        return { name: 'plans_alert' };
    }
});

export default router;
