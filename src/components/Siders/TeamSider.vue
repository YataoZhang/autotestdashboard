<template>
    <a-menu
        class="menu"
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        theme="light"
        :items="teamsDataSource"
        @click="asideClick"
    >
    </a-menu>
</template>
<script setup>
import { storeToRefs } from 'pinia';
import { h, ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { TeamOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useTeamStore } from '@/stores/team.js';

const $store = useTeamStore();
const $router = useRouter();
const $route = useRoute();

const selectedKeys = ref([]);
const teamsDataSource = ref([]);

const getTeamsDataSource = async () => {
    await $store.teamsLoading;
    const greatTeams = $store.teams.map((i) => {
        return {
            // ...i,
            key: i.id,
            label: i.name,
            title: i.name
        };
    });
    return [
        {
            id: 'myTeam',
            key: 'myTeam',
            icon: () => h(TeamOutlined),
            label: '我的团队',
            title: '我的团队',
            type: 'group',
            children: [
                ...greatTeams,
                {
                    id: 'createTeam',
                    key: 'createTeam',
                    icon: () => h(PlusOutlined),
                    label: '创建团队',
                    title: '创建团队'
                }
            ]
        }
    ];
};

$store.$subscribe(async (mutation) => {
    if (mutation.events.key === 'teams') {
        teamsDataSource.value = await getTeamsDataSource();
    }
});

const asideClick = ({ item }) => {
    selectedKeys.value[0] = item.key;
    if (item.id === 'createTeam') {
        $router.push({
            name: 'team_create'
        });
    } else {
        $router.push({
            name: 'team_profile',
            params: { id: item.originItemValue.key }
        });
    }
};

async function changeSelectedKeys(route) {
    if (route.name === 'team_create') {
        selectedKeys.value[0] = 'createTeam';
    } else if (route.name === 'team_profile') {
        selectedKeys.value[0] = +route.params.id;
    }
    teamsDataSource.value = await getTeamsDataSource();
}
watch($route, async (newRoute) => {
    await changeSelectedKeys(newRoute);
});
onMounted(async () => {
    await changeSelectedKeys($route);
});
</script>

<style>
.menu {
    height: 100%;
    .ant-menu-item {
        height: 50px;
    }
}
</style>
