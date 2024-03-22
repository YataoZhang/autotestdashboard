<template>
    <a-flex
        class="creat-panel"
        gap="middle"
        align="center"
        vertical
    >
        <h3>创建团队</h3>
        <a-form
            :model="formState"
            autocomplete="off"
            :confirmLoading="formState.commiting"
            @finish="onFinish"
        >
            <a-form-item
                name="teamName"
                :rules="[
                    {
                        required: true,
                        message: '请输入团队名称',
                    },
                ]"
            >
                <a-input
                    size="large"
                    autofocus
                    :readonly="formState.commiting"
                    v-model:value="formState.teamName"
                    placeholder="团队名称"
                />
            </a-form-item>
            <a-form-item style="margin-top: 50px">
                <a-button
                    type="primary"
                    size="large"
                    :disabled="formState.commiting"
                    html-type="submit"
                >
                    <template
                        #icon
                        v-if="formState.commiting"
                    >
                        <LoadingOutlined />
                    </template>
                    {{ formState.commiting ? '创建中' : '新建' }}
                </a-button>
            </a-form-item>
        </a-form>
    </a-flex>
</template>

<script setup>
import { reactive, getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
import { LoadingOutlined } from '@ant-design/icons-vue';
import { useTeamStore } from '@/stores/team.js';
import { useUserStore } from '@/stores/user.js';

const { proxy } = getCurrentInstance();
const $router = useRouter();
const $teamStore = useTeamStore();
const $userStore = useUserStore();

const formState = reactive({
    teamName: '',
    commiting: false,
});

const onFinish = async (values) => {
    if (!values.teamName) {
        return;
    }
    formState.commiting = true;
    let id = '';
    try {
        id = await $teamStore.addTeam(values.teamName, $userStore.userData.id);
    } catch (ex) {
        proxy.$message.error(ex.message);
        return;
    } finally {
        formState.commiting = false;
    }
    $router.push({
        name: 'team_profile',
        params: {
            id,
        },
    });
};
</script>

<style lang="scss" scoped>
.creat-panel {
    background-color: #fff;
    height: 100%;
    h3 {
        font-size: 32px;
    }
    .ant-form {
        width: 500px;
    }
    .ant-btn {
        width: 100%;
    }
}
</style>
