import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { configure } from "vue-gtag";

if (import.meta.env.VUE_APP_ANALYTICS_ID) {
  configure({
    tagId: import.meta.env.VUE_APP_ANALYTICS_ID
  })
}

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')

