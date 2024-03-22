import { defineStore } from 'pinia';
import { alovaInstance as http } from '@/apis/base.js';

const currentTeamKey = +localStorage.getItem('currentTeamKey');

let currentPageIndex = 1;
let currentSearchValue = '';
export const useTeamStore = defineStore('team', {
    state: () => {
        return {
            currentTeam: {
                id: currentTeamKey || '',
                name: '未选择团队',
                owner: ''
            },
            teams: [],
            members: {
                list: [],
                loading: false,
                totalCount: 0
            },
            teamsLoading: Promise.resolve()
        };
    },
    actions: {
        async getAllTeamsOfMine() {
            let p = null;
            this.teamsLoading = new Promise((resolve, reject) => {
                p = { resolve, reject };
            });
            const teams = await http.Get(`/api/v1/teams`).catch((ex) => {
                console.log(ex);
                return [];
            });
            this.teams = teams;
            p.resolve();
            if (this.currentTeam.id) {
                const matched = this.teams.find(
                    (i) => +i.id === +this.currentTeam.id
                );
                if (matched) {
                    this.currentTeam = matched;
                } else {
                    this.currentTeam = {
                        id: '',
                        name: '未选择团队',
                        owner: ''
                    };
                    localStorage.removeItem('currentTeamKey');
                    window.location.reload();
                }
            }
        },
        async getAllMembersByTeamId(teamId, pageIndex, searchValue) {
            this.members.loading = true;
            if (pageIndex) {
                currentPageIndex = pageIndex;
            }
            if (searchValue !== undefined) {
                currentSearchValue = searchValue;
            }

            let res = null;
            try {
                res = await http.Get(`/api/v1/members/${teamId}`, {
                    params: {
                        pageIndex: currentPageIndex || 1,
                        searchValue: currentSearchValue
                    }
                });
            } catch (ex) {
                throw ex;
            } finally {
                this.members.loading = false;
            }
            this.members.list = res.list.map((i) => {
                return {
                    id: i.id,
                    nickname: i.nickname,
                    status: i.status,
                    userId: i.user.id,
                    uid: i.user.uid,
                    username: i.user.username
                };
            });
            this.members.totalCount = res.totalCount;
        },
        async addTeam(name) {
            const res = await http.Post(`/api/v1/teams`, { name });
            await this.getAllTeamsOfMine();
            return res.id;
        },
        setCurrentTeam(teamId) {
            const team = this.teams.find((i) => i.id === teamId);
            if (!team) {
                return;
            }
            localStorage.setItem('currentTeamKey', team.id);
            this.currentTeam = team;
        },
        async addTeamMember(teamId, username) {
            await http.Put(
                `/api/v1/members/${teamId}`,
                { username },
                { params: { type: 'add' } }
            );
            await this.getAllMembersByTeamId(teamId);
        },
        async removeTeamMember(teamId, memberId, userId) {
            await http.Delete(
                `/api/v1/members/${teamId}`,
                {},
                {
                    params: { memberId, userId }
                }
            );
            await this.getAllMembersByTeamId(teamId);
        },
        async searchTeamMember(teamId, memberName) {
            await this.getAllMembersByTeamId(teamId, 1, memberName);
        },
        async setNickName(teamId, nickname, id) {
            await http.Put(
                `/api/v1/members/${teamId}`,
                { nickname, memberId: id },
                {
                    params: {
                        type: 'modified'
                    }
                }
            );
        },
        async getNickName(teamId) {
            return http.Get(`/api/v1/members/${teamId}`, {
                params: {
                    onlyMe: 1
                }
            });
        },
        async changeTeamName(teamId, name) {
            await http.Put(`/api/v1/teams/${teamId}`, { name });
            await this.getAllTeamsOfMine();
        },
        async transferAuthority(teamId, recipientName) {
            await http.Put(`/api/v1/teams/${teamId}`, {
                ownerName: recipientName
            });
            await this.getAllTeamsOfMine();
        },
        async dissloveTeam(teamId) {
            await http.Delete(`/api/v1/teams/${teamId}`);
            await this.getAllTeamsOfMine();
        }
    }
});
