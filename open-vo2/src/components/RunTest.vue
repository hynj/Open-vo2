<script>
import { mapGetters } from 'vuex'
export default {
  name: "RunTest",
  components: {},
  data: function () {
  return {
      inSetup: 1,
      rampRate: 0,
      toggle: 0,
      o2Temp: 0,
      co2Temp: 0,
      flowOneTemp: 0,
      flowTwoTemp: 0,
      flowThreetemp: 0,
      direction: 0,
      cycleTime: 15,
      timeOld: 0
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
        
    }
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
      <h2 class="flex-grow text-1xl font-semibold text-gray-800 dark:text-white"> Setup: </h2>
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
         <form action="">
  <label for="fname">First name:</label>
  <input type="text" id="fname" name="fname"><br><br>
  <label for="lname">Last name:</label>
  <input type="text" id="lname" name="lname"><br><br>
  <input type="submit" value="Submit">
</form>
   
</div> 
     <div>
     <p>Calibration:</p>
     Placemarker for calibration algo <br>

     Input: Cal volume<br>

     FLOW GRAPH HERE<br>

    Start Calibration

     <p>Settings:</p>
    </div>
     </div>

</template>