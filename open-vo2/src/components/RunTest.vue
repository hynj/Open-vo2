<script>
import { mapGetters } from 'vuex'
const { ipcRenderer } = require('electron')
export default {
  name: "RunTest",
  components: {},
  data: function () {
  return {
      inSetup: 1,
      inTestSetup: 1,
      inCal: 1,
      rampRate: 0,
      toggle: 0,
      o2Temp: 0,
      co2Temp: 0,
      flowOneTemp: 0,
      flowTwoTemp: 0,
      flowThreetemp: 0,
      direction: 0,
      cycleTime: 15,
      timeOld: 0,
      flowCalChart: {
          chart: {
              id: 'flowCalChart',
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
            min: -10,
            max: 10  ,
            labels: {
              formatter: (value) => { return value.toFixed(0) }
            }
          }
      }
  }
  },
  methods: {
      processClick(clickNumber){
      this.inSetup = clickNumber;
    },
    processToggle(){
      if (this.toggle == 0) { 
        this.toggle = 1
        } else {this.toggle = 0}
       setInterval(() => { this.$store.dispatch('startDebug')}, 1000);
        
    },
    processClickSetup(clickNum){
        this.inTestSetup = clickNum;
    },
    processClickCal(clickNum){
        this.inCal = clickNum;
    },
    saveFile(){
      let x = this.$store.getters["getCalibrationData"]
      ipcRenderer.send("saveFile", JSON.stringify(x));
    },
    loadFile(){
      ipcRenderer.send("loadFile", "awd");
    },
    addUser(){
      let newUserData = {
        name: "test",
        weight: 75,
        height: 1.8,
        FVC: 2
      }
      this.$store.commit("ADD_USER", newUserData)
    }
  },
  computed: {
    ...mapGetters(["getCalibrationData"]),
    ...mapGetters(["flowGraph"]),
    ...mapGetters(["co2Graph"]),
  }
}
</script>

<template>

<div class="flex flex-grow flex-col px-5 py-5">
    <h2 class="text-3xl font-semibold text-gray-800 dark:text-white">
        Run Test
         </h2>
        <br>
         
        <div class=" flex flex-row items-right">
          <div>Debug: </div>
  <div class="flex items-right">
    <span class="">
      <i class="far fa-sun text-gray-400"></i>
    </span>
    <!-- Switch Container -->
    <div 
      v-bind:class="{ 'bg-blue-700': toggle}"
      class="w-14 h-7 flex items-center bg-gray-300 rounded-full mx-3 px-1"
      v-on:click="processToggle()"
    >
      <!-- Switch -->
      <div 
        class="bg-white w-5 h-5 rounded-full shadow-md transform"
        v-bind:class="{ 'translate-x-7': toggle}"
      ></div>
    </div>
    <span class="">
      <i class="far fa-moon text-gray-400"></i>
    </span>
  </div>
</div>

     <br>    
    <div class="py-2 flex flex-row">   
      <h2 class="flex-grow text-1xl font-semibold text-gray-800 dark:text-white">User Setup: </h2>
      <div class="self-end text-right">
        <button v-if="inSetup > 0" class="text-white bg-blue-500 rounded-md" id="todrop" v-on:click="processClick(0)">
          <svg xmlns="http://www.w3.org/2000/svg" class=" h-8 w-8 flex justify-self-end" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <button v-if="inSetup == 0" class="text-white bg-blue-500 rounded-md" id="todrop" v-on:click="processClick(1)">
          <svg xmlns="http://www.w3.org/2000/svg" class=" h-8 w-8 flex justify-self-end" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
</svg>
      </button>
 </div>
 </div>
      <div v-if="inSetup == 0" class="">
         <form class="w-full max-w-4xl">
  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-1/3 px-3 mb-6 md:mb-0">
      <label class="max-w-xs block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
        Name:
      </label>
      <input class="max-w-xs appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Bob Jones">
  
    </div>
    <div class="w-1/3 px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
        Weight:
      </label>
      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="80">
  
    </div>
    <div class="w-1/3 px-3">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
        Height:
      </label>
      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="1.8">
    </div>
  </div>
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-1/3 px-3 mb-6 md:mb-0">
      <label class="max-w-xs block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
        FVC:
      </label>
      <input class="max-w-xs appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="5">
  
    </div>

  
  </div>
</form>
</div> 
<div class="py-2 flex flex-row">   
      <h2 class="flex-grow text-1xl font-semibold text-gray-800 dark:text-white">Test Protocol: </h2>
      <div class="self-end text-right">
        <button v-if="inTestSetup > 0" class="text-white bg-blue-500 rounded-md" id="todrop" v-on:click="processClickSetup(0)">
          <svg xmlns="http://www.w3.org/2000/svg" class=" h-8 w-8 flex justify-self-end" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <button v-if="inTestSetup == 0" class="text-white bg-blue-500 rounded-md" id="todrop" v-on:click="processClickSetup(1)">
          <svg xmlns="http://www.w3.org/2000/svg" class=" h-8 w-8 flex justify-self-end" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
</svg>
      </button>
 </div>
 </div>
      <div v-if="inTestSetup == 0" class="">
         <form class="w-full max-w-4xl">
  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-1/3 px-3 mb-6 md:mb-0">
      <label class="max-w-xs block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
        Duration:
      </label>
      <input class="max-w-xs appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Bob Jones">
  
    </div>
    <div class="w-1/3 px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
        Power:
      </label>
      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="80">
  
    </div>
    <div class="w-1/3 px-3">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
        Interval Time:
      </label>
      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="1.8">
    </div>
  </div>
  
</form>
</div> 

     <div>
<div class="py-2 flex flex-row">   
      <h2 class="flex-grow text-1xl font-semibold text-gray-800 dark:text-white">Calibration: </h2>
      <div class="self-end text-right">
        <button v-if="inCal > 0" class="text-white bg-blue-500 rounded-md" id="todrop" v-on:click="processClickCal(0)">
          <svg xmlns="http://www.w3.org/2000/svg" class=" h-8 w-8 flex justify-self-end" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <button v-if="inCal == 0" class="text-white bg-blue-500 rounded-md" id="todrop" v-on:click="processClickCal(1)">
          <svg xmlns="http://www.w3.org/2000/svg" class=" h-8 w-8 flex justify-self-end" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
</svg>
      </button>
 </div>
 </div>
<div v-if="inCal == 0">
      <apexchart width="800" height="200" type="line" :options="flowCalChart" :series="flowGraph"></apexchart>
</div>
     <button v-on:click="loadFile()">Load</button>
     <br>
     <button v-on:click="saveFile()">Save</button>
      <br>
     <button v-on:click="addUser()">Add a User</button>
    </div>
     </div>

</template>