<script>
import { mapGetters } from 'vuex'
//const { ipcRenderer } = require('electron')



export default {
  name: "Sensors",
  components: {  },
  data: function () {
  return {
      selectedDevice: "",
      txService: "",
      txChar: "",
      CO2GraphOptions: {
          chart: {
              id: 'CO2-Chart',
              toolbar: {
                    show: false
              },
              animations: {
                  enabled: TextTrackCue,
                  easing: 'linear',
                  speed: 1,
                  animateGradually: {
                      enabled: true,
                      delay: 150
                  },
                  dynamicAnimation: {
                      enabled: false,
                      speed: 350
                  }
              }
          },
          stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 1,
            dashArray: 0,      
          },
          xaxis: {
            labels: {
            show: false,
            showAlways: false
            },
            axisTicks: {
              show: false,
              borderType: 'solid',
              color: '#78909C',
              width: 6,
              offsetX: 0,
              offsetY: 0
            },
            axisBorder: {
              show: false,
              color: '#78909C',
              offsetX: 0,
              offsetY: 0
            },
          },
          yaxis: {
            min: 0,
            max: 6  ,
            labels: {
              formatter: (value) => { return value.toFixed(0) }
            }
          }
      },
      options: {
        chart: {
          id: 'vuechart-example',
          toolbar: {
              show: false
            },
            animations: {
 enabled: TextTrackCue,
        easing: 'linear',
        speed: 1,
        animateGradually: {
            enabled: true,
            delay: 150
        },
        dynamicAnimation: {
            enabled: false,
            speed: 350
        }
}
        },
        stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 1,
    dashArray: 0,      
},


        xaxis: {
          labels: {
            show: false,
            showAlways: false
          },
          axisTicks: {
            show: false,
            borderType: 'solid',
            color: '#78909C',
            width: 6,
            offsetX: 0,
            offsetY: 0
          },
          axisBorder: {
          show: false,
          color: '#78909C',
          offsetX: 0,
          offsetY: 0
      },
        },
        yaxis: {
          min: 15,
          max: 22,
          labels: {
            formatter: (value) => { return value.toFixed(0) }
          }
        }
      },
      series: [{
        name: 'series-1',
        data: this.oxData
      }]
    }
  },
  methods: {
    updateChart() {
   const max = 90;
   const min = 20;
   const newData = this.series[0].data.map(() => {
     return Math.floor(Math.random() * (max - min + 1)) + min
   })
   // In the same way, update the series option
   this.series = [{
    data: newData
   }]
  }
  },
  computed: {
    ...mapGetters(["oxData"]),
    ...mapGetters(["oxGraph"]),
    ...mapGetters(["co2Graph"]),
    ...mapGetters(["co2Data"]),
    ...mapGetters(["HumidityData"]),
    ...mapGetters(["pressureData"]),
    ...mapGetters(["temperatureData"]),
    ...mapGetters(["vo2Data"]),
    ...mapGetters(["vco2Data"]),
    ...mapGetters(["rerData"]),
    ...mapGetters(["flowFifteen"]),
    ...mapGetters(["getHeartRate"])
  },
}


</script>

<template>
<div class="flex flex-col px-5 py-5 space-y-5">
  

  
    <h2 class="text-3xl font-semibold text-gray-800 dark:text-white">
        Sensor Display
         </h2>
         <p></p>
  
<div class="flex flex-row">

<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
  <b>O2:</b> {{oxData.toFixed(1)}}
</div>
<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
  <b>CO2: </b>{{co2Data.toFixed(2)}}
</div>

<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
  <b>Humidity:</b> {{HumidityData}}
</div>

<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
 <b> Pressure:</b> {{pressureData}}
</div>

<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
 <b> Temp:</b>  {{temperatureData}}  
</div>
</div>

<div class="flex flex-row">

<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
  <b>VO2:</b> {{vo2Data.toFixed(1)}}
</div>
<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
  <b>VCO2: </b>{{vco2Data.toFixed(1)}}
</div>

<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
  <b>RER:</b> {{rerData.toFixed(1)}}
</div>

<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
 <b> Flow 15: </b>{{flowFifteen.toFixed(1)}} 
</div>

<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
 <b> X:</b>   
</div>
</div>

<div class="flex flex-row">

<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
  <b>HR:</b> {{getHeartRate}}
</div>
<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
  <b>X: </b>{{vco2Data.toFixed(1)}}
</div>

<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
  <b>X:</b> {{rerData.toFixed(1)}}
</div>

<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
 <b> X 15: </b>{{flowFifteen.toFixed(2)}} 
</div>

<div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded w-36 h-12">
 <b> X:</b>   
</div>
</div>


 <div class="flex">
     
         <apexchart width="300" type="line" :options="options" :series="oxGraph"></apexchart>
         <apexchart width="300" type="line" :options="CO2GraphOptions" :series="co2Graph"></apexchart>
        
</div>
<button  class="px-4 py-2 w-32 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80" v-on:click="updateChart"></button>
 
</div>
</template>