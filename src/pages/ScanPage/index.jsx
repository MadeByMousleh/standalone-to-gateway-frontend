import React, { useCallback, useEffect, useMemo, useState, } from "react";
import DataTable from "../../components/DataTable";
import BLEService from "../../services/bleService";
import { IoCheckmarkCircleSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

function hex2a(hexx) {
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
class BleDevice {
  constructor(
    name,
    bleAddress,
    bleAddressType,
    signalStrength,
    eventType,
    chipId,
    data,
    connected,
    productNumber
  ) {
    this.name = name;
    this.bleAddress = bleAddress;
    this.bleAddressType = bleAddressType;
    this.signalStrength = signalStrength;
    this.eventType = eventType;
    this.chipId = chipId;
    this.data = data;
    this.connected = connected;
    this.productNumber = productNumber;
    this.lastSeenAt = new Date();
  }

  #sensorSeries = {
    0: "Not yet in use",
    1: "Mini",
    2: "Outdoor",
    3: "Not yet in use",
    4: "Not yet in use",
    5: "Not yet in use",
    6: "MR",
    7: "LR",
    8: "HC",
    9: "Accessories"
  };

  #technology = {
    0: "230V",
    1: "NHC",
    2: "24 V",
    3: "KNX",
    4: "Not yet in use",
    5: "DALI",
    6: "DALI wireless",
    7: "On/Off wireless",
    8: "Not yet in use",
    9: "No value"
  };

  #mounting = {
    0: "Ceiling, flush box",
    1: "ceiling, flush",
    2: "ceiling, surface",
    3: "Wall",
    4: "Wall flush",
    5: "Not yet in use",
    6: "Not yet in use",
    7: "Not yet in use",
    8: "Not yet in use",
    9: "No value"
  };

  #output = {
    0: "Slave",
    1: "1 ch",
    2: "2 ch",
    3: "47",
    4: "48",
    5: "Not yet in use",
    6: "Not yet in use",
    7: "Not yet in use",
    8: "Not yet in use",
    9: "No value"
  };

  #detection = {
    0: "No value",
    1: "M",
    2: "P",
    3: "True presence",
    4: "Not yet in use",
    5: "Not yet in use",
    6: "Not yet in use",
    7: "Not yet in use",
    8: "No value",
    9: "No value"
  };


  #variant = {
    0: "Wago 1 cable",
    1: "White",
    2: "Black",
    3: "Silver",
    4: "Wago 2 cables",
    5: "Wieland 1 cable",
    6: "Wieland 2 cables",
    7: "Not yet in use",
    8: "Remote control",
    9: "No value"
  };



  isTimedOut = () => { };

  #getOutput = (technology, output) => {
    if (output !== 'Slave') return output;
    return technology !== "230V" ? '46' : "41";
  }

  getProductFromNumber = (productNr) => {

    if (productNr) {
      console.log(productNr);

      const number = productNr.split("-");

      if (number[0] !== '353') return productNr;
      const usableNumber = number[1] || '';
      const usableNumberArr = usableNumber.split("");
      const correctOutput = this.#getOutput(this.#technology[usableNumberArr[1]], this.#output[usableNumberArr[3]])

      const translated = `
      ${this.#detection[usableNumberArr[4]]}${correctOutput} (${this.#sensorSeries[usableNumberArr[0]]}), ${this.#technology[usableNumberArr[1]]} 
      `;
      // ${this.#mounting[usableNumberArr[2]]} 
      // ${this.#variant[usableNumberArr[5]]}

      return translated;
    }
    return "Unknown"
  }

  getPlainProductNumber = () => {
    let arr = this.data?.split("")
    arr.splice(0, 20)
    arr.splice(20, arr.length - 1);
    arr = arr.join("");
    return hex2a(arr);

  }
}

class ConnectionResponse {

  constructor(dataType, deviceMac, connectionState, reason, gatewayMac, chipId) {
    this.dataType = dataType;
    this.deviceMac = deviceMac;
    this.connectionState = connectionState;
    this.reason = reason;
    this.gatewayMac = gatewayMac;
    this.chipId = chipId;
    this.time = Date.now();
  }
}

const columns = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "id", headerName: "Bluetooth address", flex: 1 },
  { field: "rssi", headerName: "Signal Strength", flex: 1 },
  { field: "connected", headerName: "Connected", flex: 1, isIcon: true },
];

const ScanPage = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = React.useState([]);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [devicesToUpgrade, setDevicesToUpgrade] = useState([]);

  const navigate = useNavigate();


  const service = useMemo(() => new BLEService("CC:1B:E0:E2:E4:A4"), []);

  const isDeviceTimedOut = (device, seconds = 40) => {
    const lastSeenInSeconds = (new Date() - device.lastSeenAt) / 1000;
    return lastSeenInSeconds > seconds;
  };


  const refreshData = useCallback((data, bleDevices) => {
    let copy = [...bleDevices];

    const exists = copy.find((d) => d.bleAddress === data.bleAddress);

    copy.forEach((device, i) => {

      // if (isDeviceTimedOut(device)) {
      //   copy.splice(i, 1);

      // } 

      // else 

      if (data.bleAddress === device.bleAddress) {

        const difference = Math.abs(data.bleAddress, device.bleAddress);


        copy[i] = data;

      }

    });

    if (!exists) {
      copy.push(data);
      copy = copy.sort((a, b) => b.signalStrength - a.signalStrength);
    }

    return copy;
  }, []);



  const getRealtimeData = useCallback(
    (data) => {

      let newDevice = new BleDevice(
        data.name,
        data.bdaddrs[0].bdaddr,
        data.bdaddrs[0].bdaddrType,
        data.rssi,
        data.evtType,
        data.chipId,
        data.scanData ?? null,
        connectedDevices.some(x => x.id === data.bdaddrs[0].bdaddr),
      );


      let productNumberArr = newDevice.data?.split("");
      if (productNumberArr) {
        productNumberArr.splice(0, 20)

        productNumberArr.splice(20, productNumberArr.length - 1);
        productNumberArr = productNumberArr.join("");
        newDevice.productNumber = newDevice.getProductFromNumber(hex2a(productNumberArr));
      }

      setDevices((devices) => refreshData(newDevice, devices));
    },
    [connectedDevices, refreshData]
  );


  useEffect(() => {
    const eventSource = service.scanForBLEdevices();

    eventSource.addEventListener('message', (e) => getRealtimeData(JSON.parse(e.data)))

    eventSource.onerror = (e) => {
      service.authorize();
      eventSource.removeEventListener("message", getRealtimeData);
      eventSource.close();
    };

    return () => {
      eventSource.removeEventListener("message", getRealtimeData);
      eventSource.close();
    };
  }, [getRealtimeData, service]);


  useEffect(() => {
    service.getConnectionList().then(res => Array.isArray(res.nodes) && setConnectedDevices(res.nodes))
  }, [service])


  const doesMacExists = (mac) => {

    const exists = devicesToUpgrade.find(x => x.mac === mac);

    if (exists) return true;
    return false;
  }


  const setAllProgress = useCallback((e) => {

    const devices = [...devicesToUpgrade];
    const progressObj = JSON.parse(e.data);

    // devices.forEach((x, index) => {

    //   console.log(x);

    //   if(x.mac === progressObj.mac)
    //   {
    //     devices[index] = progressObj;
    //     setDevicesToUpgrade(devices);
    //   }else{


    //     devices.push(progressObj);
    //     setDevicesToUpgrade(devices);
    //   }
    // })

    let index = -1;
    devices.forEach((x, curIndex) => {
      if (x.mac === progressObj.mac) {
        index = curIndex;
      }
    })

    if (index !== -1) {
      devices[index] = progressObj;
    } else {
      devices.push(progressObj);
    }
    setDevicesToUpgrade(devices);

  }, [devicesToUpgrade]);


  useEffect(() => {

    // const eventSource = service.listenForProgress();

    // eventSource.onmessage = (e) => setAllProgress(e);

    // return () => {
    //   eventSource.removeEventListener("message", setAllProgress);
    //   eventSource.close();
    // };



  }, [service, setAllProgress]);


  const rows = useMemo(() => {
    const allDevices = [...devices];

    return allDevices.map((device) => {

      return {
        name: device.productNumber,
        id: device.bleAddress,
        rssi: device.signalStrength,
        connected: device.connected ? "🟢" : "🔴",
      };
    });
  }, [devices]);

  const connect = () => {

    const devices = [...connectedDevices];

    if (selectedDevices.length === 1) {
      service.connectToBleDevice(selectedDevices[0])
        .then(res => {
          devices.push({ id: res })
          console.log(res, 'mac');

        })

    }

    else {

      service.connectToManyBleDevices(selectedDevices);

      selectedDevices.forEach(mac => {
        devices.push({ id: mac })
      })
    }

    setConnectedDevices(devices);
  };


  const disconnect = () => {

    if (selectedDevices.length === 1) {

      console.log(selectedDevices);

      service.disconnectFromDetector(selectedDevices[0]);

      const devices = [...connectedDevices];
      const filtered = devices.filter(x => x.id !== selectedDevices[0]);
      setConnectedDevices(filtered);

    } else {
      service.disconnectFromManyDetectors(selectedDevices);
      let devices = [...connectedDevices];
      const newArr = [];

      devices.forEach(x => {
        devices = devices.filter(dev => dev.id !== x.id);
      })


      setConnectedDevices(devices);
    }
  };


  const updateFirmware = () => {

    if (selectedDevices.length > 0) {
      selectedDevices.forEach(device => {
        service.updateFirmware(device);
      })

    }

    else {
      service.updateFirmware(selectedDevices[0]);
    }

  }

  const jumpToBoot = () => {

    if (selectedDevices.length > 0) {
      selectedDevices.forEach(device => {
        service.jumpToBoot(device);
      })

    }

    else {
      service.jumpToBoot(selectedDevices[0]);
    }

  }

  const viewMore = () => {
    navigate(`/detector/${selectedDevices[0]}/${devices.find(device => device.bleAddress === selectedDevices[0]).getPlainProductNumber()}`)
  }


  return (
    <div style={{ padding: 200 }}>


      <div>
        {devicesToUpgrade.map((device) => (

          <div style={{ display: 'flex', alignItems: 'column', columnGap: '50px' }}>
            <p>Mac: {device.mac}</p>
            <p>Progress: {device.progress} %</p>
          </div>

        ))}
      </div>

      <DataTable
        onSelected={(v) => setSelectedDevices(v)}
        rows={rows}
        columns={columns}
      />
      {selectedDevices.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px', columnGap: '20px' }}>

          <button onClick={() => connect()}>
            Connect
          </button>

          <button onClick={() => disconnect()}>
            Disconnect
          </button>

          <button onClick={() => jumpToBoot()}>Jump to boot</button>

          <button onClick={() => updateFirmware()}>Upgrade</button>

          <button onClick={() => viewMore()}>View more info</button>

        </div>
      )}
    </div>
  );
};

export default ScanPage;
