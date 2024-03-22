<template>
    <a-flex
        vertical
        class="plans-box"
    >
        <a-flex
            justify="space-between"
            class="tools-bar"
        >
            <a-input-search
                class="inputSearch"
                v-model:value="search.searchValue"
                placeholder="请输入测试计划名称"
                enter-button="搜索测试计划"
                size="large"
                :loading="search.loading"
                @search="$methods.onSearch"
            />
            <CreatePlan @createComplete="$methods.onCreateComplete" />
        </a-flex>
        <PlanList
            :list
            :totalCount
            :loading
            @pageChange="$methods.onPageChange"
            @remove="$methods.onRemove"
            @renameComplete="$methods.renameComplete"
        ></PlanList>
    </a-flex>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { storeToRefs } from 'pinia';
import PlanList from './PlanList.vue';
import CreatePlan from './CreatePlan.vue';

import { useTeamStore } from '@/stores/team.js';
import { usePlansStore } from '@/stores/plans';

const { proxy } = getCurrentInstance();
const $planStore = usePlansStore();
const $teamStore = useTeamStore();

const search = reactive({
    loading: false,
    searchValue: ''
});
const { list, totalCount, loading } = storeToRefs($planStore);

const $methods = {
    async onSearch() {
        search.loading = true;
        try {
            await $planStore.searchPlans(
                $teamStore.currentTeam.id,
                search.searchValue
            );
        } catch (ex) {
            proxy.$message.error(ex.message);
            return;
        } finally {
            search.loading = false;
        }
    },
    async onCreateComplete() {
        await $planStore.getAllPlans($teamStore.currentTeam.id, 1, true);
    },
    async onPageChange(pageIndex) {
        await $planStore.getAllPlans($teamStore.currentTeam.id, pageIndex);
    },
    async onRemove(item) {
        try {
            await $planStore.removePlan($teamStore.currentTeam.id, item.id);
        } catch (ex) {
            proxy.$message.error(ex.message);
        }
    },
    async onRenameComplete() {
        await $planStore.getAllPlans($teamStore.currentTeam.id);
    }
};

$teamStore.$subscribe(async (mutation) => {
    if (mutation.events.key === 'currentTeam') {
        await $methods.onCreateComplete();
    }
});
onMounted(async () => {
    await $methods.onCreateComplete();
    console.log(list.value, totalCount.value, loading.value);
});
</script>

<style lang="scss" scoped>
.plans-box {
    background-color: #fff;
    height: 100%;
    padding: 15px;
}
.tools-bar {
    margin-bottom: 20px;
    .inputSearch {
        width: 500px;
    }
}
</style>
