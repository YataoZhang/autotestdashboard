<template>
    <a-flex
        align="center"
        justify="center"
        style="height: 100vh"
    >
        <a-result
            status="404"
            title="404"
            sub-title="对不起，当前页面不存在"
        >
            <template #extra>
                <a-button
                    type="primary"
                    @click="backHome"
                    >返回首页</a-button
                >
            </template>
        </a-result>
    </a-flex>
</template>
<script setup>
const backHome = () => {
    window.location.href = '/';
};
</script>
