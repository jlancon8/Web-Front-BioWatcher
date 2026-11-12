<template>
  <Navbar v-if="!route.meta.hideNavbar" />
  <RouterView />
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()
</script>