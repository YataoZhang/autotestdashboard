<template>
    <a-modal
        v-model:open="show_"
        title="测试用例详情"
        width="80%"
        wrap-class-name="full-modal"
    >
        <MRD
            v-if="isMRDType"
            :dataSource="source.content"
        ></MRD>
        <CasesContent
            v-else
            ref="caseContentRef"
            :content="source.content"
        ></CasesContent>
        <template #footer>
            <a-space>
                <a-button
                    v-if="!isMRDType"
                    @click="$methods.formater"
                    >格式化</a-button
                >
                <a-button
                    :loading="saveLoading"
                    type="primary"
                    @click="$methods.saveData"
                    >确定</a-button
                >
            </a-space>
        </template>
    </a-modal>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import CasesContent from './CasesContent.vue';
import MRD from './MRD.vue';

const { proxy } = getCurrentInstance();
const $props = defineProps({
    source: {
        type: Object,
        default: () => ({
            record: null,
            type: 0,
            content: ''
        })
    }
});
const $emits = defineEmits(['save']);

const isMRDType = computed(() => {
    return !!($props.source && $props.source.type === 1);
});
const caseContentRef = ref(null);
const show_ = ref(false);
const saveLoading = ref(false);

const $methods = {
    formater() {
        try {
            const { content } = caseContentRef.value.getContent();
            const json = JSON.parse(content);
            const string = JSON.stringify(json, 0, 4);
            $props.source.content = string;
        } catch (ex) {
            console.log(ex);
            proxy.$message.error('格式化失败');
        }
    },
    saveData() {
        const { content } = caseContentRef.value.getContent();
        try {
            JSON.parse(content);
        } catch (ex) {
            proxy.$message.error('格式不正确，请检查内容');
            return;
        }
        saveLoading.value = true;
        $emits('save', {
            record: $props.source.record,
            content,
            callback: () => {
                saveLoading.value = false;
            }
        });
    }
};

onMounted(() => {});

defineExpose({
    open() {
        show_.value = true;
    },
    close() {
        saveLoading.value = false;
        show_.value = false;
    }
});
</script>

<style lang="scss">
.full-modal {
    .ant-modal {
        max-width: 90%;
        top: 5%;
        padding-bottom: 0;
    }
    .ant-modal-content {
        display: flex;
        flex-direction: column;
        height: calc(90vh);
    }
    .ant-modal-body {
        flex: 1;
    }
}
</style>
