<template>
    <a-flex justify="space-between">
        <a-space>
            <div class="title">Web端自动化回归测试系统</div>
            <TeamSelector></TeamSelector>
            <a-menu
                :selectedKeys="selectedKeys"
                theme="light"
                mode="horizontal"
                class="header-menu"
                @click="changeMenu"
            >
                <a-menu-item key="plans">
                    <template #icon>
                        <FolderOpenOutlined />
                    </template>
                    测试计划
                </a-menu-item>
                <a-menu-item key="team">
                    <template #icon>
                        <TeamOutlined />
                    </template>
                    团队管理
                </a-menu-item>
            </a-menu>
        </a-space>
        <a-space>
            <User></User>
        </a-space>
    </a-flex>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
    UserOutlined,
    FolderOpenOutlined,
    TeamOutlined,
    SettingOutlined,
    ApiOutlined
} from '@ant-design/icons-vue';

import User from './User.vue';
import TeamSelector from './TeamSelector.vue';

const $router = useRouter();
const $route = useRoute();

const selectedKeys = ref(['']);

const changeMenu = (event) => {
    $router.push({ name: event.key });
};

function setSelectedKeys(routeName) {
    if (/plans/.test(routeName)) {
        selectedKeys.value[0] = 'plans';
    } else {
        selectedKeys.value[0] = 'team';
    }
}

watch($route, (newRoute) => {
    setSelectedKeys(newRoute.name);
});
onMounted(() => {
    setSelectedKeys($route.name);
});
</script>

<style lang="scss">
.title {
    color: rgba(0, 0, 0, 0.88);
    font-size: 18px;
    font-weight: bolder;
}

.header-menu {
    margin: 0 10px;
    width: 500px;
    .ant-menu-item {
        margin: 0 15px;
    }
}
</style>
