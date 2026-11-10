<template>
  <div class="flex min-h-screen flex-col bg-[#f4f6f1] md:flex-row">
    <SidebarView :role="authStore.currentUser.rights"/>
    <RouterView/>
  </div>
</template>

<script setup>
import SidebarView from '@/components/dashboard/SidebarView.vue'
import {useAuthStore} from "@/stores/modules/auth.store.js";
import {onMounted} from "vue";

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.checkAuth()
})
</script>