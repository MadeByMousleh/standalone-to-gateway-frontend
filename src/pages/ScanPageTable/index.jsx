/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState, } from "react";
import { Button, Card, Space, Switch, Table, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import { IoLockClosed, IoLockOpen } from 'react-icons/io5';

function filterValues(arr1, arr2) {
    // Convert arr2 to a Set for faster lookup
    const set2 = new Set(arr2);

    // Filter values from arr1 that are not in arr2
    const filteredArr = arr1.filter(value => !set2.has(value));

    return filteredArr;
}


export const ScanPageTable = () => {
    const navigate = useNavigate();

    const [scanData, setScanData] = useState([]);

    const [listenMode, setListenMode] = useState(1);


    const addData = useCallback((event) => {
        const device = JSON.parse(event.data);

        const SIGNAL_STRENGTH_THRESHOLD = 15; // Define a threshold for significant signal strength change

        // Handle advertisement data

        if (device.advertisementData) {

            setScanData((prevScanData) => {
                // Find the index of the device if it already exists in the scan data
                const index = prevScanData.findIndex((d) => d.macAddress === device.commonBleData.bleAddress);

                // If the device does not exist, return the previous scan data
                if (index === -1) return prevScanData;

                // Clone the previous scan data to avoid direct state mutation
                const updatedScanData = [...prevScanData];

                // Determine if the connection status or signal strength has changed significantly
                const isConnectedChanged = updatedScanData[index].isConnected !== (device.commonBleData.eventType === 2);

                // const signalStrengthChanged = Math.abs(updatedScanData[index].signalStrength - device.commonBleData.signalStrength) > SIGNAL_STRENGTH_THRESHOLD;


                if (isConnectedChanged) {
                    // Update the connection status and signal strength if they have changed
                    updatedScanData[index].isConnected = device.commonBleData.eventType === 2;
                    // updatedScanData[index].signalStrength = device.commonBleData.signalStrength;

                    // Sort the updated scan data by signal strength and return
                    return updatedScanData;
                }

                // If no significant changes, return the previous scan data
                return prevScanData;
            });
        }

        // Handle scan data
        if (device.scanData) {
            // Assign key and signal strength from commonBleData
            device.scanData.key = device.scanData.macAddress;

            device.scanData.signalStrength = device.commonBleData.signalStrength;

            setScanData((prevScanData) => {

                // Find the index of the device if it already exists in the scan data
                const index = prevScanData.findIndex((d) => d.macAddress === device.scanData.macAddress);

                // Clone the previous scan data to avoid direct state mutation
                const updatedScanData = [...prevScanData];

                if (index !== -1) {
                    // If the device exists, determine if the connection status or signal strength has changed significantly
                    const oldIsConnected = updatedScanData[index]?.isConnected;

                    const signalStrengthChanged = Math.abs(updatedScanData[index].signalStrength - device.scanData.signalStrength) > SIGNAL_STRENGTH_THRESHOLD;

                    if (signalStrengthChanged) {
                        // Update the device data and retain the old connection status
                        updatedScanData[index] = { ...device.scanData, isConnected: oldIsConnected };

                        // Sort the updated scan data by signal strength and return
                        return updatedScanData.sort((a, b) => b.signalStrength - a.signalStrength);
                    }
                } else {
                    // If the device does not exist, add it to the list and sort by signal strength
                    updatedScanData.push(device.scanData);
                    return updatedScanData.sort((a, b) => b.signalStrength - a.signalStrength);
                }

                // If no significant changes, return the previous scan data
                return prevScanData;
            });
        }
    }, []);



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
            console.log("CLOSING DOWN - EVENT SOURCE CLOSED FROM CLIENT");
        };
    }, [addData, listenMode]);




    const connectOne = useCallback((macAddress) => {

        fetch(' http://localhost:8888/api/v1/next-gen/login', {
            method: 'POST',
            body: JSON.stringify({ macAddress }),
            headers: {
                'Content-type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => console.log(data));
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

    const columns = [

        {
            dataIndex: 'lockedInfo',
            key: 'lockedInfo',
            render: (_, record) => {
                if (record.lockedInfo === '02') {
                    return <IoLockOpen size={20} color="#00ad65" />
                }
                return <IoLockClosed size={20} color="#ad1400" />
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
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
            dataIndex: 'isConnected',
            key: 'isConnected',
            render: (_, record) => {
                if (record.isConnected) {
                    return <Tag color="#03c9a9">Connected</Tag>
                }

                return <Tag color="#f64747">Not connected</Tag>;
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
                    return (

                        <Space size="middle">
                            <a onClick={() => navigateToSettings(record.macAddress, record.productNumber)}>Settings</a>
                            <a onClick={() => navigateToMonitor(record.macAddress, record.productNumber)}>Monitor</a>
                            <a onClick={() => disconnectOne(record.macAddress)}>Disconnect</a>

                        </Space>)


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
                        <div style={{alignSelf: 'end', justifyContent: 'end'}}>
                            <p>Scan mode</p>
                            <Switch checked={listenMode} onChange={() => setListenMode((prevValue) => prevValue ? 0 : 1)}>
                            </Switch>
                        </div>
                    </div>
                </div>
                <Table rowSelection={rowSelection} columns={columns} pagination={true} dataSource={scanData} />
            </div>
        </div>
    );
};

