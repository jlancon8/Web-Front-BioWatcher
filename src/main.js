import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/index.css'
import {useAuthStore} from "@/stores/modules/auth.store.js";

const app = createApp(App)
app.use(createPinia())
const authStore = useAuthStore()
await authStore.checkAuth();
app.use(router)

app.mount('#app')
