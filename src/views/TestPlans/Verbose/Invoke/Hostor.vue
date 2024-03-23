<template>
    <a-input
        v-model:value="hostValue"
        style="width: 400px"
    >
        <template #addonBefore>
            <a-select
                v-model:value="protocol"
                style="width: 90px"
            >
                <a-select-option value="http://">http://</a-select-option>
                <a-select-option value="https://">https://</a-select-option>
            </a-select>
        </template>
        <template #addonAfter>
            <a-select
                v-model:value="suffix"
                style="width: 80px"
            >
                <a-select-option value=".com">.com</a-select-option>
                <a-select-option value=".cn">.cn</a-select-option>
                <a-select-option value=".org">.org</a-select-option>
            </a-select>
        </template>
    </a-input>
</template>
<script setup>
import { ref } from 'vue';
const protocol = ref('http://');
const suffix = ref('.com');
const hostValue = ref('');

defineExpose({
    getValue() {
        if (!hostValue.value) {
            return '';
        }
        return protocol.value + hostValue.value + suffix.value;
    },
    reset() {
        protocol.value = 'http://';
        suffix.value = '.com';
        hostValue.value = '';
    }
});
</script>
<style lang="scss"></style>
