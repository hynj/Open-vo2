<script>
export default {
  name: "RunTest",
  components: {},
  data: function () {
  return {
      inSetup: 1,
      rampRate: 0
  }
  },
  methods: {
      processClick(clickNumber){
      this.inSetup = clickNumber;
    }
    
  }
}
</script>

<template>

<div class="flex flex-grow flex-col px-5 py-5">
    <h2 class="text-3xl font-semibold text-gray-800 dark:text-white">
        Run Test
         </h2>

         
     <div class="py-2 flex flex-row">   
      <h2 class="flex-grow text-1xl font-semibold text-gray-800 dark:text-white"> Connect VO2 Sensor Array </h2>
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