<template>
  <RouterView/>

</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {computed} from "vue";

const route = useRoute();

</script>

<style scoped></style>