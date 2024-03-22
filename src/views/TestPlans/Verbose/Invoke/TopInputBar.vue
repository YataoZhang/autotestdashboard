<template>
    <div class="invoke-toolbar">
        <div class="invoke-toolbar-item">
            <a-space>
                测试域名：
                <Hostor ref="hostRef"></Hostor>
            </a-space>
            <a-space>
                开启对照组：
                <a-switch v-model:checked="inputState.enableCompare" />
            </a-space>
            <a-space>
                对照组域名：
                <Hostor ref="compareHostRef"></Hostor>
            </a-space>
        </div>
        <div class="invoke-toolbar-item">
            Cookie:
            <a-input
                style="margin-left: 15px"
                v-model:value="inputState.cookies"
                placeholder="请输入 Cookie 内容"
            />
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import Hostor from './Hostor.vue';

const hostRef = ref(null);
const compareHostRef = ref(null);

const inputState = ref({
    enableCompare: false,
    cookies: '',
});

defineExpose({
    getInputData() {
        return {
            host: hostRef.value.getValue(),
            cookies: inputState.value.cookies,
            enableCompare: inputState.value.enableCompare,
            compareHost: compareHostRef.value.getValue(),
        };
    },
    reset() {
        inputState.value = {
            enableCompare: false,
            cookies: '',
        };
        hostRef.value.reset();
        compareHostRef.value.reset();
    },
});
</script>
<style lang="scss">
.invoke-toolbar {
    padding: 10px 0;
    .invoke-toolbar-item {
        padding: 5px 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .ant-space {
            margin-right: 40px;
        }
    }
}
</style>
