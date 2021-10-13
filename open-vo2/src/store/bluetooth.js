//var NUS_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
//var NUS_TX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
//var NUS_RX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

//Modified from https://github.com/MonsieurDahlstrom/web-bluetooth-vuex

const state = {
    devices: [],
    devID: [],
    services: [],
    characteristics: [],
    deviceList: []
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
          console.log(characteristic);
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
          const serviceIndex = state.services.indexOf(serviceToDelete);
          state.services.splice(serviceIndex, 1);
        }
        const storedDeviceIndex = state.devices.indexOf(device);
        state.devices[storedDeviceIndex] = device;
        //Vue.set(state.devices, storedDeviceIndex, device);
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

        let device = await navigator.bluetooth.requestDevice(requestParameters);
        if (device) {
        console.log(device.id.toString("hex"));
        console.log(device.gatt);
        console.log("found device");
        state.commit("BLE_DEVICE_ADDED", device);
        return device;
        }
    },
    async connectDevice({ dispatch, commit }, payload) {
        console.log(dispatch);
        if (!payload.device.gatt.connected) {
          await payload.device.gatt.connect();
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
        if (query.uuid) {
          const service = await query.device.gatt.getPrimaryService(query.uuid);
          if (!service) return;
          dispatch("discoverCharacteristics", { service: service });
          commit("BLE_SERVICE_ADDED", service);
        } else {
          const services = await query.device.gatt.getPrimaryServices();
          for (const service of services) {
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

              dispatch("addSensorData", returnVar);
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
};

export default {
  state,
  mutations,
  actions,
  getters
};
