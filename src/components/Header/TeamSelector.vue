<template>
    <div class="groups">
        <span>选择团队</span>
        <a-dropdown>
            <template #overlay>
                <a-menu @click="selectTeam">
                    <a-menu-item
                        v-for="(item, index) of teams"
                        :key="item.id"
                        v-model:selectedKeys="selectedKeys"
                    >
                        <UserOutlined />
                        {{ item.name }}
                    </a-menu-item>
                </a-menu>
            </template>
            <a-button
                :disabled="teams.length === 0"
                class="select-group"
            >
                {{ teams.length === 0 ? '暂无团队' : currentTeam.name }}
                <DownOutlined />
            </a-button>
        </a-dropdown>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { DownOutlined, UserOutlined } from '@ant-design/icons-vue';
import { useTeamStore } from '@/stores/team.js';

const $router = useRouter();
const $route = useRoute();
const $teamStore = useTeamStore();

const selectedKeys = ref([]);
const { teams, currentTeam } = storeToRefs($teamStore);

const selectTeam = (team) => {
    $teamStore.setCurrentTeam(team.key);

    if ($route.name === 'plans_alert') {
        $router.push({
            name: 'plans_home'
        });
    }
};
</script>

<style lang="scss">
.ant-dropdown-link {
    color: rgba(0, 0, 0, 0.88);
}
.groups {
    margin: 0 20px 0 30px;
    .select-group {
        margin-left: 15px;
    }
}
</style>
