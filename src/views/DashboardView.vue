<template>
  <div class="flex min-h-screen flex-col bg-[#f4f6f1] md:flex-row">
    <SidebarView role="gestionnaire"/>
    <RouterView/>
  </div>
</template>

<script setup>
import SidebarView from '@/components/dashboard/SidebarView.vue'
</script>