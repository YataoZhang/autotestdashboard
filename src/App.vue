<script setup>
import { RouterView } from 'vue-router';
import { useUserStore } from '@/stores/user';
const $userStore = useUserStore();

$userStore.getUserInfo();
</script>

<template>
    <RouterView />
</template>

<style scoped></style>
