import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'


import './assets/main.css'


const app = createApp(App)


app.use(createPinia())
app.use(router)


app.config.errorHandler = (error, instance, info) => {
  console.error('Global error:', error)
  console.error('Error info:', info)
  
}


app.mount('#app')