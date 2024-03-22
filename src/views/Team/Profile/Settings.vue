<template>
    <div class="settings-item">
        <a-typography-paragraph>基础信息</a-typography-paragraph>
        <a-list
            size="large"
            bordered
            :data-source="settingsDataSource"
        >
            <template #renderItem="{ item }">
                <a-list-item>
                    <template #actions>
                        <span v-if="editableData[item.type]">
                            <a-button
                                :disabled="editableData[item.type].commiting"
                                type="link"
                                @click="$methods.save(item.type)"
                            >
                                <template
                                    #icon
                                    v-if="editableData[item.type].commiting"
                                >
                                    <LoadingOutlined />
                                </template>
                                {{
                                    editableData[item.type].commiting
                                        ? '提交中'
                                        : '保存'
                                }}
                            </a-button>
                            <a-button
                                :disabled="editableData[item.type].commiting"
                                type="link"
                                @click="$methods.cancel(item.type)"
                                >取消</a-button
                            >
                        </span>
                        <span v-else>
                            <a-button
                                type="primary"
                                ghost
                                @click="$methods.edit(item.type)"
                                :disabled="item.type === 'name' && !isMyTeam()"
                            >
                                编辑
                            </a-button>
                        </span>
                    </template>
                    <div>{{ item.title }}</div>
                    <a-space>
                        <a-input
                            v-if="editableData[item.type]"
                            :readonly="editableData[item.type].commiting"
                            v-model:value="editableData[item.type].content"
                            style="margin: -5px 0; width: 300px"
                        />
                        <template v-else>
                            <div>
                                {{
                                    item.type === 'name'
                                        ? getSelectedTeam().name
                                        : memberInfo.nickname
                                }}
                            </div>
                        </template>
                    </a-space>
                </a-list-item>
            </template>
        </a-list>
    </div>
    <div class="settings-item">
        <a-alert
            message="危险区域"
            banner
        />
        <a-list
            class="danger"
            size="large"
            bordered
            :data-source="settingsDangerData"
        >
            <template #renderItem="{ item }">
                <a-list-item>
                    <template #actions>
                        <a-popconfirm
                            title="确定执行此操作吗？"
                            @confirm="$methods.dangerAction(item.type)"
                        >
                            <a-button
                                :disabled="!isMyTeam()"
                                danger
                            >
                                {{ item.title === '移交' ? '移交' : '解散' }}
                            </a-button>
                        </a-popconfirm>
                    </template>
                    <div>{{ item.title }}</div>
                    <div>{{ item.value }}</div>
                </a-list-item>
            </template>
        </a-list>
    </div>
    <a-modal
        v-model:open="transferToOtherUser.openModal"
        title="移交团队"
        okText="移交给该用户"
        cancelText="取消"
        @ok="$methods.transferToOtherUser(true)"
        @cancel="$methods.transferToOtherUser(false)"
        :confirmLoading="transferToOtherUser.commiting"
    >
        <a-input
            :readonly="transferToOtherUser.commiting"
            v-model:value="transferToOtherUser.userName"
            placeholder="请输入移交用户的帐户名称"
        >
            <template #prefix>
                <user-outlined />
            </template>
        </a-input>
    </a-modal>
</template>

<script setup>
import { ref, reactive, watch, onMounted, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons-vue';
import { useTeamStore } from '@/stores/team.js';
import { useUserStore } from '@/stores/user.js';

const settingsDangerData = [
    {
        type: 'transfer',
        title: '移交',
        value: '将团队的所有者权限移交给其他成员'
    },
    {
        type: 'disslove',
        title: '解散团队',
        value: '务必谨慎，解散后无法找回'
    }
];
const settingsDataSource = [
    {
        type: 'name',
        title: '当前团队名称'
    },
    {
        type: 'nickname',
        title: '团队内的昵称'
    }
];

const { proxy } = getCurrentInstance();

const $teamStore = useTeamStore();
const $userStore = useUserStore();
const $router = useRouter();
const $route = useRoute();

const editableData = ref({});
const transferToOtherUser = ref({
    openModal: false,
    userName: '',
    commiting: false
});

const memberInfo = ref({ nickname: '', id: 0 });

const getSelectedTeam = () => {
    return $teamStore.teams.find((i) => +i.id === +$route.params.id);
};
const isMyTeam = () => {
    const selectedTeam = getSelectedTeam();
    return selectedTeam && selectedTeam.ownerId === $userStore.userData.id;
};

const $methods = {
    edit: (type) => {
        editableData.value[type] = {
            content:
                type === 'name'
                    ? getSelectedTeam().name
                    : memberInfo.value.nickname,
            commiting: false
        };
    },
    save: async (type) => {
        const editData = editableData.value[type];
        if (!editData) {
            return;
        }
        editData.commiting = true;
        await $action.updateTeamData(type, editData.content);
        editData.commiting = false;
        delete editableData.value[type];
    },
    cancel: (type) => {
        delete editableData.value[type];
    },
    async transferToOtherUser(isOK) {
        if (isOK && transferToOtherUser.value.userName) {
            transferToOtherUser.value.commiting = true;
            try {
                await $teamStore.transferAuthority(
                    +$route.params.id,
                    transferToOtherUser.value.userName
                );
                await $action.init();
            } catch (ex) {
                proxy.$message.error(ex.message);
                return;
            } finally {
                transferToOtherUser.value.commiting = false;
            }
        }
        transferToOtherUser.value = {
            openModal: false,
            userName: '',
            commiting: false
        };
    },
    dangerAction: async (type) => {
        if (type === 'transfer') {
            transferToOtherUser.value.openModal = true;
            return;
        }
        proxy.$message.loading('解除团队中...', 0);
        try {
            await $teamStore.dissloveTeam(+$route.params.id);
        } catch (ex) {
            proxy.$message.error(ex.message);
            return;
        }
        proxy.$message.destroy();
        const route = $router.resolve({ name: 'team' });
        location.href = route.href;
    }
};

const $action = {
    async init() {
        memberInfo.value = await $teamStore.getNickName(+$route.params.id);
    },
    async updateTeamData(type, value) {
        let p =
            type === 'name'
                ? $teamStore.changeTeamName
                : $teamStore.setNickName;
        try {
            await p(+$route.params.id, value, memberInfo.value.id);
        } catch (ex) {
            proxy.$message.error(ex.message);
        }
        if (type === 'name') {
            await $action.init();
        }
    }
};
watch($route, async (newRoute) => {
    await $action.init();
});
onMounted(async () => {
    await $action.init();
});
</script>

<style lang="scss" scoped>
.settings-item {
    margin-bottom: 30px;
    .ant-alert {
        margin-bottom: 15px;
    }
    .danger.ant-list {
        border: 2px solid rgb(250, 173, 20);
    }
}
</style>
