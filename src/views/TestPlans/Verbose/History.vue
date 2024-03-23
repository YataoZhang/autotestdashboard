<template>
    <a-table
        :columns="columns"
        :data-source="list"
        :loading="loading"
        :scroll="{ y: tableHeight, x: 'auto' }"
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
            <template v-if="column.key === 'startAt'">
                {{ formatDates(record.startAt) }}
            </template>
            <template v-if="column.key === 'endAt'">
                {{ formatDates(record.endAt) }}
            </template>
            <template v-if="column.key === 'status'">
                <a-tag
                    :color="['blue', 'orange', 'green', 'red'][record.status]"
                >
                    <template
                        #icon
                        v-if="record.status === 1"
                    >
                        <LoadingOutlined />
                    </template>
                    {{
                        ['未开始', '测试中', '成功', '失败'][record.status] ||
                        '未知状态'
                    }}
                </a-tag>
            </template>
            <template v-if="column.key === 'triggerUser'">
                {{ record.triggerUser || '-' }}
            </template>
            <template v-if="column.key === 'reporter'">
                <a-button
                    type="link"
                    target="_blank"
                    :disabled="record.status < 2 || !record.detailLink"
                    :href="record.detailLink"
                >
                    查看详情
                </a-button>
                <a-button
                    :disabled="record.status < 2 || !record.reporterLink"
                    type="link"
                    target="_blank"
                    :href="record.reporterLink"
                >
                    测试报告
                </a-button>

                <a-button
                    :disabled="record.status < 2 || !record.compareLink"
                    type="link"
                    target="_blank"
                    :href="record.compareLink"
                >
                    对比详情
                </a-button>
                <a-button
                    :disabled="record.status > 1"
                    type="primary"
                    @click="$methods.refreshRecord(record)"
                    ><template #icon>
                        <ReloadOutlined />
                    </template>
                    刷新
                </a-button>
            </template>
        </template>
    </a-table>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { useHistoryStore } from '@/stores/history';
import { storeToRefs } from 'pinia';

const formatDates = (timestamp) => {
    if (!timestamp) {
        return '-';
    }
    return new Date(timestamp).toLocaleString();
};
const tableHeight = window.document.documentElement.offsetHeight - 360;
const columns = [
    {
        title: '测试执行ID',
        dataIndex: 'id',
        width: '160px',
        key: 'id'
    },
    {
        title: '执行开始时间',
        dataIndex: 'startAt',
        width: '170px',
        key: 'startAt'
    },
    {
        title: '执行结束时间',
        dataIndex: 'endAt',
        width: '170px',
        key: 'endAt'
    },
    {
        title: '执行状态',
        key: 'status',
        width: '170px',
        dataIndex: 'status'
    },
    {
        title: '测试调用方',
        key: 'triggerUser',
        width: '200px',
        dataIndex: 'triggerUser'
    },
    {
        title: '测试报告',
        key: 'reporter'
    }
];

const $props = defineProps({
    planId: {
        type: [Number, String]
    }
});
const $store = useHistoryStore();
const { list, loading, totalCount } = storeToRefs($store);

const $methods = {
    async onPageChange(pageIndex) {
        await $actions.getAllHistoryList(pageIndex);
    },
    async refreshRecord(record) {
        await $store.refreshRecord($props.planId, record.id);
    }
};

const $actions = {
    async getAllHistoryList(pageIndex = 1) {
        await $store.getInvokeHistoryList($props.planId, pageIndex);
    }
};

onMounted(() => {
    $actions.getAllHistoryList();
});

defineExpose({
    async refreshHistoryList() {
        $actions.getAllHistoryList();
    }
});
</script>

<style lang="scss" scoped></style>
