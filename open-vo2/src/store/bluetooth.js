//var NUS_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
//var NUS_TX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
//var NUS_RX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

//vo2 sensor primary service "4fafc201-1fb5-459e-8fcc-c5c9c331914b"

//Modified from https://github.com/MonsieurDahlstrom/web-bluetooth-vuex

const state = {
    devices: [],
    devID: [],
    services: [],
    characteristics: [],
    deviceList: [],
    vo2UUID: "",
    vo2Connected: 0,
    hrConnected: 0
};

const mutations = {
    BLE_DEVICE_ADDED(state, device) {
        const storedDevice = state.devices.find(
          storedDevice => storedDevice.id === device.id
        );
        const storedDeviceIndex = state.devices.indexOf(storedDevice);
        if (storedDeviceIndex < 0) {
          state.devices.push(device);
        } else {
            state.devices[storedDeviceIndex] = device;
          //Vue.set(state.devices, storedDeviceIndex, device);
        }
      },
      BLE_VO2_ADD(state, uuid) {
        state.vo2UUID = uuid;
        state.vo2Connected = 1;
        console.log("vo2 Sensors connected");
        console.log(state.vo2UUID);
      },
      BLE_HR_ADD(state){
        state.hrConnected = 1; 
        console.log("heart Rate Connected");
      },
      BLE_VO2_REMOVE(state) {
        state.vo2UUID = "";
        state.vo2Connected = 0;
        console.log("VO2 Sensor disconnected");
      },
      BLE_SERVICE_ADDED(state, service) {
        var serviceIndex = state.services.indexOf(service);
        if (serviceIndex < 0) {
          state.services.push(service);
          console.log(service);
        } else {
          state.services.splice(serviceIndex, 1, service);
        }
      },
      BLE_CHARACTERISTIC_CHANGED(state, characteristic) {
        var characteristicIndex = state.characteristics.findIndex(entry => {
          return entry === characteristic;
        });
        if (characteristicIndex < 0) {
          state.characteristics.push(characteristic);
        } else {
          //console.log(characteristic);
          state.characteristics.splice(characteristicIndex, 1, characteristic);
        }
      },  
      BLE_CHARACTERISTICS_DISCOVERED(state, characteristics) {
        console.log(characteristics);
        characteristics.forEach(el => {
          var characteristicIndex = state.characteristics.findIndex(entry => {
            return entry === el;
          });
          if (characteristicIndex < 0) {
            state.characteristics.push(el);
          } else {
            state.characteristics.splice(characteristicIndex, 1, el);
          }
        });
      },
      BLE_DEVICE_UPDATED(state, device) {
        // determine if vuex has cached device, otherwise return
        const storedDevice = state.devices.find(
          storedDevice => storedDevice.id === device.id
        );
        const storedDeviceIndex = state.devices.indexOf(storedDevice);
        if (storedDeviceIndex < 0) return;
        state.devices[storedDeviceIndex] = device;
        //Vue.set(state.devices, storedDeviceIndex, device);
      },
      BLE_DEVICE_DISCONNECTED(state, device) {
        // find vuex cached services for the device
        const services = state.services.filter(
          service => service.device.id === device.id
        );
        // find characteristics for vuex
        const characteristics = state.characteristics.filter(characteristic =>
          services.includes(characteristic.service)
        );
        // remove characteristics
        for (const characterToDelete of characteristics) {
          const characteristicIndex = state.characteristics.indexOf(
            characterToDelete
          );
          state.characteristics.splice(characteristicIndex, 1);
        }
        // remove services
        for (const serviceToDelete of services) {
          if (serviceToDelete.uuid == "4fafc201-1fb5-459e-8fcc-c5c9c331914b")
          {
            state.vo2UUID = "";
            state.vo2Connected = 0;
          }
          if (serviceToDelete.uuid == "0000180d-0000-1000-8000-00805f9b34fb")
          {
            state.hrConnected = 0;
            console.log("HR Disconnected")
          }
          const serviceIndex = state.services.indexOf(serviceToDelete);
          state.services.splice(serviceIndex, 1);
        }
        const storedDeviceIndex = state.devices.indexOf(device);
        state.devices[storedDeviceIndex] = device;
        //Vue.set(state.devices, storedDeviceIndex, device);
      },
      RESET_DEVLIST(state){
          while(state.deviceList.length > 0) {
            state.deviceList.pop();
        }
      },
      BLE_DEVICE_REMOVED (state, device) {
        // determine if vuex has cached device, otherwise return
        const storedDevice = state.devices.find(storedDevice => storedDevice.id === device.id)
        const storedDeviceIndex = state.devices.indexOf(storedDevice)
        if(storedDeviceIndex < 0)return
        // find vuex cached services for the device
        const services = state.services.filter(service => service.device.id === device.id)
        // find characteristics for vuex
        const characteristics = state.characteristics.filter(characteristic => services.includes(characteristic.service))
        // remove characteristics
        for(const characterToDelete of characteristics) {
          const characteristicIndex = state.characteristics.indexOf(characterToDelete)
          state.characteristics.splice(characteristicIndex,1)
        }
        // remove services
        for (const serviceToDelete of services) {
          if (serviceToDelete.uuid == "4fafc201-1fb5-459e-8fcc-c5c9c331914b")
          {
            state.vo2UUID = "";
            state.vo2Connected = 0;
          }
          if (serviceToDelete.uuid == "0000180d-0000-1000-8000-00805f9b34fb")
          {
            state.hrConnected = 0;
            console.log("HR Disconnected")
          }
          const serviceIndex = state.services.indexOf(serviceToDelete);
          state.services.splice(serviceIndex, 1);
        }
        // remove device
        state.devices.splice(storedDeviceIndex, 1)
      },
    addToDeviceList(state, devList) {
        console.log(Array.isArray(devList));
        for (let i = 0; i < devList.length; i++) {
          var found = state.deviceList.some(function(value) {
            console.log(value.deviceId);
            console.log(devList[i].deviceId);
            return value.deviceId === devList[i].deviceId;
          });
          if (found) {
            console.log("duplicate");
          } else {
            state.deviceList.push(devList[i]);
            console.log("pushing");
          }
        }
        /** 
        }
        for (let res in result){
          state.deviceList.push(res);
          state.devID.push(res);
          console.log("Device Pushed")
        }
        */
    
        //state.deviceList.push(devList);
        //console.log("Device Pushed")
      },
};
const actions = {
    resetDeviceList(state){
      state.commit("RESET_DEVLIST");
    },
    async removeDevice (state, query) {
      if (query.device.gatt.connected) {
        query.device.removeEventListener('gattserverdisconnected', query.device.GattDisconnectionCallback)
        query.device.removeEventListener('advertisementreceived', query.device.GattAdvertismentCallback)
        await query.device.gatt.disconnect();
        console.log("Disconnected Device");
      }
      //state.commit("RESET_DEVLIST")
      state.commit("BLE_DEVICE_REMOVED", query.device)
    },
    async addDevice(state, query){
        var requestParameters = {};

        // Was a device name set for the character
        if (query.name || query.namePrefix || query.anyDevices) {
        var filters = [];
        if (query.name) {
            filters.push({ name: query.name });
        }
        if (query.namePrefix) {
            filters.push({ namePrefix: query.namePrefix });
        }
        if (query.anyDevices) {
            requestParameters["acceptAllDevices"] = true;
        }
        if (filters.length > 0) requestParameters.filters = filters;
        requestParameters.optionalServices = query.services;
        } else {
        requestParameters.filters = [{ services: query.services }];
        }

        let device = await navigator.bluetooth.requestDevice(requestParameters).catch(error => { console.error(error); });
        if (device) {
        console.log(device.id.toString("hex"));
        console.log(device.gatt);
        console.log("found device");
        state.commit("BLE_DEVICE_ADDED", device);
        return device;
        }
    },
    async connectDevice({ dispatch, commit }, payload) {
        //console.log(dispatch);
        if (!payload.device.gatt.connected) {
          await payload.device.gatt.connect();

          //console.log()

          payload.device.GattDisconnectionCallback = event => {
            console.log(event);
            payload.device.removeEventListener(
              "gattserverdisconnected",
              payload.device.GattDisconnectionCallback
            );
            payload.device.removeEventListener(
              "advertisementreceived",
              payload.device.GattAdvertismentCallback
            );
            commit("BLE_DEVICE_DISCONNECTED", payload.device);
            commit("BLE_DEVICE_UPDATED", payload.device);
          };
          payload.device.addEventListener(
            "gattserverdisconnected",
            payload.device.GattDisconnectionCallback
          );
        }
        commit("BLE_DEVICE_UPDATED", payload.device);
      },
      async discoverServices({ dispatch, commit }, query) {
        console.log(query);
        if (query.uuid) {
          const service = await query.device.gatt.getPrimaryService(query.uuid);
          if (!service) return;
          console.log("primary service fired");
          dispatch("discoverCharacteristics", { service: service });
          commit("BLE_SERVICE_ADDED", service);
        } else {
          const services = await query.device.gatt.getPrimaryServices();
          for (const service of services) {
            console.log(service);
            if (service.uuid == "4fafc201-1fb5-459e-8fcc-c5c9c331914b"){
              commit("BLE_VO2_ADD", query.device.id)
            }
            if (service.uuid == "0000180d-0000-1000-8000-00805f9b34fb"){  
              //0000180d-0000-1000-8000-00805F9B34FB
              commit("BLE_HR_ADD", query.device.id)
            }
            dispatch("discoverCharacteristics", { service: service });
            commit("BLE_SERVICE_ADDED", service);
          }
        }
      },
      async discoverCharacteristics({ dispatch, commit }, query) {
        let discoveredCharacteristics = [];
        if (query.characteristics === undefined) {
          var characteristics = await query.service.getCharacteristics();
          for (var characteristic of characteristics) {
            await dispatch("configureCharacteristic", characteristic);
            discoveredCharacteristics.push(characteristic);
          }
        } else {
          for (let characteristicUUID of query.characteristics) {
            var characteristicN = await query.service.getCharacteristic(
              characteristicUUID
            );
            if (characteristicN) {
              await dispatch("configureCharacteristic", characteristicN);
              discoveredCharacteristics.push(characteristicN);
            }
          }
        }
        if (discoveredCharacteristics.length > 0)
          commit("BLE_CHARACTERISTICS_DISCOVERED", discoveredCharacteristics);
      },
      async configureCharacteristic(
        { dispatch, commit },
        characteristicToConfigure
      ) {
        // Add an event listener that is triggered when the peripheral writes
        // a new value to this characteristic.
        if (
          characteristicToConfigure.properties.read ||
          characteristicToConfigure.properties.notify ||
          characteristicToConfigure.properties.indicate
        ) {
          characteristicToConfigure.addEventListener(
            "characteristicvaluechanged",
            event => {
              let returnVar = [];
              for (let i = 0; i < event.target.value.byteLength; i++) {
                returnVar[i] = event.target.value.getUint8(i);
              }
              //console.log(event);
              //console.log(event.target.value);

              switch (event.target.uuid){
                  case "6e400003-b5a3-f393-e0a9-e50e24dcca9e":
                  //NRF TX service
                  console.log("NRF transfer");
                  break;

                  case "beb5483e-36e1-4688-b7f5-ea07361b26a8":
                  //VO2 Oxygen / CO2 / Flow characteristic
                  dispatch("addSensorData", returnVar);
                  break;

                  case "02738e9d-282b-4ba3-b951-46b14c37ab4b":
                  //Temp / Pressure /Humidity
                  dispatch("addTempData", returnVar);
                  break;

                  case "00002a37-0000-1000-8000-00805f9b34fb":
                  dispatch("addHeartRate", returnVar[1]);
                  //console.log(returnVar[1]);
                  break;

                  default:
                  console.log(event.target.uuid)
                  break;

              }
              if (event.target.uuid == "6e400003-b5a3-f393-e0a9-e50e24dcca9e")
              {
                //console.log("NRF");
              }
              else{
                //console.log("VO2");
    
              }
              //console.log(returnVar);
              //console.log("bob");
              //let x = Buffer.from([ returnVar[3], returnVar[2], returnVar[1], returnVar[0] ]).readFloatBE(0)

              dispatch("updateCharacteristic", characteristicToConfigure);
            }
          );
        }
        // If allowed to read the characteristic value, trigger an inital data read
        // subsquent reads will be managed through events
        if (characteristicToConfigure.properties.read) {
          await characteristicToConfigure.readValue();
          commit("BLE_CHARACTERISTIC_CHANGED", characteristicToConfigure);
        }
        // if allowed to subscribe to value change events, subscribe to the events
        // posted by the
        if (
          characteristicToConfigure.properties.notify ||
          characteristicToConfigure.properties.indicate
        ) {
          await characteristicToConfigure.startNotifications();
        }
      },
      async updateCharacteristic({ commit }, characteristic) {
        commit("BLE_CHARACTERISTIC_CHANGED", characteristic);
      }
};
const getters = {
        getDevices: state => {
            return state.deviceList;
          },
        getVO2Connected: state => {
          return state.vo2Connected;
        },
        currentDevices: state => {
          return state.devices;
        },
        getHRConnected: state => {
          return state.hrConnected;
        }
};

export default {
  state,
  mutations,
  actions,
  getters
};
