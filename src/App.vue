<template>
  <Navbar v-if="route.matched.length && !route.meta.hideNavbar" />
  <RouterView />
  <NotificationContainer />
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import NotificationContainer from '@/components/common/NotificationContainer.vue'
import {useNotificationStore} from "@/stores/modules/notifs.store.js";

const route = useRoute()
</script>