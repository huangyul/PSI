<template>
		<div style="width: 100%; height: 100%;">
			<div style="width: 100%; height: 100%; display:flex; align-items: center; justify-content: center;">
				<h1>欢迎使用进销存</h1>
			</div>
		</div>
</template>

<script>
import Schart from "vue-schart";
import router from '../router';
import { reactive } from "vue";
export default {
    name: "dashboard",
    components: { Schart },
    setup() {
        const name = localStorage.getItem("ms_username");
        const role = name === "admin" ? "超级管理员" : "普通用户";
    },
    
};
</script>

<style scoped>
</style>
