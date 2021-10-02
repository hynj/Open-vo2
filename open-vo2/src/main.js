import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import './index.css'

export const store = createStore({
    state () {
      return {
        count: 1
      }
    }
  })

const app = createApp(App)

app.use(store)


app.mount('#app')
