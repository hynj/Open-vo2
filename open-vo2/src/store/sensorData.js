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
      Oxygen: [20],
      CO2: [],
      Humidity: [],
      Temperature: [],
      Pressure: [],
      Time: []
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
    state.Sensor.Oxygen.push(newData[0])
    state.Sensor.CO2.push(newData[1])
    state.Sensor.Pressure.push(newData[2])
    state.Sensor.Humidity.push(newData[3])
    state.Sensor.Temperature.push(newData[4])
    state.Sensor.Time.push(Date.now())

    state.Flow.Instant.push(newData[5])
    console.log("placeholder")
  }
};
const actions = {
  async updateOx({ commit }, characteristic) {
    commit("UPDATE_OXYGEN", characteristic);
  },
  async addSensorData({ commit }, characteristic) {
    let o2Float = Buffer.from([ characteristic[3], characteristic[2], characteristic[1], characteristic[0] ]).readFloatBE(0)
    let co2Float = Buffer.from([ characteristic[7], characteristic[6], characteristic[5], characteristic[4] ]).readFloatBE(0)
    let pressureInt16 = Buffer.from([ characteristic[8], characteristic[9]]).readInt16BE(0)
    let tempInt = characteristic[10]
    let humInt = characteristic[11]
    let flowOne = Buffer.from([ characteristic[15], characteristic[14], characteristic[13], characteristic[12] ]).readFloatBE(0)
    let flowTwo = Buffer.from([ characteristic[19], characteristic[18], characteristic[17], characteristic[16] ]).readFloatBE(0)

    commit("NEW_SENSOR_DATA", [o2Float, co2Float, pressureInt16, tempInt, humInt, flowOne, flowTwo])
  }
};
const getters = {
  oxData: state => {
    return state.Sensor.Oxygen[state.Sensor.Oxygen.length - 1]
  },
  oxGraph: state => {
    return state.Graph.series
  },
  co2Data: state => {
    return state.Sensor.CO2[state.Sensor.CO2.length - 1]
  },
  HumidityData: state => {
    return state.Sensor.Humidity[state.Sensor.Humidity.length - 1]
  },
  pressureData: state => {
    return state.Sensor.Pressure[state.Sensor.Pressure.length - 1]
  },
  temperatureData: state => {
    return state.Sensor.Temperature[state.Sensor.Temperature.length - 1]
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
