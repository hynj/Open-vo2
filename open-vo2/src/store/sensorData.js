//var NUS_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
//var NUS_TX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
//var NUS_RX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

//Modified from https://github.com/MonsieurDahlstrom/web-bluetooth-vuex

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
};
const actions = {
  async updateOx({ commit }, characteristic) {
    commit("UPDATE_OXYGEN", characteristic);
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
