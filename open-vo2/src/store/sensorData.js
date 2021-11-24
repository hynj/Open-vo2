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

const cyclePeriodVo2 = 45


function doVO2Calculations(state) {
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
  // Issues here: ox sensor consistently reads 20.5, throws out the equation ? due to water vapour in air
  // 2.64 kpa is satured vapour pressure of water at 22c
  // Therefore at RH of 50% vapour pressure aprox 1.32
  // So if o2 = 20.5 then 20.5*atmospheric pressure = o2 ppm. o2 atmos pressure + water vapour pressure / o2 ppm = true o2 conc?
  //var VE_corrected = (.79 * VI_corrected) / (1-((ox_percent/100)+(co2_percent/100)));

  let volumeExp = 0.79 * fifteenVol / (1-((fifteenSecO2/100) + (fifteenSecCO2/100)))

  if (fifteenSecO2 != 0 && fifteenSecCO2 != 0)
  {
    state.Calculated.VO2 = ((fifteenVol * 0.21) - (volumeExp * fifteenSecO2/100)) * 4
    state.Calculated.VCO2 = ((volumeExp * fifteenSecCO2/100) - (fifteenVol * state.Calibration.CO2)) * 4 
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
  while (state.Sensor.Oxygen.length > 1) {
    state.Sensor.Oxygen.shift()
  }
  while (state.Sensor.CO2.length > 1) {
    state.Sensor.CO2.shift()
  }
  while (state.Flow.Flow300.length > 1) {
    state.Flow.Flow300.shift()
  }
}
const state = {
    Flow: {
      Instant: [],
      Flowminute: [],
      FlowTotal: [],
      Flow300: [0],
      Flow15: 0,
    },
    HeartRate:{
      value: 0
    },
    Power:{
      value: 0
    },
    Calculated: {
      VO2: 0,
      VCO2: 0,
      RER: 0
    },
    Calibration: {
      Oxygen: 21,
      CO2: 0.0004
    },
    Sensor: {
      Oxygen: [20],
      CO2: [0],
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
    flowGraph: {
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
    timers: {
      timeOld: 0,
      direction: 0
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
  NEW_HEART_RATE(state, value){
    state.HeartRate.value = value;
  },
  ADD_POWER(state, value) {
    state.Power.value = value
  },
  NEW_TEMP_DATA(state, newData){
    state.Sensor.Pressure.push(newData[0])
    state.Sensor.Temperature.push(newData[1])
    state.Sensor.Humidity.push(newData[2])
  },
  DIRECTION_FLIP(state)
  {
    console.log("Flip Direction")
    if (state.timers.direction == 0) {state.timers.direction = 1} else { state.timers.direction = 0}
  },
  UPDATE_TIME(state)
  {
    state.timers.timeOld = Math.floor(Date.now() / 1000)
  },
  NEW_SENSOR_FLOW_DEBUG(state, direction)
  {
    let oldFLow = parseFloat(state.Flow.Flow300[state.Flow.Flow300.length - 1])

    if (direction == 0){
      state.Flow.Flow300.push(oldFLow + parseFloat(Math.random()/4))
      state.Flow.Flow300.push(oldFLow + parseFloat(Math.random()/4))
      state.Flow.Flow300.push(oldFLow + parseFloat(Math.random()/4))
    }
    else{
      let decrementFlow = oldFLow - parseFloat(Math.random())
      if (decrementFlow > 0){
        state.Flow.Flow300.push(decrementFlow)
        state.Flow.Flow300.push(decrementFlow)
        state.Flow.Flow300.push(decrementFlow)
      }
      else{
        state.Flow.Flow300.push(0)
        state.Flow.Flow300.push(0)
        state.Flow.Flow300.push(0)
      }
      
    }
  },
  NEW_SENSOR_DATA_DEBUG(state, direction){
    let oldCo2 = parseFloat(state.Sensor.CO2[state.Sensor.CO2.length - 1])
    let x = parseFloat(state.Sensor.Oxygen[state.Sensor.Oxygen.length - 1])

    if (direction == 0){
      if (x < 17 && x > 16){
        state.Sensor.Oxygen.push(x + parseFloat(Math.random()/10))
      } else if (x < 16 || x > 20){
        state.Sensor.Oxygen.push(x + parseFloat(Math.random()/50))
      }
      else {
        state.Sensor.Oxygen.push(x + parseFloat(Math.random()))
      }

      //Add CO2
      if (oldCo2 < 4.5 && oldCo2 > 3){
        state.Sensor.CO2.push(oldCo2 - parseFloat(Math.random()/10))
      } else if (oldCo2 > 4.5 || oldCo2 <0){
        state.Sensor.CO2.push(oldCo2 - parseFloat(Math.random()/50))
      }
      else {
        state.Sensor.CO2.push(oldCo2 - parseFloat(Math.random()/2))
      }

    } else {
      if (x < 17 && x >16){
        state.Sensor.Oxygen.push(x - parseFloat(Math.random()/10))
      } else if (x <16){
        state.Sensor.Oxygen.push(x - parseFloat(Math.random()/50))
      } else {
        state.Sensor.Oxygen.push(x - parseFloat(Math.random()))
      }

      //Add CO2
      if (oldCo2 < 4.5 && oldCo2 > 3){
        state.Sensor.CO2.push(oldCo2 + parseFloat(Math.random()/10))
      } else if (oldCo2 > 4.5){
        state.Sensor.CO2.push(oldCo2 + parseFloat(Math.random()/50))
      }
      else {
        state.Sensor.CO2.push(oldCo2 + parseFloat(Math.random()))
      }
    }
    if (state.Sensor.Oxygen.length > cyclePeriodVo2 ){
      doVO2Calculations(state)
    }
    state.o2Graph.series[0].data.push(state.Sensor.Oxygen[state.Sensor.Oxygen.length - 1]);
    if (state.o2Graph.series[0].data.length > 50) {
      state.o2Graph.series[0].data.shift()
    }
    
    state.co2Graph.series[0].data.push(state.Sensor.CO2[state.Sensor.CO2.length - 1]);
    if (state.co2Graph.series[0].data.length > 50) {
      state.co2Graph.series[0].data.shift()
    }
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

    state.flowGraph.series[0].data.push(newData[2].toFixed(2));
    state.flowGraph.series[0].data.push(newData[3].toFixed(2));
    state.flowGraph.series[0].data.push(newData[4].toFixed(2));

    if (state.flowGraph.series[0].data.length > 150) {
      state.flowGraph.series[0].data.shift()
      state.flowGraph.series[0].data.shift()
      state.flowGraph.series[0].data.shift()
    }
    

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

    if (state.Sensor.Oxygen.length > cyclePeriodVo2)
    {
      doVO2Calculations(state) 
    }
  },
  LOAD_NEW_FILE(state, contents){
    console.log(contents)
    console.log("Loading File")
  }
};
const actions = {
  async updateOx({ commit }, characteristic) {
    commit("UPDATE_OXYGEN", characteristic);
  },
  async addDebugSensorData({ commit }, data){

    commit("NEW_SENSOR_DATA", [o2Float, co2Float, flowOne, flowTwo, flowThree])
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
  },
  async addHeartRate({commit}, value){
    commit("NEW_HEART_RATE", value);
  },
  async addPowerData({commit}, value){
    commit("ADD_POWER", value);
  },
  startDebug({getters, commit}){
    //Flip Time
    let flipTime = 15
    let respRate = 30
    
    if (getters.getDirection == 0)
    {
        console.log("D=0")
      if (Math.floor(Date.now() / 1000) - getters.getTimeOld > flipTime) {
        commit('UPDATE_TIME')
        commit('DIRECTION_FLIP') }
        commit('NEW_SENSOR_DATA_DEBUG', 0)
        commit('NEW_SENSOR_FLOW_DEBUG', 0)
    }
    else{
      console.log("awd")

      if (Math.floor(Date.now() / 1000) - getters.getTimeOld > flipTime) { 
        commit('UPDATE_TIME')
        commit('DIRECTION_FLIP') }
        commit('NEW_SENSOR_DATA_DEBUG', 1)
        commit('NEW_SENSOR_FLOW_DEBUG', 1)
    }
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
  flowGraph: state => {
    return state.flowGraph.series
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
  },
  getHeartRate: state => {
    return state.HeartRate.value
  },
  getDirection: state => {
    return state.timers.direction
  },
  getTimeOld: state => {
    return state.timers.timeOld
  },
  getPowerData: state => {
    return state.Power.value
  },
  getCalibrationData: state => {
    return state.Calibration
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
