<template></template>
<script setup>
import { useRouter } from 'vue-router';
import { useTeamStore } from '@/stores/team.js';
import { useUserStore } from '@/stores/user.js';

const $router = useRouter();
const $teamStore = useTeamStore();
const $userStore = useUserStore();

function goProfile(id) {
    $router.push({
        name: 'team_profile',
        params: {
            id
        }
    });
}

function start() {
    if ($teamStore.currentTeam.id) {
        goProfile($teamStore.currentTeam.id);
        return;
    }
    const myTeam = $teamStore.teams.find((i) => {
        return i.ownerId === $userStore.userData.id;
    });
    if (myTeam) {
        goProfile(myTeam.id);
        return;
    }
    const firstTeam = $teamStore.teams[0];
    if (firstTeam) {
        goProfile(firstTeam.id);
        return;
    }
    $router.push({
        name: 'team_create'
    });
}
start();
</script>
