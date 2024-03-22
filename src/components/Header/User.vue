<template>
    <a-avatar style="background-color: #87d068; margin-right: 10px">
        <template #icon>
            <UserOutlined />
        </template>
    </a-avatar>
    <a-dropdown>
        <a
            class="ant-dropdown-link"
            @click.prevent
        >
            {{ userData.username || '未知用户' }}
            <DownOutlined />
        </a>
        <template #overlay>
            <a-menu @click="logout">
                <a-menu-item>
                    <a href="javascript:;">退出登录</a>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>
<script setup>
import { getCurrentInstance } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { UserOutlined, DownOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/user';

const { proxy } = getCurrentInstance();
const $router = useRouter();
const $store = useUserStore();

const { userData } = storeToRefs($store);

const logout = async () => {
    try {
        await $store.logout();
    } catch (ex) {
        proxy.$message.error(ex.message);
        return;
    }

    $router.push({ name: 'login' });
};
</script>

<style lang="scss"></style>
