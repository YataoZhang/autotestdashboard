<template>
    <a-flex
        class="verbose-box"
        vertical
        justify="center"
    >
        <a-flex justify="space-between">
            <a-flex
                justify="space-between"
                class="toolbar-left"
            >
                <a-space class="verbose-breadcrumb">
                    <span>当前路径：</span>
                    <a-breadcrumb>
                        <a-breadcrumb-item>
                            <RouterLink
                                :to="{
                                    name: 'plans_home'
                                }"
                            >
                                测试计划
                            </RouterLink>
                        </a-breadcrumb-item>
                        <a-breadcrumb-item>
                            {{ currentPlanName }}
                        </a-breadcrumb-item>
                    </a-breadcrumb>
                </a-space>
                <a-space>
                    <span> 测试计划 ID: {{ $route.params.id }} </span>
                    <a-button
                        type="link"
                        @click="$methods.copyPlanId"
                    >
                        <template #icon>
                            <CopyOutlined />
                        </template>
                        复制
                    </a-button>
                </a-space>
            </a-flex>

            <AddAndExecute
                :planId="$route.params.id"
                ref="execute"
                @onInvokeComplete="$methods.onInvokeComplete"
                @onAddComplete="$methods.onAddComplete"
            />
        </a-flex>

        <a-tabs
            v-model:activeKey="activeKey"
            class="verbose-tabs"
        >
            <a-tab-pane key="1">
                <template #tab>
                    <span>
                        <UnorderedListOutlined />
                        测试用例列表
                    </span>
                </template>
                <CasesList
                    ref="caseListRef"
                    :planId="$route.params.id"
                ></CasesList>
            </a-tab-pane>
            <a-tab-pane key="2">
                <template #tab>
                    <span>
                        <ScheduleOutlined />
                        历史执行记录
                    </span>
                </template>
                <History
                    ref="historyListRef"
                    :planId="$route.params.id"
                ></History>
            </a-tab-pane>
        </a-tabs>
    </a-flex>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
    CopyOutlined,
    UnorderedListOutlined,
    ScheduleOutlined
} from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';

import AddAndExecute from './AddAndExecute.vue';
import History from './History.vue';
import CasesList from './CasesList/Index.vue';
import { useTeamStore } from '@/stores/team.js';
import { usePlansStore } from '@/stores/plans';

const $route = useRoute();
const $router = useRouter();
const $planStore = usePlansStore();
const $teamStore = useTeamStore();

const activeKey = ref('1');
const execute = ref(null);
const currentPlanName = ref('');
const caseListRef = ref(null);
const historyListRef = ref(null);

const $methods = {
    copyPlanId() {},
    onInvokeComplete() {
        activeKey.value = '2';
        historyListRef.value && historyListRef.value.refreshHistoryList();
    },
    async onAddComplete() {
        await caseListRef.value.refreshList();
    }
};

$teamStore.$subscribe(async (mutation) => {
    if (mutation.events.key === 'currentTeam') {
        $router.push({ name: 'plans_home' });
    }
});

onMounted(async () => {
    if (+$route.query.invoke === 1 && !$route.query.hasInvoked) {
        execute.value.openInvokeModel();
        $router.push({ query: { ...$route.query, hasInvoked: 1 } });
    }
    const data = await $planStore.getPlanInfo(
        $teamStore.currentTeam.id,
        $route.params.id
    );
    currentPlanName.value = data.name;
});
</script>

<style lang="scss" scoped>
.verbose-box {
    line-height: normal;
    background-color: #fff;
    padding: 20px;
}
.toolbar-left {
    min-width: 600px;
    .verbose-breadcrumb {
        margin-right: 65px;
    }
}
.verbose-tabs {
    margin-top: 20px;
}
</style>
