<script>
import { mapGetters } from 'vuex'
const { ipcRenderer } = require('electron')
export default {
  name: "BluetoothSelect",
  components: {},
  data: function () {
  return {
      selectedDevice: "",
      txService: "",
      txChar: "",
      showVO2: 0,
      showHR: 0,
      IsHidden: 1
  }
  },
  methods: {
    processClickVo2(clickNumber){
      console.log(clickNumber);
      this.showVO2 = clickNumber;
    },
    processClickHR(clickNumber){
      console.log(clickNumber);
      this.showHR = clickNumber;
      this.IsHidden = 0;
    },
    async startBlueVO2() {
      //anyDevices: true
        this.selectedDevice = await this.$store.dispatch("addDevice", {namePrefix: "VO2",
        services: ["6e400001-b5a3-f393-e0a9-e50e24dcca9e", "4fafc201-1fb5-459e-8fcc-c5c9c331914b"]
      });
      await this.$store.dispatch("connectDevice", { device: this.selectedDevice });
       await this.$store.dispatch("discoverServices", {
        device: this.selectedDevice
      });
       
    },
    async startBlueHR() {
      //Reset Devicelist
      this.$store.dispatch("resetDeviceList");
        this.selectedDevice = await this.$store.dispatch("addDevice", {services: ['heart_rate']});
      await this.$store.dispatch("connectDevice", { device: this.selectedDevice });
       await this.$store.dispatch("discoverServices", {
        device: this.selectedDevice
      });        
    },
    stopBlue() {
      ipcRenderer.send("channelForTerminationSignal");
    },
    addDevice(list) {
      this.$store.commit("addToDeviceList", [list]);
    },
    setDevice(setDeviceID) {
      console.log(setDeviceID);
      ipcRenderer.send("channelForSelectingDevice", setDeviceID);
    },
    async disconnectDevice(device){
      await this.$store.dispatch("removeDevice", { device: device });
    }
  },
  computed: {
    ...mapGetters(["getDevices"]),
    ...mapGetters(["currentDevices"])
  }
}
</script>

<template>
<div class="flex flex-auto flex-col px-5 py-5 space-y-5">
    <h1 class="underline text-4xl font-semibold text-gray-800 dark:text-white">
        Connection Manager
         </h1>
         

    <p class="font-semibold text-gray-800 dark:text-white">Begin by connecting the VO2 Sensor array.</p>
    <p></p>
  <h2 class="flex text-1xl font-semibold text-gray-800 dark:text-white"> Connect VO2 Sensor Array 
      <div class="flex-grow text-right px-32">
        <button v-if="showVO2 == 0" class="text-white bg-blue-500 rounded-md" id="todrop" v-on:click="processClickVo2(1)">
          <svg xmlns="http://www.w3.org/2000/svg" class=" h-8 w-8 flex justify-self-end" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <button v-if="showVO2 > 0" class="text-white bg-blue-500 rounded-md" id="todrop" v-on:click="processClickVo2(0)">
          <svg xmlns="http://www.w3.org/2000/svg" class=" h-8 w-8 flex justify-self-end" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
</svg>
      </button>
</div>
    </h2>
         <div v-if="showVO2 == 1" class="flex-row space-x-3 rounded-md border-gray-400 ">
         <button v-on:click="startBlueVO2" class="px-4 py-2 w-32 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80">
    Scan
</button><button v-on:click="stopBlue" class="px-4 py-2 w-32 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80">
    Stop Scan
</button>
<br><br>

<ul id="example-1" class="spacing-y-30">
          <li
            class="flex justify-between border-2 border-gray-900 list-none rounded-sm px-3 py-3"
            v-for="device in getDevices"
            :key="device.deviceId"
          >
            {{ device.deviceName }} {{ device.deviceId }}
            <button
              class="self-end text-right lg:border-gray-400 rounded-b lg:rounded-r p-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              v-on:click="setDevice(device.deviceId)"
            >
              Connect
            </button>
          </li>
        </ul>
         </div>
         <h2 v-bind:class="{ 'opacity-50': IsHidden}" class=" flex text-1xl font-semibold text-gray-800 dark:text-white"> Connect HR Sensor
      <div class="flex-grow text-right px-32">
        <button v-if="showHR == 0" class="text-white bg-blue-500 rounded-md" id="todrop" v-on:click="processClickHR(1)">
          <svg xmlns="http://www.w3.org/2000/svg" class=" h-8 w-8 flex justify-self-end" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <button v-if="showHR > 0" class="text-white bg-blue-500 rounded-md" id="todrop" v-on:click="processClickHR(0)">
          <svg xmlns="http://www.w3.org/2000/svg" class=" h-8 w-8 flex justify-self-end" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
</svg>
      </button>
</div>
    </h2>
         <div v-if="showHR == 1" class="flex-row space-x-3 rounded-md border-gray-400 ">
         <button v-on:click="startBlueHR" class="px-4 py-2 w-32 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80">
    Scan
</button><button v-on:click="stopBlue" class="px-4 py-2 w-32 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80">
    Stop Scan
</button>
<br><br>


<ul id="example-2" class="flex spacing-y-30">
          <li
            class="flex justify-between border-2 border-gray-900 list-none rounded-sm px-3 py-3"
            v-for="device in getDevices"
            :key="device.deviceId"
          >
            {{ device.deviceName }} {{ device.deviceId }}
            <button
              class="self-end text-right lg:border-gray-400 rounded-b lg:rounded-r p-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              v-on:click="setDevice(device.deviceId)"
            >
              Connect
            </button>
          </li>
        </ul>
         </div>

<div>
  
<p class="text-2xl text-gray-800 dark:text-white">Connected Devices </p><p></p>
         <ul id="example-3" class="spacing-y-30">
          <li
            class="flex my-2 justify-between text-base border-gray-900 text-gray-800 text-1 dark:text-white border-2 list-none rounded-sm px-3 py-3"
            v-for="device in currentDevices"
            :key="device.id"
          >
            {{ device.name }}
            <button
              class="self-end text-right lg:border-gray-400 rounded-b lg:rounded-r p-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded"
              v-on:click="disconnectDevice(device)"
            >
              Disconnect
            </button>
          </li>
        </ul>
  </div>
</div>





</template>