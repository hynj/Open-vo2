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
      txChar: ""
  }
  },
  methods: {
    async startBlue() {

        this.selectedDevice = await this.$store.dispatch("addDevice", {anyDevices: true,
        services: ["6e400001-b5a3-f393-e0a9-e50e24dcca9e", "4fafc201-1fb5-459e-8fcc-c5c9c331914b"]
      });
      await this.$store.dispatch("connectDevice", { device: this.selectedDevice });
       await this.$store.dispatch("discoverServices", {
        device: this.selectedDevice
      });
       /*let serviceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
       let characteristicUuid = "0x2A37";
       let options = {};
       options.acceptAllDevices = true;
       console.log('Requesting Bluetooth Device...');
  console.log('with ' + JSON.stringify(options));
  navigator.bluetooth.requestDevice(options)
  .then(device => {
    console.log('> Name:             ' + device.name);
    console.log('> Id:               ' + device.id);
    console.log('> Connected:        ' + device.gatt.connected);
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
  */
        
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
  },
  computed: {
    ...mapGetters(["getDevices"])
  }
}
</script>

<template>
<div class="flex flex-col px-5 py-5 space-y-5">
    <h2 class="text-3xl font-semibold text-gray-800 dark:text-white">
        Connection Manager
         </h2>
         <p></p>
         <div class="flex-row space-x-3">
         <button v-on:click="startBlue" class="px-4 py-2 w-32 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80">
    Scan
</button><button v-on:click="stopBlue" class="px-4 py-2 w-32 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80">
    Stop Scan
</button>
</div>
<ul id="example-1" class="spacing-y-30">
          <li
            class="border list-none rounded-sm px-3 py-3"
            v-for="device in getDevices"
            :key="device.deviceId"
          >
            {{ device.deviceName }} {{ device.deviceId }}
            <button
              class=" lg:border-gray-400 rounded-b lg:rounded-b-none lg:rounded-r p-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              v-on:click="setDevice(device.deviceId)"
            >
              Connect
            </button>
          </li>
        </ul>
         
</div>
</template>