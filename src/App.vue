<template>
  <RouterView/>

</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted} from "vue";
import {useAuthStore} from "@/stores/modules/auth.store.js";

const route = useRoute();

</script>

<style scoped></style>