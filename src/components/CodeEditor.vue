<template>
    <div ref="editor"></div>
</template>

<script>
import { onMounted, ref, defineExpose, watch } from 'vue';

import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { linter, lintGutter } from '@codemirror/lint';
import { json, jsonParseLinter } from '@codemirror/lang-json';

export default {
    name: 'code-editor',
    props: {
        code: {
            type: String,
            default: () => ''
        }
    },
    setup(props, { emit }) {
        const editor = ref(null);
        let cm = null;
        watch(
            () => props.code,
            (newValue) => {
                cm.dispatch({
                    changes: {
                        from: 0,
                        to: cm.state.doc.length,
                        insert: newValue
                    }
                });
            }
        );
        onMounted(() => {
            if (cm) {
                cm.destroy();
            }
            const state = EditorState.create({
                extensions: [
                    basicSetup,
                    lintGutter(),
                    linter(jsonParseLinter()),
                    json()
                ],
                doc: props.code
            });
            cm = new EditorView({
                state,
                styleActiveLine: true,
                lineWrapping: true,
                parent: editor.value
            });
        });
        const getContent = () => {
            if (!cm) {
                return '';
            }
            return { state: cm.state, content: cm.state.doc.toString() };
        };
        // defineExpose({
        //     getContent,
        // });
        return { editor, getContent };
    }
};
</script>
<style>
.cm-editor {
    height: 100%;
    border: solid 1px #ddd;
    border-radius: 4px;
}
</style>
