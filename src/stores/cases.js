import { defineStore } from 'pinia';
import { alovaInstance as http } from '@/apis/base.js';
import { useTeamStore } from './team';

const $teamStore = useTeamStore();
let currentPageIndex = 1;

export const useCasesStore = defineStore('cases', {
    state: () => {
        return {
            list: [],
            totalCount: 0,
            loading: false
        };
    },
    actions: {
        async getCasesByPlanId(planId, pageIndex = 1) {
            if (!$teamStore.currentTeam.id) {
                throw new Error('请先选择团队');
            }
            if (pageIndex) {
                currentPageIndex = pageIndex;
            }
            this.loading = true;
            let res = null;
            try {
                res = await http.Get(`/api/v1/${planId}/cases`, {
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
            this.list = res.list.map((i) => {
                return {
                    id: i.id,
                    name: i.name,
                    status: i.status,
                    content: JSON.stringify(i.content, 0, 4),
                    mrd: i.mrd,
                    createAt: new Date(i.create_at),
                    modifiedAt: new Date(i.modified_at),
                    creator: i.user.username
                };
            });
            this.totalCount = res.totalCount;
        },
        async createCase(planId, files) {
            const fm = new FormData();
            fm.append('files', files);
            await http.Post(`/api/v1/${planId}/cases`, fm, {
                params: {
                    teamId: $teamStore.currentTeam.id
                }
            });
            await this.getCasesByPlanId(planId);
        },
        async renameCase(planId, caseId, name) {
            await http.Put(
                `/api/v1/${planId}/cases/${caseId}`,
                { name },
                {
                    params: {
                        teamId: $teamStore.currentTeam.id
                    }
                }
            );
            await this.getCasesByPlanId(planId, currentPageIndex);
        },
        async removeCase(planId, caseId) {
            await http.Delete(
                `/api/v1/${planId}/cases/${caseId}`,
                {},
                {
                    params: {
                        teamId: $teamStore.currentTeam.id
                    }
                }
            );
            await this.getCasesByPlanId(planId, currentPageIndex);
        },
        async modifiyCaseContent(planId, caseId, content) {
            await http.Put(
                `/api/v1/${planId}/cases/${caseId}`,
                { content },
                {
                    params: {
                        teamId: $teamStore.currentTeam.id
                    }
                }
            );
            await this.getCasesByPlanId(planId, currentPageIndex);
        },
        async invokeCases(planId, casesIds = [], info = {}) {
            await http.Post(
                `/api/v1/${planId}/invoke`,
                { caseIds: JSON.stringify(casesIds), info },
                {
                    params: {
                        teamId: $teamStore.currentTeam.id
                    }
                }
            );
        }
    }
});
