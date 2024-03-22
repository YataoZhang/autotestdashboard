<template>
    <a-table
        :columns="columns"
        :data-source="list"
        :loading="loading"
        :scroll="{ y: tableHeight, x: 'auto' }"
        :pagination="{
            defaultPageSize: 10,
            total: totalCount,
            onChange: methods.onPageChange
        }"
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'id'">
                {{ record.id || '-' }}
            </template>
            <template v-if="column.key === 'name'">
                <div>
                    <template v-if="editableData[record.id]">
                        <a-input
                            v-model:value="
                                editableData[record.id][column.dataIndex]
                            "
                            style="margin: -5px 0"
                        />
                        <a-space style="margin-top: 20px">
                            <a-typography-link
                                @click="methods.rename.save(record.id)"
                            >
                                保存
                            </a-typography-link>
                            <a-popconfirm
                                title="确定取消吗？"
                                @confirm="methods.rename.cancel(record.id)"
                            >
                                <a-button type="link">取消</a-button>
                            </a-popconfirm>
                        </a-space>
                    </template>
                    <template v-else>
                        <a> {{ record.name }}</a>
                    </template>
                </div>
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
                        @click="methods.openPopUpModel(record)"
                    >
                        <template #icon>
                            <EyeOutlined />
                        </template>
                        查看/编辑
                    </a-button>
                    <a-button @click="methods.rename.invoke(record)">
                        重命名
                    </a-button>
                    <a-popconfirm
                        title="确定该用例删除吗？"
                        @confirm="methods.remove(record)"
                    >
                        <a-button danger> 删除 </a-button>
                    </a-popconfirm>
                </a-space>
            </template>
        </template>
    </a-table>
    <PopUp
        ref="popupRef"
        :source="popupData"
        @save="methods.saveCaseContent"
    ></PopUp>
</template>

<script setup>
import { cloneDeep } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { EyeOutlined } from '@ant-design/icons-vue';
import PopUp from './PopUp/index.vue';
import { useCasesStore } from '@/stores/cases';

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
        key: 'status',
        width: '100px',
        dataIndex: 'status'
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
const tableHeight = window.document.documentElement.offsetHeight - 360;
const formatDate = (time) => {
    return time.toLocaleString();
};
const { proxy } = getCurrentInstance();
const $props = defineProps({
    planId: {
        type: [Number, String]
    }
});

const $store = useCasesStore();
const popupRef = ref(null);
const popupData = ref(null);
const editableData = reactive({});

const { list, totalCount, loading } = storeToRefs($store);

const methods = {
    async openPopUpModel(record) {
        const p = cloneDeep(record);
        popupData.value = {
            record: p,
            type: p.type,
            content: p.content
        };
        popupRef.value.open();
    },
    async onPageChange(pageIndex) {
        await $actions.getAllCases(pageIndex);
    },
    rename: {
        invoke(record) {
            const id = record.id;
            editableData[record.id] = cloneDeep(
                list.value.filter((item) => id === item.id)[0]
            );
            console.log(editableData);
        },
        async save(id) {
            const data = editableData[id];
            if (!data) {
                proxy.$message.error('找不到该数据');
                return;
            }
            if (!data.name) {
                proxy.$message.error('请设置用例名称');
                return;
            }
            const original = list.value.filter((item) => id === item.id)[0];
            if (original.name === data.name) {
                proxy.$message.warn('用例名称未变动，无法修改');
                return;
            }
            await $store.renameCase($props.planId, id, data.name);
            this.cancel(id);
        },
        cancel(id) {
            delete editableData[id];
        }
    },
    async remove(record) {
        await $store.removeCase($props.planId, record.id);
    },
    async saveCaseContent(data) {
        await $store.modifiyCaseContent(
            $props.planId,
            data.record.id,
            data.content
        );
        await data.callback();
        popupRef.value.close();
    }
};

const $actions = {
    async getAllCases(pageIndex = 1) {
        await $store.getCasesByPlanId($props.planId, pageIndex);
    }
};

onMounted(async () => {
    await $actions.getAllCases();
});

defineExpose({
    async refreshList() {
        await $actions.getAllCases();
    }
});
</script>

<style lang="scss" scoped></style>
