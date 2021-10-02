import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import index from '/src/components/Index.vue'

const routes = [
  {
      path: '/',
      name: 'Index',
      component: index,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export const store = createStore({
    state () {
      return {
        count: 1
      }
    }
  })

const app = createApp(App)

app.use(store)
app.use(router)


app.mount('#app')
