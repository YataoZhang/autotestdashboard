<template>
    <a-tabs
        v-model:activeKey="activeKey"
        class="tabs"
    >
        <!-- <a-tab-pane
            key="1"
            tab="测试计划"
        >
            <PlanGroup></PlanGroup>
        </a-tab-pane> -->
        <a-tab-pane
            key="1"
            tab="成员/权限"
        >
            <Members></Members>
        </a-tab-pane>
        <a-tab-pane
            key="2"
            tab="团队设置"
        >
            <Settings></Settings>
        </a-tab-pane>
    </a-tabs>
</template>

<script setup>
import { ref } from 'vue';
import Members from './Members.vue';
import Settings from './Settings.vue';

const activeKey = ref('1');
</script>

<style lang="scss" scoped>
.tabs {
    background-color: #fff;
    padding: 10px;
    height: 100%;
    text-align: left;
}
</style>
