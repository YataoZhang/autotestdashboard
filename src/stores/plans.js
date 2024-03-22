import { defineStore } from 'pinia';
import { alovaInstance as http } from '@/apis/base.js';

let currentSearchValue = '';
let currentPageIndex = 1;

export const usePlansStore = defineStore('plans', {
    state: () => {
        return {
            list: [],
            totalCount: 0,
            loading: false
        };
    },
    actions: {
        async getAllPlans(teamId, pageIndex = 1, forceClear = false) {
            if (pageIndex) {
                currentPageIndex = pageIndex;
            }
            if (forceClear) {
                currentSearchValue = '';
                currentPageIndex = 1;
            }
            let res = null;
            // this.$patch((state) => {
            //     state.loading = true;
            // });
            this.loading = true;
            try {
                res = await http.Get(`/api/v1/plans/${teamId}`, {
                    params: {
                        pageIndex: currentPageIndex || 1,
                        searchValue: currentSearchValue
                    }
                });
            } catch (ex) {
                throw ex;
            } finally {
                this.loading = false;
            }

            this.list = res.list.map((i) => {
                return {
                    id: i.id,
                    name: i.name,
                    type: i.type,
                    status: i.status,
                    modifiedAt: new Date(i.modified_at),
                    creator: i.user.username,
                    casesCount: i._count.Case
                };
            });
            this.totalCount = res.totalCount;
        },
        async getPlanInfo(teamId, planId) {
            const res = await http.Get(`/api/v1/plans/${teamId}`, {
                params: {
                    planId
                }
            });
            return res;
        },
        async searchPlans(teamId, searchValue) {
            currentSearchValue = searchValue;
            await this.getAllPlans(teamId);
        },
        async createPlan(teamId, planName) {
            await http.Put(
                `/api/v1/plans/${teamId}`,
                {
                    planName
                },
                { params: { type: 'add' } }
            );
            await this.getAllPlans(teamId, 1, true);
        },
        async removePlan(teamId, planId) {
            await http.Delete(
                `/api/v1/plans/${teamId}`,
                {},
                {
                    params: {
                        planId
                    }
                }
            );
            await this.getAllPlans(teamId, 1, true);
        },
        async renamePlan(teamId, planId, planName) {
            await http.Put(
                `/api/v1/plans/${teamId}`,
                {
                    planName,
                    planId
                },
                { params: { type: 'modified' } }
            );
            await this.getAllPlans(teamId, 1, true);
        }
    }
});
