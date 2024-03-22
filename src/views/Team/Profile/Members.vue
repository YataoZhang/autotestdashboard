<template>
    <a-flex
        justify="space-between"
        style="padding-bottom: 20px"
    >
        <a-input-search
            style="width: 400px"
            size="large"
            v-model:value="searchedmemberName"
            placeholder="搜素成员"
            enter-button
            @search="$methods.onSearchMember"
        />
        <a-button
            type="primary"
            size="large"
            @click="addUser.openModal = true"
        >
            <template #icon>
                <UserAddOutlined />
            </template>
            邀请用户
        </a-button>
    </a-flex>
    <a-table
        :columns="columns"
        :loading="members.loading"
        :data-source="members.list"
        :scroll="{ y: tableHeight, x: 'auto' }"
        :pagination="{
            defaultPageSize: 10,
            total: members.totalCount,
            onChange: $methods.onPageChange
        }"
    >
        <template #headerCell="{ column }">
            <template v-if="column.key === 'name'">
                <span>
                    <SmileOutlined />
                    成员
                </span>
            </template>
        </template>

        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
                {{ record.username }}
            </template>
            <template v-if="column.key === 'nickname'">
                {{ record.nickname || '-' }}
            </template>
            <template v-if="column.key === 'status'">
                {{ record.status === 1 ? '正常' : '不可用' }}
            </template>
            <template v-else-if="column.key === 'rights'">
                <a-tag :color="isOwner(record.userId) ? 'green' : 'geekblue'">
                    {{ isOwner(record.userId) ? '所有者' : '成员' }}
                </a-tag>
            </template>
            <template v-else-if="column.key === 'action'">
                <a-popconfirm
                    title="确定执行此操作吗？"
                    @confirm="$methods.removeMemberFromTeam(record)"
                >
                    <a-button
                        :disabled="!isMyTeam() || isOwner(record.userId)"
                        danger
                    >
                        移除该用户
                    </a-button>
                </a-popconfirm>
            </template>
        </template>
    </a-table>

    <a-modal
        v-model:open="addUser.openModal"
        title="添加用户"
        okText="添加该用户"
        cancelText="取消"
        @ok="$methods.addUserHandle(true)"
        @cancel="$methods.addUserHandle(false)"
        :confirmLoading="addUser.commiting"
    >
        <a-input
            :readonly="addUser.commiting"
            v-model:value="addUser.userName"
            placeholder="请输入用户的帐户名称"
        >
            <template #prefix>
                <UserOutlined />
            </template>
        </a-input>
    </a-modal>
</template>

<script setup>
import { ref, onMounted, watch, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
    SmileOutlined,
    UserAddOutlined,
    UserOutlined
} from '@ant-design/icons-vue';
import { useTeamStore } from '@/stores/team.js';
import { useUserStore } from '@/stores/user.js';

const tableHeight = window.document.documentElement.offsetHeight - 340;
const columns = [
    {
        name: '成员',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '团队内昵称',
        dataIndex: 'nickname',
        key: 'nickname'
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: '成员权限',
        key: 'rights',
        dataIndex: 'rights'
    },
    {
        title: '设置',
        key: 'action'
    }
];

const $store = useTeamStore();
const $userStore = useUserStore();
const $route = useRoute();
const { proxy } = getCurrentInstance();

const searchedmemberName = ref('');
const addUser = ref({
    openModal: false,
    userName: '',
    commiting: false
});
const { members } = storeToRefs($store);

const getSelectedTeam = () => {
    return $store.teams.find((i) => +i.id === +$route.params.id);
};
const isOwner = (userId) => {
    if (!userId) {
        return false;
    }
    const selectedTeam = getSelectedTeam();
    return selectedTeam && selectedTeam.ownerId === userId;
};
const isMyTeam = () => {
    const selectedTeam = getSelectedTeam();
    return selectedTeam && selectedTeam.ownerId === $userStore.userData.id;
};

const $methods = {
    async onSearchMember() {
        if (!searchedmemberName.value) {
            $action.init();
            return;
        }
        await $store.searchTeamMember(
            $route.params.id,
            searchedmemberName.value
        );
    },
    async addUserHandle(isOK) {
        if (isOK && addUser.value.userName) {
            addUser.value.commiting = true;
            try {
                await $store.addTeamMember(
                    $route.params.id,
                    addUser.value.userName
                );
                await $action.init();
            } catch (ex) {
                proxy.$message.error(ex.message);
                return;
            } finally {
                addUser.value.commiting = false;
            }
        }
        addUser.value = {
            openModal: false,
            userName: '',
            commiting: false
        };
    },
    async removeMemberFromTeam(record) {
        await $store.removeTeamMember($route.params.id, record.id, record.uid);
    },
    async onPageChange(pageIndex) {
        await $store.getAllMembersByTeamId($route.params.id, pageIndex);
    }
};

const $action = {
    async init() {
        const teamId = $route.params.id;
        await $store.getAllMembersByTeamId(teamId, 1, '');
    }
};
watch($route, async (newRoute) => {
    await $action.init();
});
onMounted(async () => {
    await $action.init();
});
</script>
