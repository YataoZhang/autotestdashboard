<template>
    <div class="main">
        <p class="lenged">
            {{ category === 'login' ? '用户登录' : '注册用户' }}
        </p>
        <a-form
            :model="formState"
            name="basic"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 20 }"
            autocomplete="off"
            @finish="$methods.request"
            :disabled="formState.commiting"
        >
            <a-form-item
                label="用户名"
                name="username"
                :rules="[{ required: true, message: '请输入您的帐户名称' }]"
            >
                <a-input
                    v-model:value="formState.username"
                    size="large"
                >
                    <template #prefix>
                        <UserOutlined class="site-form-item-icon" /> </template
                ></a-input>
            </a-form-item>

            <a-form-item
                label="密码"
                name="password"
                :rules="[{ required: true, message: '请输入您的密码' }]"
            >
                <a-input-password
                    v-model:value="formState.password"
                    size="large"
                >
                    <template #prefix>
                        <LockOutlined class="site-form-item-icon" />
                    </template>
                </a-input-password>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 5, span: 16 }">
                <a-button
                    type="primary"
                    html-type="submit"
                    :disabled="formState.commiting"
                    size="large"
                >
                    <template
                        #icon
                        v-if="formState.commiting"
                    >
                        <LoadingOutlined />
                    </template>
                    {{ category === 'login' ? '立即登录' : '立即注册' }}
                </a-button>
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 5, span: 16 }">
                <template v-if="category === 'login'">
                    <a-space size="large">
                        <router-link to="/signup?forget=1">
                            忘记密码
                        </router-link>
                        <router-link to="/signup">立即注册</router-link>
                    </a-space>
                </template>
                <template v-else>
                    <span>已有账号？</span>
                    <router-link to="/login">登录</router-link>
                </template>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import {
    UserOutlined,
    LockOutlined,
    LoadingOutlined,
} from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/user';

const { proxy } = getCurrentInstance();
const $router = useRouter();
const $store = useUserStore();
const $props = defineProps({
    category: String,
});

const formState = reactive({
    username: '',
    password: '',
    commiting: false,
});

const $methods = {
    async request(values) {
        const isLoginType = $props.category === 'login';
        formState.commiting = true;
        try {
            let p = null;
            if (isLoginType) {
                p = $store.login;
            } else {
                p = $store.register;
            }
            await p(values.username, values.password);
        } catch (ex) {
            proxy.$message.error('服务异常，请稍后再试~');
            return;
        } finally {
            formState.commiting = false;
        }
        if (isLoginType) {
            $router.push({ name: 'root' });
        } else {
            proxy.$message.success('注册成功', 3, () => {
                $router.push({ name: 'login' });
            });
        }
    },
};

onMounted(() => {
    Object.assign(formState, {
        username: '',
        password: '',
        commiting: false,
    });
});
</script>

<style lang="scss" scoped>
.main {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    .lenged {
        font-size: 32px;
        margin: 30px auto;
    }

    form {
        width: 400px;
    }
}
</style>
