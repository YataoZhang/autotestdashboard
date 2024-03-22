<template>
    <div class="content">
        <div class="login-left">
            <Profile category="login"></Profile>
        </div>
        <div class="login-right">
            <div class="login-wrapper">
                <div class="first-band">
                    <img src="../assets/axe_tool_icon_231411.png" />
                    <div>
                        <p>Web端自动化回归测试系统</p>
                        <p>The web has evolved. Finally, testing has too.</p>
                    </div>
                </div>
                <a-card style="width: 100%; max-width: 610px">
                    <code>$ npm install -D @baidu/uitestgaent</code>
                    <code>$ npx @baidu/uitestgaent --init</code>
                    <code>$ npx uitestgaent</code>
                </a-card>
            </div>
        </div>
    </div>
</template>
<script setup>
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import Profile from '@/components/Identity/index.vue';
import { useUserStore } from '@/stores/user';
const $router = useRouter();
const $userStore = useUserStore();

watch(
    () => {
        return $userStore.isLogin;
    },
    (newValue) => {
        if (!newValue) {
            return;
        }
        $router.push({ name: 'plans_home' });
    }
);
</script>

<style lang="scss" scoped>
.content {
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    align-items: stretch;
}
.login-left {
    display: flex;
    overflow-y: auto;
    position: relative;
    flex: 1 1 0%;
    background: #fff;
}
.login-right {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex: 1 1 0%;
    background-color: #2e3247;
    color: #e1e3ed;
    font-size: 18px;
    .login-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 50px;
        p {
            text-align: left;
        }

        code {
            display: block;
            line-height: 32px;
        }

        .first-band {
            display: flex;
            font-size: 42px;
            margin: 0 0 40px 0;
            justify-content: center;
            align-items: center;

            img {
                margin-right: 10px;
            }

            div {
                display: flex;
                flex-direction: column;
                p:first-child {
                    margin-bottom: 10px;
                }
                p:last-child {
                    font-size: 24px;
                }
            }
        }
    }
}
</style>
