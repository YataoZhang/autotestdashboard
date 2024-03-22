<template>
    <a-modal
        v-model:open="modalState.show"
        title="选择要执行的测试用例"
        width="90%"
        wrap-class-name="full-modal"
        cancelText="取消"
        :okText="hasSelected ? '执行选中用例' : '执行全部用例'"
        :confirm-loading="selectState.loading"
        @ok="$methods.closeModel(true)"
        @cancel="$methods.closeModel(false)"
    >
        <TopInputBar ref="topInputBarRef"></TopInputBar>
        <a-table
            rowKey="id"
            :columns="columns"
            :data-source="list"
            :scroll="{ y: tableHeight, x: 'auto' }"
            :row-selection="{
                hideSelectAll: true,
                selectedRowKeys: selectState.selectedRowKeys,
                onChange: $methods.onSelectChange
            }"
            :loading="loading"
            :pagination="{
                defaultPageSize: 10,
                total: totalCount,
                onChange: $methods.onPageChange
            }"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'id'">
                    {{ record.id || '-' }}
                </template>
                <template v-if="column.key === 'name'">
                    <a> {{ record.name }}</a>
                </template>
                <template v-if="column.key === 'status'">
                    <a-tag :color="record.status === 1 ? 'green' : 'red'">
                        {{ record.status === 1 ? '正常' : '失效' }}
                    </a-tag>
                </template>
                <template v-if="column.key === 'creator'">
                    {{ record.creator || '-' }}
                </template>
                <template v-if="column.key === 'modifiedAt'">
                    {{ formatDate(record.modifiedAt) }}
                </template>
            </template>
        </a-table>
    </a-modal>
</template>
<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue';
import TopInputBar from './TopInputBar.vue';
import { useCasesStore } from '@/stores/cases';
import { storeToRefs } from 'pinia';
const { proxy } = getCurrentInstance();

const columns = [
    {
        title: '测试用例ID',
        dataIndex: 'id',
        width: '140px',
        key: 'id'
    },
    {
        title: '测试用例名称',
        dataIndex: 'name',
        width: '400px',
        key: 'name'
    },
    {
        title: '状态',
        dataIndex: 'name',
        key: 'status',
        width: '150px',
        dataIndex: 'status'
    },
    {
        title: '负责人',
        width: '150px',
        dataIndex: 'creator',
        key: 'creator'
    },
    {
        title: '更新时间',
        dataIndex: 'modifiedAt',
        key: 'modifiedAt'
    }
];
const formatDate = (time) => {
    return time.toLocaleString();
};
const tableHeight = window.document.documentElement.offsetHeight - 410;

const $props = defineProps({
    planId: {
        type: [Number, String]
    }
});

const $emits = defineEmits(['onInvokeComplete']);
const $store = useCasesStore();
const topInputBarRef = ref(null);
const modalState = ref({
    show: false
});
const selectState = reactive({
    selectedRowKeys: [],
    loading: false
});
const { list, totalCount, loading } = storeToRefs($store);
const hasSelected = computed(() => selectState.selectedRowKeys.length > 0);

const $methods = {
    async closeModel(isOK) {
        if (isOK) {
            await $actions.invokeCases();
        }
        modalState.value.show = false;
    },
    onSelectChange(selectedRowKeys) {
        selectState.selectedRowKeys = selectedRowKeys;
    },
    async onPageChange(pageIndex) {
        await $actions.getAllCases(pageIndex);
    }
};

const $actions = {
    async invokeCases() {
        const input = topInputBarRef.value.getInputData();
        selectState.loading = true;
        try {
            await $store.invokeCases(
                $props.planId,
                selectState.selectedRowKeys,
                input
            );
        } catch (ex) {
            proxy.$message.error(ex.message);
            return;
        } finally {
            selectState.loading = false;
        }
        topInputBarRef.value.reset();
        $emits('onInvokeComplete');
    },
    async getAllCases(pageIndex = 1) {
        await $store.getCasesByPlanId($props.planId, pageIndex);
    }
};

onMounted(async () => {
    await $actions.getAllCases();
});

defineExpose({
    open() {
        modalState.value.show = true;
        selectState.selectedRowKeys = [];
        selectState.loading = false;
    }
});
</script>
<style lang="scss"></style>
