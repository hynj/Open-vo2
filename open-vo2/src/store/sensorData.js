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
      FlowTotal: [],
      Flow300: [],
      Flow15: 0,
    },
    Calculated: {
      VO2: 0,
      VCO2: 0,
      RER: 0
    },
    Sensor: {
      Oxygen: [20],
      CO2: [],
      Humidity: [],
      Temperature: [],
      Pressure: [],
      Time: []
    },
    o2Graph: {
      series: [
        {
        name: 'series-1',
        data: []
      }
    ]
    },
    co2Graph: {
      series: [
        {
        name: 'series-1',
        data: []
      }
    ]
    },
    flowGraph: {
      series: [
        {
        name: 'flow',
        data: []
      }
    ]
    }
};

const mutations = {
  UPDATE_OXYGEN(state, characteristic) {
    //console.log(characteristic)
    state.o2Graph.series[0].data.push(characteristic);
  },
  NEW_TEMP_DATA(state, newData){
    state.Sensor.Pressure.push(newData[0])
    state.Sensor.Temperature.push(newData[1])
    state.Sensor.Humidity.push(newData[2])
  },
  NEW_SENSOR_DATA(state, newData) {
    state.Sensor.Oxygen.push(newData[0])
    state.Sensor.CO2.push(newData[1]/ 1000)
    //state.Sensor.Pressure.push(newData[2])
    //state.Sensor.Humidity.push(newData[3])
    //state.Sensor.Temperature.push(newData[4])
    state.Sensor.Time.push(Date.now())

    state.Flow.Instant.push(newData[2]);
    state.Flow.Instant.push(newData[3]);
    state.Flow.Instant.push(newData[4]);

    state.Flow.Flow300.push(newData[2] + newData[3] + newData[4])

    state.o2Graph.series[0].data.push(newData[0].toFixed(2));
    if (state.o2Graph.series[0].data.length > 50) {
      state.o2Graph.series[0].data.shift()
    }

    state.co2Graph.series[0].data.push(newData[1] / 1000);
    if (state.co2Graph.series[0].data.length > 50) {
      state.co2Graph.series[0].data.shift()
    }

    state.flowGraph.series[0].data.push(newData[2]);
    state.flowGraph.series[0].data.push(newData[3]);
    state.flowGraph.series[0].data.push(newData[4]);

    console.log(newData[2]);

    while (state.flowGraph.series[0].data.length > 100) {
      state.flowGraph.series[0].data.shift()
    }

    if (state.Sensor.Oxygen.length > 45)
    {
      //15 seconds of data recieved -> calculate vo2 / RER
      console.log("15 sec update");
      //Sum all Flow and multiply out to get volume in 15 seconds (ms averaged)
      let fifteenSecFlowAverage = state.Flow.Flow300.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue
      }, 0);

      let fifteenSecO2 = state.Sensor.Oxygen.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue
      }, 0) / state.Sensor.Oxygen.length;

      let fifteenSecCO2 = state.Sensor.CO2.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue
      }, 0) / state.Sensor.CO2.length;

      //let fifteenVol = fifteenSecFlowAverage / 4
      let fifteenVol = fifteenSecFlowAverage;
      state.Flow.Flow15 = fifteenVol;

      // To get VE with need to use haldane transformation (VE = FIN2 * VI / (1-(FE02 + FECo2)) )
      // Nitrogen ammount stays the same in inspiration and expiration.
      // We can calculate the ammount of nitrogen in expired air as we know the ammount of O2 and CO2
      // Issues here: ox sensor consistently reads 20.5, throws out the equation
      //var VE_corrected = (.79 * VI_corrected) / (1-((ox_percent/100)+(co2_percent/100)));

      let volumeExp = 0.79 * fifteenVol / (1-((fifteenSecO2/100) + (fifteenSecCO2/100)))

      if (fifteenSecO2 != 0 && fifteenSecCO2 != 0)
      {
        state.Calculated.VO2 = ((fifteenVol * 0.21) - (volumeExp * fifteenSecO2/100)) * 4
        state.Calculated.VCO2 = ((volumeExp * fifteenSecCO2/100) - (fifteenVol * 0.0004)) * 4 
        state.Calculated.RER = state.Calculated.VCO2 / state.Calculated.VO2
      }
      else
      {
        state.Calculated.VCO2 = 0
        state.Calculated.VO2 = 0;
        state.Calculated.RER = 0;
        console.log("division by 0");
      }

      //Reset the data set
      while (state.Sensor.Oxygen.length > 0) {
        state.Sensor.Oxygen.pop()
      }
      while (state.Sensor.CO2.length > 0) {
        state.Sensor.CO2.pop()
      }
      while (state.Flow.Flow300.length > 0) {
        state.Flow.Flow300.pop()
      }
    }


  }
};
const actions = {
  async updateOx({ commit }, characteristic) {
    commit("UPDATE_OXYGEN", characteristic);
  },
  async addSensorData({ commit }, characteristic) {
    let o2Float = Buffer.from([ characteristic[3], characteristic[2], characteristic[1], characteristic[0] ]).readFloatBE(0)
    let co2Float = Buffer.from([ characteristic[7], characteristic[6], characteristic[5], characteristic[4] ]).readFloatBE(0)
    let flowOne = Buffer.from([ characteristic[11], characteristic[10], characteristic[9], characteristic[8] ]).readFloatBE(0)
    let flowTwo = Buffer.from([ characteristic[15], characteristic[14], characteristic[13], characteristic[12] ]).readFloatBE(0)
    let flowThree = Buffer.from([ characteristic[19], characteristic[18], characteristic[17], characteristic[16] ]).readFloatBE(0)

    commit("NEW_SENSOR_DATA", [o2Float, co2Float, flowOne, flowTwo, flowThree])
  },
  async addTempData({ commit }, characteristic){
    let pressureInt16 = Buffer.from([ characteristic[0], characteristic[1]]).readInt16BE(0)
    let tempInt = characteristic[2]
    let humInt = characteristic[3]

    commit("NEW_TEMP_DATA", [pressureInt16, tempInt, humInt])
  }
};
const getters = {
  oxData: state => {
    return state.Sensor.Oxygen[state.Sensor.Oxygen.length - 1]
  },
  oxGraph: state => {
    return state.o2Graph.series
  },
  co2Graph: state => {
    return state.co2Graph.series
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
  },
  vo2Data: state => {
    return state.Calculated.VO2
  },
  vco2Data: state => {
    return state.Calculated.VCO2
  },
  rerData: state => {
    return state.Calculated.RER
  },
  flowFifteen: state => {
    return state.Flow.Flow15
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
