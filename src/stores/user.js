import { defineStore } from 'pinia';
import { alovaInstance as http } from '@/apis/base.js';

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            loading: Promise.resolve(),
            isLogin: false,
            userData: {
                id: 0,
                username: '',
                uid: ''
            }
        };
    },
    actions: {
        async login(username, password) {
            if (this.isLogin) {
                return;
            }
            await http.Post('/api/v1/login', { username, password });
            const {
                id,
                username: name,
                uid,
                isLogin
            } = await http.Get('/api/v1/user');
            if (!isLogin) {
                throw new Error('登录失败');
            }
            this.$patch({
                isLogin,
                userData: {
                    id,
                    username: name,
                    uid
                }
            });
        },
        async register(username, password) {
            return http.Post('/api/v1/signup', {
                username,
                password
            });
        },
        async logout() {
            if (!this.isLogin) {
                return;
            }
            await http.Get('/api/v1/logout');
            this.isLogin = false;
        },
        async getUserInfo() {
            let p = null;
            this.loading = new Promise((resolve, reject) => {
                p = { resolve, reject };
            });
            let res = null;
            try {
                res = await http.Get('/api/v1/user');
            } catch (ex) {
                p.resolve();
                return;
            }
            const { id, username: name, uid, isLogin } = res;
            if (!isLogin) {
                p.resolve();
                return;
            }
            this.$patch({
                isLogin,
                userData: {
                    id,
                    username: name,
                    uid
                }
            });
            p.resolve();
        }
    }
});
