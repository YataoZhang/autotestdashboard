<template>
    <div
        ref="editor"
        :style="{ height: height || 'auto' }"
    >
        <code-editor
            ref="editorInstance"
            :code="content"
            class="edit-area"
        >
        </code-editor>
    </div>
</template>

<script>
import { ref, onMounted, defineExpose } from 'vue';
import CodeEditor from '@/components/CodeEditor.vue';

export default {
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    components: {
        CodeEditor
    },
    setup(props) {
        // let code = ref(props.content);
        const editor = ref(null);
        const editorInstance = ref(null);
        const height = ref('');
        const getContent = () => editorInstance.value.getContent();

        onMounted(() => {
            const h = editor.value.parentNode.parentNode.offsetHeight - 120;
            height.value = h + 'px';
        });

        // defineExpose({
        //     getContent,
        // });
        return { editor, height, getContent, editorInstance };
    }
};
</script>
<style scoped>
.edit-area {
    height: 100%;
}
</style>
