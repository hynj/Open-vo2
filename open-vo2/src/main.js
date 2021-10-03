import { createApp } from 'vue'
import { store } from "./store/index.js"
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import index from '/src/components/Index.vue'
import BluetoothSelect from '/src/components/BluetoothSelect.vue'
const { ipcRenderer } = require('electron')

ipcRenderer.on("channelForBluetoothDeviceList", (event, list) => {
  console.log("renderer recived device");
  store.commit("addToDeviceList", list);
});

const routes = [
  {
      path: '/',
      name: 'Index',
      component: index,
  },
  {
      path: '/BluetoothSelect',
      name: 'BluetoothSelect',
      component: BluetoothSelect
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


const app = createApp(App)

app.use(store)
app.use(router)


app.mount('#app')
