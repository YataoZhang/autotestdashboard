<template>
    <a-button
        type="primary"
        size="large"
        @click="showModal"
    >
        <template #icon>
            <PlusOutlined />
        </template>
        新建测试计划
    </a-button>
    <a-modal
        v-model:open="formState.openModal"
        title="创建测试计划"
        cancelText="取消"
        okText="创建计划"
        :confirmLoading="formState.commiting"
        @ok="handleOk"
    >
        <a-input
            autofocus
            placeholder="请输入将要创建的测试计划名称"
            v-model:value="formState.planName"
        />
    </a-modal>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { usePlansStore } from '@/stores/plans';
import { useTeamStore } from '@/stores/team.js';

const { proxy } = getCurrentInstance();
const $store = usePlansStore();
const $teamStore = useTeamStore();

const $emits = defineEmits(['createComplete']);

const formState = reactive({
    openModal: false,
    planName: '',
    commiting: false
});

const showModal = () => {
    formState.openModal = true;
    formState.planName = '';
};
const handleOk = async (e) => {
    if (!formState.planName) {
        proxy.$message.warn('请输入测试计划名称');
        return;
    }
    formState.commiting = true;
    try {
        await $store.createPlan($teamStore.currentTeam.id, formState.planName);
    } catch (ex) {
        proxy.$message.error(ex.message);
        return;
    } finally {
        formState.commiting = false;
    }
    Object.assign(formState, {
        openModal: false,
        planName: ''
    });
    $emits('createComplete');
};
</script>
