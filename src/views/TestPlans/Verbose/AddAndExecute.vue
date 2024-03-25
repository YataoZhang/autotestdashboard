<template>
    <a-space>
        <a-upload
            v-model:file-list="fileList"
            name="file"
            :showUploadList="false"
            accept=".json"
            :multiple="true"
            :action="`/api/v1/${planId}/cases?teamId=${$teamStore.currentTeam.id}`"
            :headers="{}"
            @change="handleChange"
        >
            <a-dropdown-button
                type="primary"
                :loading="false"
                size="large"
                @click="enterLoading"
            >
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="1">
                            <template #icon>
                                <PlusCircleOutlined />
                            </template>
                            根据需求内容新建测试用例
                        </a-menu-item>
                    </a-menu>
                </template>
                新建测试用例
            </a-dropdown-button>
        </a-upload>
        <a-button
            size="large"
            @click="openInvokeModel"
        >
            <template #icon>
                <PlayCircleOutlined />
            </template>
            执行测试
        </a-button>
    </a-space>
    <Invoke
        :planId
        ref="invokeModel"
        @onInvokeComplete="$emits('onInvokeComplete')"
    ></Invoke>
</template>
<script setup>
import { ref, getCurrentInstance } from 'vue';
import { PlayCircleOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import Invoke from './Invoke/Index.vue';
import { useTeamStore } from '@/stores/team.js';

const { proxy } = getCurrentInstance();
const $props = defineProps({
    planId: {
        type: [Number, String]
    }
});
const $emits = defineEmits(['onInvokeComplete', 'onAddComplete']);

const $teamStore = useTeamStore();
const fileList = ref([]);
const invokeModel = ref(null);

const openInvokeModel = () => {
    invokeModel.value.open();
};
const handleChange = (info) => {
    proxy.$message.destroy();
    if (info.file.status === 'uploading') {
        proxy.$message.loading(`${info.file.name} 上传中`);
    } else {
        console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
        proxy.$message.success(`${info.file.name} 上传成功`);
        $emits('onAddComplete');
    } else if (info.file.status === 'error') {
        proxy.$message.error(`${info.file.name} 上传失败.`);
    }
};
const enterLoading = () => {};

defineExpose({
    openInvokeModel
});
</script>

<style lang="scss"></style>
