//var NUS_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
//var NUS_TX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
//var NUS_RX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

//Modified from https://github.com/MonsieurDahlstrom/web-bluetooth-vuex


//Gas Sensor Vuex Store
//Byte assignment BLE sensor data
//B0: Oxygen val 1
//B1: Oxygen Val 2
//B2: Oxygen Val 3
//B3: Oxygen Val 4
//B4: Co2 Val 1
//B5: Co2 Val 2
//B6: Co2 Val 3
//B7: Co2 val 4
//B8: Pres 1
//B9: Pres 2
//B10: Temp 1
//B11: Hum 1
//B12: Flow 3
//B13: Flow 4
//B14: Flow 5
//B15: Flow 6
//B16: Flow 7
//B17: Flow 8
//B18: Flow 9
//B19: Flow 10

const state = {
    Flow: {
      Instant: [],
      Flowminute: [],
      FlowTotal: []
    },
    Sensor: {
      Oxygen: [10,20],
      CO2: []
    },
    Graph: {
      series: [
        {
        name: 'series-1',
        data: []
      }
    ]
    }
};

const mutations = {
  UPDATE_OXYGEN(state, characteristic) {
    //console.log(characteristic)
    state.Graph.series[0].data.push(characteristic);
  },
  NEW_SENSOR_DATA(state, newData) {
    console.log("placeholder")
  }
};
const actions = {
  async updateOx({ commit }, characteristic) {
    commit("UPDATE_OXYGEN", characteristic);
  },
  async addSensorData({ comit }, characteristic) {
    let newData = characteristic
    comit("NEW_SENSOR_DATA", newData)
  }
};
const getters = {
  oxData: state => {
    return state.Sensor.Oxygen
  },
  oxGraph: state => {
    return state.Graph.series
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
