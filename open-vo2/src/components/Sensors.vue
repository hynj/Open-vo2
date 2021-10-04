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
      options: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: [1991, 1992]
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
    ...mapGetters(["oxGraph"])
  },
}

</script>

<template>
<div class="flex flex-col px-5 py-5 space-y-5">
    <h2 class="text-3xl font-semibold text-gray-800 dark:text-white">
        Sensor Display
         </h2>
         <p></p>
         
         <apexchart width="500" type="line" :options="options" :series="oxGraph"></apexchart>
 <button  class="px-4 py-2 w-32 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80" v-on:click="updateChart"></button>
        
</div>
 {{oxData}}

</template>