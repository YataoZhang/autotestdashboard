import { defineStore } from 'pinia';
import { alovaInstance as http } from '@/apis/base.js';
import { useTeamStore } from './team';

const $teamStore = useTeamStore();
let currentPageIndex = 1;

export const useHistoryStore = defineStore('history', {
    state: () => {
        return {
            list: [],
            totalCount: 0,
            loading: false
        };
    },
    actions: {
        async getInvokeHistoryList(planId, pageIndex) {
            if (pageIndex) {
                currentPageIndex = pageIndex;
            }
            if (!$teamStore.currentTeam.id) {
                throw new Error('请先选择团队');
            }
            if (pageIndex) {
                currentPageIndex = pageIndex;
            }
            this.loading = true;
            let res = null;
            try {
                res = await http.Get(`/api/v1/${planId}/history`, {
                    params: {
                        teamId: $teamStore.currentTeam.id,
                        pageIndex
                    }
                });
            } catch (ex) {
                throw ex;
            } finally {
                this.loading = false;
            }
            // {
            //                 "id": 2,
            //                 "start_at": "2024-03-15T09:00:33.000Z",
            //                 "end_at": null,
            //                 "status": 0,
            //                 "reporter_link": null,
            //                 "detail_link": null,
            //                 "compare_link": null,
            //                 "user": {
            //                     "username": "zhangyatao",
            //                     "id": 1
            //                 }
            //             },
            this.list = res.list.map((i) => {
                return {
                    id: i.id,
                    startAt: new Date(i.start_at),
                    endAt: i.end_at ? new Date(i.end_at) : '',
                    status: i.status,
                    reporterLink: i.reporter_link,
                    detailLink: i.detail_link,
                    compareLink: i.compare_link,
                    triggerUser: i.user.username
                };
            });
            this.totalCount = res.totalCount;
        },
        async refreshRecord(planId, historyId) {
            const res = await http.Get(
                `/api/v1/${planId}/history/${historyId}`,
                {
                    params: {
                        teamId: $teamStore.currentTeam.id
                    }
                }
            );
            const history = {
                id: res.id,
                startAt: new Date(res.start_at),
                endAt: res.end_at ? new Date(res.end_at) : '',
                status: res.status,
                reporterLink: res.reporter_link,
                detailLink: res.detail_link,
                compareLink: res.compare_link,
                triggerUser: res.user.username
            };
            const one = this.list.find((i) => {
                return i.id === historyId;
            });
            if (!one) {
                return;
            }
            Object.assign(one, history);
        }
    }
});
