<template>
  <Navbar v-if="route.matched.length && !route.meta.hideNavbar" />
  <RouterView />
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()
</script>