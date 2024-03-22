<template>
    <a-layout class="main-box">
        <a-layout-header class="header">
            <Header></Header>
        </a-layout-header>
        <a-layout>
            <a-layout-sider
                v-if="/team/.test(route.name)"
                width="270"
                class="sider"
            >
                <Sider></Sider>
            </a-layout-sider>
            <a-layout-content class="container">
                <RouterView />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup>
import { useRoute } from 'vue-router';
import Header from '../components/Header/index.vue';
import Sider from '../components/Siders/index.vue';
import { useTeamStore } from '@/stores/team.js';

const $teamStore = useTeamStore();
const route = useRoute();

$teamStore.getAllTeamsOfMine().catch((ex) => {
    console.log(ex);
});
</script>

<style scoped lang="scss">
.main-box {
    height: 100vh;
    .header {
        text-align: center;
        padding-inline: 50px;
        line-height: 64px;
        background-color: #fff;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03),
            0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
        z-index: 1;
    }
    .sider {
        // line-height: 120px;
        background-color: #fff;
    }
    .container {
        text-align: center;
        min-height: 120px;
        line-height: 120px;
        padding: 10px;
        background-color: rgb(248, 250, 252);
    }
}
</style>
