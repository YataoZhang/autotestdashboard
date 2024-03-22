<template>
    <a-flex
        justify="center"
        align="center"
        style="height: 100%"
    >
        <a-result
            status="warning"
            :title="
                $teamStore.teams.length
                    ? '请在上方选择您的测试团队，或创建新团队'
                    : '查看测试计划需要首先创建团队并选择团队.'
            "
        >
            <template #extra>
                <a-button
                    size="large"
                    key="console"
                    type="primary"
                >
                    <RouterLink :to="{ name: 'team_create' }">
                        {{
                            $teamStore.teams.length
                                ? '创建新团队'
                                : '马上创建团队'
                        }}
                    </RouterLink>
                </a-button>
            </template>
        </a-result>
    </a-flex>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { useTeamStore } from '@/stores/team';

const $router = useRouter();
const $teamStore = useTeamStore();
if ($teamStore.teams.length) {
    $router.push({
        name: 'plans_home',
    });
}
</script>
<style lang="scss" setup></style>
