// /* eslint-disable jsx-a11y/anchor-is-valid */
// import React, { useCallback, useEffect, useMemo, useState, } from "react";
// import { Button, Card, Dropdown, Space, Switch, Table, Tag } from "antd";
// import { useNavigate, useParams } from "react-router-dom";

// import { IoArrowDownOutline, IoLockClosed, IoLockOpen, IoPerson, IoWalk, IoWalkOutline } from 'react-icons/io5';


// function filterValues(arr1, arr2) {
//     // Convert arr2 to a Set for faster lookup
//     const set2 = new Set(arr2);

//     // Filter values from arr1 that are not in arr2
//     const filteredArr = arr1.filter(value => !set2.has(value));

//     return filteredArr;
// }

// const SIGNAL_STRENGTH_THRESHOLD = 15; // Define a threshold for significant signal strength change


// class BLEDevice {
//     constructor(name, shortName, productNumber, macAddress, isConnected = false, signalStrength, lastSeen = Date.now()) {
//         this.name = name;
//         this.shortName = shortName;
//         this.productNumber = productNumber;
//         this.macAddress = macAddress;
//         this.isConnected = isConnected;
//         this.signalStrength = signalStrength;
//         this.lastSeen = lastSeen;
//     }

//     setConnect(value) {
//         this.isConnected = value;
//     }
// }

// const shouldDeviceBeUpdated = (olDevice, newDevice) => {

//     if (olDevice.name !== newDevice.name) return true;

//     if (olDevice.shortName !== newDevice.shortName) return true;

//     if (olDevice.isConnected !== newDevice.isConnected) return true;

//     if (Math.abs(olDevice.signalStrength, newDevice.signalStrength) > SIGNAL_STRENGTH_THRESHOLD) return true;

//     return false;

// }


// const doesDeviceExists = (macAddress, list) => {

//     return list.findIndex((d) => d.macAddress === macAddress);

// }

// const checkDeviceTimedOut = (lastSeen) => {

//     if (Math.abs(lastSeen - Date.now()) > 5000) return false;
//     return true;

// }


// export const ScanPageTable = () => {

//     const navigate = useNavigate();
//     const [scanData, setScanData] = useState([]);
//     const [listenMode, setListenMode] = useState(1);

//     const [bleDevices, setBleDevices] = useState([]);



//     /*
//     {
//     Name,
//     Shortname
//     Product number
//     Mac
//     Connected
//     Signal strength
//     Lux
//     Movement
//     LastSeen

//     }

//     */


//     const deleteBleDeviceFromList = (macAddress) => {

//         setBleDevices(prev => {
//             return prev.filter(d => d.macAddress !== macAddress);
//         })

//     }



//     const updateDevice = useCallback((bleDevice, index) => {

//         const isToBeUpdated = shouldDeviceBeUpdated(bleDevices[index], bleDevice);

//         if (isToBeUpdated) {
//             setBleDevices(prev => {
//                 prev[index] = bleDevice;
//                 return prev;
//             })
//         }

//     }, [bleDevices])


//     const addDevice = useCallback((name, shortName, productNumber, macAddress, isConnected, signalStrength) => {

//         // const doesBleDeviceExist;

//         const index = doesDeviceExists(macAddress, bleDevices);


//         const bleDevice = new BLEDevice(name, shortName, productNumber, macAddress, isConnected, signalStrength);


//         if (index !== -1) {

//             const oldDevice = bleDevices[index];

//             const isToBeUpdated = shouldDeviceBeUpdated(oldDevice, bleDevice);

//             if (!isToBeUpdated) return;

//             updateDevice(bleDevice, index);
//         }

//         setBleDevices((prev) => {
//             prev.push(bleDevice)
//             return prev;
//         })


//     }, [bleDevices, updateDevice])



//     const addData = useCallback((event) => {
//         const device = JSON.parse(event.data);


//         // Handle advertisement data

//         if (device.advertisementData) {


//             if (device.commonBleData.bleAddress === "10:B9:F7:0F:6D:25") {
//                 console.log(device.advertisementData)

//             }

//             setScanData((prevScanData) => {
//                 // Find the index of the device if it already exists in the scan data
//                 const index = prevScanData.findIndex((d) => d.macAddress === device.commonBleData.bleAddress);

//                 // If the device does not exist, return the previous scan data
//                 if (index === -1) return prevScanData;

//                 // Clone the previous scan data to avoid direct state mutation
//                 const updatedScanData = [...prevScanData];

//                 // Determine if the connection status or signal strength has changed significantly
//                 const isConnectedChanged = updatedScanData[index].isConnected !== (device.commonBleData.eventType === 2);

//                 // const signalStrengthChanged = Math.abs(updatedScanData[index].signalStrength - device.commonBleData.signalStrength) > SIGNAL_STRENGTH_THRESHOLD;

//                 updatedScanData[index].movement = device.advertisementData.tw === '08'

//                 if (device.advertisementData.mailFour !== '000000' && device.advertisementData.mailFour) {

//                     // updatedScanData[index].lux = Number(`0x${device.advertisementData.mailFour}`);
//                     updatedScanData[index].lux = Number('0x' + device.advertisementData.mailFour);

//                 }

//                 if (isConnectedChanged) {
//                     // Update the connection status and signal strength if they have changed
//                     updatedScanData[index].isConnected = device.commonBleData.eventType === 2;
//                     // updatedScanData[index].signalStrength = device.commonBleData.signalStrength;

//                     // Sort the updated scan data by signal strength and return
//                 }


//                 return updatedScanData;

//                 // If no significant changes, return the previous scan data
//                 // return prevScanData;
//             });
//         }

//         // Handle scan data
//         if (device.scanData) {
//             // Assign key and signal strength from commonBleData
//             device.scanData.key = device.scanData.macAddress;

//             device.scanData.signalStrength = device.commonBleData.signalStrength;

//             setScanData((prevScanData) => {

//                 // Find the index of the device if it already exists in the scan data
//                 const index = prevScanData.findIndex((d) => d.macAddress === device.scanData.macAddress);

//                 // Clone the previous scan data to avoid direct state mutation
//                 const updatedScanData = [...prevScanData];

//                 if (index !== -1) {
//                     // If the device exists, determine if the connection status or signal strength has changed significantly
//                     const oldIsConnected = updatedScanData[index]?.isConnected;

//                     const signalStrengthChanged = Math.abs(updatedScanData[index].signalStrength - device.scanData.signalStrength) > SIGNAL_STRENGTH_THRESHOLD;

//                     if (signalStrengthChanged) {
//                         // Update the device data and retain the old connection status
//                         updatedScanData[index] = { ...device.scanData, isConnected: oldIsConnected };

//                         // Sort the updated scan data by signal strength and return
//                         return updatedScanData;
//                     }
//                 } else {
//                     // If the device does not exist, add it to the list and sort by signal strength
//                     updatedScanData.push(device.scanData);
//                     return updatedScanData.sort((a, b) => b.signalStrength - a.signalStrength);
//                 }

//                 // If no significant changes, return the previous scan data
//                 return prevScanData;
//             });
//         }
//     }, []);

//     useEffect(() => {

//         const interval = setInterval(() => {

//             setScanData(prevData => {
//                 return prevData.sort((a, b) => b.signalStrength - a.signalStrength)
//             })

//         }, 5000)


//         return (() => {
//             clearInterval(interval);
//         })

//     }, [])

//     useEffect(() => {
//         const events = new EventSource(`http://localhost:8888/api/v1/next-gen/scan/?listenMode=${listenMode}`);

//         events.addEventListener('message', addData);

//         events.onerror = () => {
//             events.removeEventListener('message', addData);
//             events.close();
//         };

//         return () => {
//             events.removeEventListener('message', addData);
//             events.close();
//             console.log("CLOSING DOWN - EVENT SOURCE CLOSED FROM CLIENT");
//         };
//     }, [addData, listenMode]);

//     const connectOne = useCallback((macAddress) => {

//         fetch(' http://localhost:8888/api/v1/next-gen/login', {
//             method: 'POST',
//             body: JSON.stringify({ macAddress }),
//             headers: {
//                 'Content-type': 'application/json',
//             }
//         })
//             .then(res => res.json())
//             .then(data => console.log(data));
//     }, [])

//     const delay = (delayInms) => {
//         return new Promise(resolve => setTimeout(resolve, delayInms));
//     };

//     const connectMany = useCallback(async (macAddresses) => {

//         for (let i = 0; i < macAddresses.length;) {
//             connectOne(macAddresses[i]);
//             let delayres = await delay(5000);
//             i++;
//         }


//     }, [connectOne])

//     const disconnectOne = useCallback((macAddress) => {
//         fetch('http://localhost:8888/api/v1/next-gen/disconnect', {
//             method: 'POST',
//             body: JSON.stringify({ macAddress }),
//             headers: {
//                 'Content-type': 'application/json'
//             }
//         })
//             .then(res => res.json())
//             .then(data => console.log(data))
//     }, [])

//     const connect = (macAddresses) => {

//         if (macAddresses.length === 1) {

//             return connectOne(macAddresses[0]);

//         }

//         return connectMany(macAddresses);

//     }

//     function disconnectMany(macAddresses) {

//         fetch('http://localhost:8888/disconnect-mobile/multiple', {
//             method: 'POST',
//             body: JSON.stringify({ macAddresses }),
//             headers: {
//                 'Content-type': 'application/json',
//             }
//         })
//     }

//     const disconnect = (macAddresses) => {

//         if (macAddresses.length === 1) {
//             return disconnectOne(macAddresses[0])
//         }

//         return disconnectMany(macAddresses)

//     }

//     const navigateToSettings = (mac, name) => {
//         navigate(`/detector/${mac}/${name}`)
//     }

//     const navigateToMonitor = (mac, name) => {
//         navigate(`/detector/monitor/${mac}/${name}`)
//     }


//     const onClick = ({ item, key, keyPath, domEvent }) => {
//         const splittedKey = key.split('-');
//         const version = key.split('-')[0];
//         const macAddress = key.split('-')[1];

//         fetch(' http://localhost:8888/api/v1/next-gen/upgrade', {
//             method: 'POST',
//             body: JSON.stringify({ macAddress, version }),
//             headers: {
//                 'Content-type': 'application/json',
//             }
//         })
//             .then(res => res.json())
//             .then(data => console.log(data));

//     };


//     const columns = [

//         {
//             dataIndex: 'lockedInfo',
//             key: 'lockedInfo',
//             render: (_, record) => {
//                 if (record.lockedInfo === '02') {
//                     return <IoLockOpen size={20} color="#00ad65" />
//                 }
//                 return <IoLockClosed size={20} color="#ad1400" />
//             }
//         },
//         {
//             title: 'Name',
//             dataIndex: 'name',
//             key: 'name',
//         },
//         {
//             title: 'Short name',
//             dataIndex: 'shortname',
//             key: 'shortname',
//         },
//         {
//             title: 'Product number',
//             dataIndex: 'productNumber',
//             key: 'productNumber',
//         },
//         {
//             title: 'Mac',
//             dataIndex: 'macAddress',
//             key: 'macAddress',
//         },

//         {
//             title: 'Connected',
//             dataIndex: 'isConnected',
//             key: 'isConnected',
//             render: (_, record) => {
//                 if (record.isConnected) {
//                     return <Tag color="#03c9a9">Connected</Tag>
//                 }

//                 return <Tag color="#f64747">Not connected</Tag>;
//             }
//         },

//         {
//             title: 'Signal strength',
//             dataIndex: 'signalStrength',
//             key: 'signalStrength',
//         },


//         {
//             title: 'Lux',
//             dataIndex: 'lux',
//             key: 'lux',
//             // render: (_, record) => {
//             //     const luxValue = record.lux
//             // }
//         },

//         {
//             title: 'Movement',
//             dataIndex: 'movement',
//             key: 'movement',
//             render: (_, record) => {

//                 // console.log(record)
//                 if (record.movement) {
//                     return (<IoWalkOutline color="green" size={25} />)

//                 }
//                 return (<IoWalkOutline color="red" />)
//             }
//         },


//         {
//             title: 'Action',
//             key: 'action',
//             render: (_, record) => {

//                 if (record) {

//                     let items = record.firmwaresAvailable;;



//                     return (

//                         <Space size="middle">
//                             <a onClick={() => navigateToSettings(record.macAddress, record.productNumber)}>Settings</a>
//                             <a onClick={() => navigateToMonitor(record.macAddress, record.productNumber)}>Monitor</a>
//                             <a onClick={() => disconnectOne(record.macAddress)}>Disconnect</a>

//                             <Dropdown menu={{ items, onClick }}>

//                                 <a> Upgrade </a>

//                             </Dropdown>

//                         </Space>)


//                 }

//             }
//         },


//     ];

//     const [selectedRowKeys, setSelectedRowKeys] = useState([]);

//     const onSelectChange = (newSelectedRowKeys) => {
//         setSelectedRowKeys(newSelectedRowKeys);
//     };

//     const rowSelection = {
//         selectedRowKeys,
//         onChange: onSelectChange,
//     };

//     const hasSelected = selectedRowKeys.length > 0;

//     return (

//         <div style={{ display: 'flex', flexDirection: 'column', rowGap: '20px', height: '100%' }}>
//             <h3 style={{ padding: 0, margin: 0 }}>Connect to a detector</h3>
//             <p style={{ padding: 0, margin: 0, fontSize: '14px' }}>Select the detector you want to connect to</p>

//             <div>
//                 <div
//                     style={{
//                         marginBottom: 16,
//                         display: 'flex',
//                         alignItems: 'center',
//                         columnGap: '20px',
//                     }}
//                 >
//                     <Button type="primary" onClick={() => connect(selectedRowKeys)} disabled={!hasSelected} >
//                         Connect
//                     </Button>

//                     <Button type="primary" onClick={() => disconnect(selectedRowKeys)} disabled={!hasSelected}>
//                         Disconnect
//                     </Button>
//                     <span
//                         style={{
//                             marginLeft: 8,
//                         }}
//                     >
//                         {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}

//                     </span>

//                     <div style={{ alignItems: 'end', width: '100%', justifyItems: 'end', display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
//                         <div style={{ alignSelf: 'end', justifyContent: 'end' }}>
//                             <p>Scan mode</p>
//                             <Switch checked={listenMode} onChange={() => setListenMode((prevValue) => prevValue ? 0 : 1)}>
//                             </Switch>
//                         </div>
//                     </div>
//                 </div>
//                 <Table rowSelection={rowSelection} columns={columns} pagination={true} dataSource={scanData} />
//             </div>
//         </div>
//     );
// };


//###############################################################

/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useMemo, useState, } from "react";
import { Button, Card, Dropdown, Space, Switch, Table, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import { IoArrowDownOutline, IoLockClosed, IoLockOpen, IoPerson, IoWalk, IoWalkOutline } from 'react-icons/io5';
import { DisabledAnchor } from "./styled";


const connectionStates = {
    BUSY: "Busy",
    CONNECTED: "Connected",
    TIMEOUT: "Timed Out",
    DISCONNECTED: "Not Connected",
    HOST_DISCONNECTED: "Host disconnected",
}

function filterValues(arr1, arr2) {
    // Convert arr2 to a Set for faster lookup
    const set2 = new Set(arr2);

    // Filter values from arr1 that are not in arr2
    const filteredArr = arr1.filter(value => !set2.has(value));

    return filteredArr;
}

const SIGNAL_STRENGTH_THRESHOLD = 30; // Define a threshold for significant signal strength change


class BLEDevice {
    constructor(name, shortName, productNumber, macAddress, isConnected = false, signalStrength, lastSeen = Date.now()) {
        this.key = macAddress;
        this.name = name;
        this.shortName = shortName;
        this.productNumber = productNumber;
        this.macAddress = macAddress;
        this.isConnected = isConnected;
        this.signalStrength = signalStrength;
        this.lastSeen = lastSeen;

        this.states = [
            { id: 1, text: 'Not connected', isActive: true, color: "#ff5c5c" },
            { id: 2, text: 'OFF grid', isActive: false, color: "#ff975b", counter: 0 },
            { id: 3, text: 'Connected', isActive: false, color: "#51ffbc" }
        ];

        this.connectionState = connectionStates.DISCONNECTED;


        this.timeOutCounter = 0;


    }

    setConnect(value) {
        this.isConnected = value;
    }
}

const shouldDeviceBeUpdated = (olDevice, newDevice) => {


    if (olDevice.name !== newDevice.name) return true;

    if (olDevice.shortName !== newDevice.shortName) return true;

    if (olDevice.isConnected !== newDevice.isConnected) return true;

    if (Math.abs(Date.now() - olDevice.lastSeen) > 3000) return true;

    // if (Math.abs(olDevice.signalStrength - newDevice.signalStrength) > SIGNAL_STRENGTH_THRESHOLD) return true;

    return false;

}


const doesDeviceExist = (macAddress, list) => {

    return list.findIndex((d) => d.macAddress === macAddress);
}

const checkDeviceTimedOut = (lastSeen) => {

    if (Math.abs(lastSeen - Date.now()) > 5000) return false;

    return true;

}

const updateDevice = (bleDevice, index, list) => {

    const updatedDevices = [...list];

    let oldDevice = updatedDevices[index];

    const newDeviceData = { ...oldDevice };

    newDeviceData.lastSeen = Date.now();

    if (Math.abs(oldDevice.signalStrength - bleDevice.signalStrength) > 25) {
        newDeviceData.signalStrength = bleDevice.signalStrength;

    }

    updatedDevices[index] = newDeviceData;

    return updatedDevices;

}

const addNewBleDevice = (name, shortName, productNumber, macAddress, isConnected, signalStrength, list) => {

    const bleDevice = new BLEDevice(
        name,
        shortName,
        productNumber,
        macAddress,
        isConnected,
        signalStrength,
        Date.now()
    );

    const index = doesDeviceExist(macAddress, list);

    if (index === -1) return [...list, bleDevice];

    const updatedList = updateDevice(bleDevice, index, list);

    return [...updatedList];

};


export const ScanPageTable = () => {

    const navigate = useNavigate();

    const [listenMode, setListenMode] = useState(1);

    const [bleDevices, setBleDevices] = useState([]);

    const [scanData, setScanData] = useState([]);

    const [connectedDevices, setConnectedDevice] = useState([]);



    const getConnectionList = useCallback(async () => {

        const connectionList = await fetch(`http://localhost:8888/api/v1/next-gen/connection-list`);

        const {data} = await connectionList.json();

        console.log(data.nodes);

        if(data.nodes.length > 0)
            {
                setConnectedDevice(data.nodes)
            } 

    }, [])


    useEffect(() => {
        getConnectionList();

    }, [])


    useEffect(() => {

        const interval = setInterval(() => {

            setBleDevices(prevData => {

                let newData = prevData.map((d, i) => {

                    if ((Math.abs(Date.now() - d.lastSeen) > 6000)) {

                        if (d.states[1].isActive === true) {

                            d.states[1].counter = d.states[1].counter - 1;

                            return d;
                        }

                        d.states[1].isActive = true;

                        d.states[0].isActive = false;

                        d.states[2].isActive = false;

                        d.states[1].counter = 30;

                        return d;
                    }

                    d.states[1].isActive = false;

                    d.states[1].counter = 0;

                    d.states[0].isActive = true;

                    d.states[2].isActive = false;

                    return d;
                })

                return [...newData].filter(d => d.states[1].counter !== 1).sort((a, b) => b.signalStrength - a.signalStrength);

            })

        }, 1000)


        return (() => {
            clearInterval(interval);
        })

    }, [])

    const addData = useCallback((event) => {

        const device = JSON.parse(event.data);

        if (device.advertisementData) {


            if (device.commonBleData.bleAddress === "10:B9:F7:10:61:A5") {
                console.log(device)
            }


            setBleDevices((prevBleDeviceData) => {

                const index = prevBleDeviceData.findIndex((d) => d.macAddress === device.commonBleData.bleAddress);

                if (index === -1) return prevBleDeviceData;

                const updatedBleDeviceData = [...prevBleDeviceData];

                const currentDevice = updatedBleDeviceData[index];

                const isConnected = device.commonBleData.eventType === 2;

                if (device.commonBleData.eventType === 2) currentDevice.connectionState = connectionStates.CONNECTED;

                const isBusy = isConnected && !connectedDevices.find(d => d.macAddress === currentDevice.macAddress);

                if (!isConnected) currentDevice.connectionState = connectionStates.DISCONNECTED;

                if (isBusy) currentDevice.connectionState = connectionStates.BUSY;

                updateDevice[index] = currentDevice;

                return updatedBleDeviceData;


            });
        }


        if (device.scanData) {

            if (!device.scanData.macAddress) return;

            // console.log(device.scanData.macAddress)

            setBleDevices((previousBleDevices) => {

                return addNewBleDevice(
                    device.scanData.name,
                    device.scanData.shortname,
                    device.scanData.productNumber,
                    device.scanData.macAddress,
                    false,
                    device.commonBleData.signalStrength,
                    previousBleDevices
                )
            }, []);
        }

    }, [connectedDevices]);


    const handleConnectionData = useCallback((event) => {

        const data = JSON.parse(event.data);

        return setConnectedDevice(prev => {

            const exists = doesDeviceExist(data.handle, prev);

            if (exists === -1) {

                if (data.connectionState === "connected") {

                    setBleDevices((prevBlEDevices) => {

                        const exists = doesDeviceExist(data.handle, prevBlEDevices);

                        if (exists === -1) return prevBlEDevices;

                        prevBlEDevices[exists].isConnected = true;
                    })
                }

                return [...prev, { ...data, macAddress: data.handle }];
            }

            data.macAddress = data.handle;
            prev[exists] = data;

            return [...prev];
        });

    }, []);


    useEffect(() => {
        console.log(connectedDevices, '***');
    }, [connectedDevices])


    useEffect(() => {

        const events = new EventSource(`http://localhost:8888/api/v1/next-gen/scan/?listenMode=${listenMode}`);

        events.addEventListener('message', addData);

        events.onerror = () => {
            events.removeEventListener('message', addData);
            events.close();
        };

        return () => {

            events.removeEventListener('message', addData);
            events.close();
            console.log("CLOSING DOWN AD AND SCAN STREAM");

        };
    }, [addData, handleConnectionData, listenMode]);


    useEffect(() => {


        const connectionEvents = new EventSource(`http://localhost:8888/api/v1/next-gen/sse/connection-status`);

        connectionEvents.addEventListener('message', handleConnectionData);

        connectionEvents.onerror = () => {
            connectionEvents.removeEventListener('message', handleConnectionData);
            connectionEvents.close();
        };


        return () => {
            connectionEvents.removeEventListener('message', handleConnectionData);
            connectionEvents.close();
            console.log("CLOSING DOWN CONNECTION SSE ");
        };


    }, [handleConnectionData])


    const connectOne = useCallback((macAddress) => {

        fetch(' http://localhost:8888/api/v1/next-gen/login', {
            method: 'POST',
            body: JSON.stringify({ macAddress }),
            headers: {
                'Content-type': 'application/json',
            }
        })
            .then(res => res.json())
    }, [])

    const delay = (delayInms) => {
        return new Promise(resolve => setTimeout(resolve, delayInms));
    };

    const connectMany = useCallback(async (macAddresses) => {

        for (let i = 0; i < macAddresses.length;) {
            connectOne(macAddresses[i]);
            let delayres = await delay(5000);
            i++;
        }


    }, [connectOne])

    const disconnectOne = useCallback((macAddress) => {
        fetch('http://localhost:8888/api/v1/next-gen/disconnect', {
            method: 'POST',
            body: JSON.stringify({ macAddress }),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => console.log(data))
    }, [])

    const connect = (macAddresses) => {

        if (macAddresses.length === 1) {

            return connectOne(macAddresses[0]);

        }

        return connectMany(macAddresses);

    }

    function disconnectMany(macAddresses) {

        fetch('http://localhost:8888/disconnect-mobile/multiple', {
            method: 'POST',
            body: JSON.stringify({ macAddresses }),
            headers: {
                'Content-type': 'application/json',
            }
        })
    }

    const disconnect = (macAddresses) => {

        if (macAddresses.length === 1) {
            return disconnectOne(macAddresses[0])
        }

        return disconnectMany(macAddresses)

    }

    const navigateToSettings = (mac, name) => {
        navigate(`/detector/${mac}/${name}`)
    }

    const navigateToMonitor = (mac, name) => {
        navigate(`/detector/monitor/${mac}/${name}`)
    }


    const onClick = ({ item, key, keyPath, domEvent }) => {
        const splittedKey = key.split('-');
        const version = key.split('-')[0];
        const macAddress = key.split('-')[1];

        fetch(' http://localhost:8888/api/v1/next-gen/upgrade', {
            method: 'POST',
            body: JSON.stringify({ macAddress, version }),
            headers: {
                'Content-type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => console.log(data));

    };


    const columns = [

        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: 'Short name',
            dataIndex: 'shortName',
            key: 'shortName',
        },

        {
            title: 'Product number',
            dataIndex: 'productNumber',
            key: 'productNumber',
        },

        {
            title: 'Mac',
            dataIndex: 'macAddress',
            key: 'macAddress',
        },

        {
            title: 'Connected',
            dataIndex: 'states',
            key: 'states',

            render: (_, record) => {



                return (
                    <>
                        {record.connectionState === connectionStates.CONNECTED && <Tag color="#03c9a9">Connected</Tag>}
                        {record.connectionState === connectionStates.DISCONNECTED && <Tag color="#f64747">Not connected</Tag>}
                        {record.connectionState === connectionStates.BUSY && <Tag color="#474af6">{connectionStates.BUSY}</Tag>}

                    </>

                )
            }
        },

        {
            title: 'Signal strength',
            dataIndex: 'signalStrength',
            key: 'signalStrength',
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {

                if (record) {


                    let items = record.firmwaresAvailable;;



                    return (

                        record.connectionState === connectionStates.BUSY ?
                            (<Space size="middle">
                                <DisabledAnchor>Settings</DisabledAnchor>
                                <DisabledAnchor >Monitor</DisabledAnchor>
                                <DisabledAnchor>Disconnect</DisabledAnchor>
                            </Space>

                            )
                            : (
                                <Space size="middle">
                                    <a onClick={() => navigateToSettings(record.macAddress, record.productNumber)}>Settings</a>
                                    <a onClick={() => navigateToMonitor(record.macAddress, record.productNumber)}>Monitor</a>
                                    <a onClick={() => disconnectOne(record.macAddress)}>Disconnect</a>

                                    <Dropdown menu={{ items, onClick }}>

                                        <a> Upgrade </a>

                                    </Dropdown>


                                </Space>
                            )

                    )
                }

            }
        },


    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = (newSelectedRowKeys) => {

        setSelectedRowKeys(newSelectedRowKeys);

    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,

        getCheckboxProps: (record) => ({
            disabled: record.connectionState === connectionStates.BUSY, // Column configuration not to be checked
        }),
    };

    const hasSelected = selectedRowKeys.length > 0;


    return (

        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '20px', height: '100%' }}>
            <h3 style={{ padding: 0, margin: 0 }}>Connect to a detector</h3>
            <p style={{ padding: 0, margin: 0, fontSize: '14px' }}>Select the detector you want to connect to</p>

            <div>
                <div
                    style={{
                        marginBottom: 16,
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: '20px',
                    }}
                >
                    <Button type="primary" onClick={() => connect(selectedRowKeys)} disabled={!hasSelected} >
                        Connect
                    </Button>

                    <Button type="primary" onClick={() => disconnect(selectedRowKeys)} disabled={!hasSelected}>
                        Disconnect
                    </Button>
                    <span
                        style={{
                            marginLeft: 8,
                        }}
                    >
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}

                    </span>

                    <div style={{ alignItems: 'end', width: '100%', justifyItems: 'end', display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
                        <div style={{ alignSelf: 'end', justifyContent: 'end' }}>
                            <p>Scan mode</p>
                            <Switch checked={listenMode} onChange={() => setListenMode((prevValue) => prevValue ? 0 : 1)}>
                            </Switch>
                        </div>
                    </div>
                </div>

                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    pagination={true}
                    dataSource={bleDevices}
                />

            </div>
        </div>
    );



}





// const isDeviceTimedOut = checkDeviceTimedOut(oldDevice.lastSeen);

// if (isDeviceTimedOut) {

//     deleteBleDeviceFromList(bleDevice.macAddress);

// }