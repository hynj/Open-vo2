import { createApp } from 'vue'
import { store } from "./store/index.js"
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import index from '/src/components/Index.vue'
import BluetoothSelect from '/src/components/BluetoothSelect.vue'
import Sensors from '/src/components/Sensors.vue'
const { ipcRenderer } = require('electron')
import VueApexCharts from "vue3-apexcharts";
import RunTest from '/src/components/RunTest.vue'


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
  },
  {
      path: '/Sensors',
      name: 'Sensors',
      component: Sensors
  },
  {
      path: '/RunTest',
      name: 'RunTest',
      component: RunTest
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


const app = createApp(App)

app.use(store)
app.use(router)
app.use(VueApexCharts)

app.mount('#app')
