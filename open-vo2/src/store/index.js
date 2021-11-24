import { createStore } from 'vuex'
import BlueTooth from './bluetooth'
import sensorData from './sensorData'
import userData from './userData.js'

export const store = createStore({
    state: {},
    mutations: {},
    actions: {},
    modules: {
      BlueTooth,
      sensorData,
      userData
    }
  });

