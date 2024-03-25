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
            <template v-if="column.key === 'name'">
                <RouterLink
                    :to="{ name: 'plans_verbose', params: { id: record.id } }"
                >
                    {{ record.name }}</RouterLink
                >
            </template>
            <template v-if="column.key === 'type'">
                {{ record.type === 1 ? '录制型' : '生成型' }}
            </template>
            <template v-if="column.key === 'casesCount'">
                {{ record.casesCount || 0 }}
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
            <template v-else-if="column.key === 'action'">
                <a-space warp>
                    <a-button
                        type="primary"
                        @click="$methods.invokeTest(record)"
                    >
                        <template #icon>
                            <PlayCircleOutlined />
                        </template>
                        执行该计划
                    </a-button>
                    <a-button @click="$methods.rename.open(record)">
                        重命名
                    </a-button>
                    <a-popconfirm
                        title="确定删除吗？"
                        @confirm="$methods.remove(record)"
                    >
                        <a-button danger> 删除 </a-button>
                    </a-popconfirm>
                </a-space>
            </template>
        </template>
    </a-table>

    <a-modal
        v-model:open="openRenameModal.open"
        title="修改计划名称"
        okText="确定"
        cancelText="取消"
        :confirmLoading="openRenameModal.commiting"
        @cancel="$methods.rename.commit(false)"
        @ok="$methods.rename.commit(true)"
    >
        <a-space
            direction="vertical"
            style="width: 100%; margin-bottom: 20px"
        >
            <p>当前计划名称:&nbsp; {{ openRenameModal.oldName }}</p>
            <a-input
                :readonly="openRenameModal.commiting"
                v-model:value.lazy="openRenameModal.newName"
                autofocus
                placeholder="请输入计划名称"
            />
        </a-space>
    </a-modal>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import { PlayCircleOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { usePlansStore } from '@/stores/plans';
import { useTeamStore } from '@/stores/team.js';

const columns = [
    {
        title: '测试计划名称',
        dataIndex: 'name',
        width: '400px',
        key: 'name'
    },
    {
        title: '计划类型',
        dataIndex: 'type',
        width: '100px',
        key: 'type'
    },
    {
        title: '状态',
        key: 'status',
        width: '100px',
        dataIndex: 'status'
    },
    {
        title: '用例数量',
        dataIndex: 'casesCount',
        width: '100px',
        key: 'casesCount'
    },

    {
        title: '负责人',
        width: '120px',
        dataIndex: 'creator',
        key: 'creator'
    },
    {
        title: '更新时间',
        dataIndex: 'modifiedAt',
        key: 'modifiedAt'
    },
    {
        title: '操作',
        key: 'action'
    }
];
const tableHeight = window.document.documentElement.offsetHeight - 270;
const formatDate = (time) => {
    return time.toLocaleString();
};

const { proxy } = getCurrentInstance();

const $planStore = usePlansStore();
const $teamStore = useTeamStore();

const $router = useRouter();
const $props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    totalCount: Number,
    loading: Boolean
});

const $emits = defineEmits(['pageChange', 'remove', 'renameComplete']);

const openRenameModal = ref({
    open: false,
    data: {},
    oldName: '',
    newName: '',
    commiting: false
});

const $methods = {
    invokeTest(record) {
        $router.push({
            name: 'plans_verbose',
            params: { id: record.id },
            query: {
                invoke: 1
            }
        });
    },
    rename: {
        open(record) {
            Object.assign(openRenameModal.value, {
                open: true,
                data: record,
                oldName: record.name,
                newName: ''
            });
        },
        async commit(isOK) {
            if (isOK && openRenameModal.value.newName) {
                openRenameModal.commiting = true;
                try {
                    await $planStore.renamePlan(
                        $teamStore.currentTeam.id,
                        openRenameModal.value.data.id,
                        openRenameModal.value.newName
                    );
                } catch (ex) {
                    proxy.$message.error(ex.message);
                    return;
                } finally {
                    openRenameModal.commiting = false;
                }
            }
            Object.assign(openRenameModal.value, {
                open: false,
                data: {},
                oldName: '',
                newName: ''
            });
            $emits('renameComplete');
        }
    },
    remove(record) {
        $emits('remove', record);
    },
    onPageChange(page) {
        $emits('pageChange', page);
    }
};
</script>

<style lang="scss" scoped></style>
