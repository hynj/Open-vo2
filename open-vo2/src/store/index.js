import { createStore } from 'vuex'
import BlueTooth from './bluetooth'
import sensorData from './sensorData'

export const store = createStore({
    state: {},
    mutations: {},
    actions: {},
    modules: {
      BlueTooth,
      sensorData
    }
  });

