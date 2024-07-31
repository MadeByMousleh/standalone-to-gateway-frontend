

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { Button, Dropdown, Select, Space, Switch, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";

import {
    IoLockClosed,
    IoLockOpen,
    IoWalkOutline,
} from "react-icons/io5";
import { DisabledAnchor } from "./styled";

const connectionStates = {
    BUSY: "Busy",
    CONNECTED: "Connected",
    TIMEOUT: "Timed Out",
    DISCONNECTED: "Not Connected",
    HOST_DISCONNECTED: "Host disconnected",
};



class BLEDeviceV2 {
    constructor(
        macAddress,
        eventType,
        signalStrength,
        firmwareAvailable = [],
        lastSeen = Date.now()
    ) {
        this.key = macAddress;
        this.macAddress = macAddress;
        this.signalStrength = signalStrength;
        this.lastSeen = lastSeen;
        this.evenType = eventType;
        this.connectionState = connectionStates.DISCONNECTED;
        this.reason = "";
        this.name = "";
        this.shortName = "";
        this.productNumber = "";
        this.isLocked = "";
        this.isMovementRegistered = false;
        this.currentLux = 0;
        this.firmwareAvailable = firmwareAvailable;
    }

    handleScanData(scanData) {
        const { name, shortname, productNumber, lockedInfo, firmwaresAvailable } =
            scanData;

        this.setName(name);
        this.setShortname(shortname);
        this.setProductNumber(productNumber);
        this.setIsLocked(lockedInfo === "01");
        this.setFirmwareAvailable(firmwaresAvailable);
    }

    setFirmwareAvailable(firmwaresAvailable) {
        if (!firmwaresAvailable) return;
        if (this.firmwareAvailable.length === 0) {
            this.firmwareAvailable = firmwaresAvailable;
        }
    }
    setName(name) {
        if (name === null) throw new Error("Name cannot be null");

        if (name === this.name) return;

        this.name = name;
    }
    setShortname(shortName) {
        if (shortName === null) throw new Error("Shortname cannot be null");

        if (shortName === this.shortName) return;

        this.shortName = shortName;
    }

    setProductNumber(productNumber) {
        if (productNumber === null) throw new Error("productNumber cannot be null");

        if (productNumber === this.productNumber) return;

        this.productNumber = productNumber;
    }

    setIsLocked(isLocked) {
        if (isLocked === null) throw new Error("IsLocked cannot be null");

        if (isLocked === this.isLocked) return;

        this.isLocked = isLocked;
    }

    handleConnectionState(eventType, connectedDevices) {
        // Ignore event type 4 as it does not require any action
        if (eventType === 4) return;

        // Handle event type 2 which indicates a possible connection or busy state
        if (eventType === 2) {
            // Check if the device with the current macAddress exists in the connectedDevices list
            const device = connectedDevices.find(
                (device) => device.macAddress === this.macAddress
            );

            // If the device exists and its connection state is 'connected', set this.connectionState to CONNECTED
            if (device && device.data.connectionState === "connected") {
                this.connectionState = connectionStates.CONNECTED;
                return;
            }

            // Otherwise, set this.connectionState to BUSY
            this.connectionState = connectionStates.BUSY;
        }

        // Handle event type 0 which indicates a disconnection
        else if (eventType === 0) {
            this.connectionState = connectionStates.DISCONNECTED;
        }
    }

    handleAdvertisementData(adData) {
        if (!((this.isMovementRegistered === adData.tw) === "08")) {
            this.isMovementRegistered = adData.tw === "08";
        }

        if (adData.mailFour !== "000000" && adData.mailFour) {
            if (this.currentLux === Number("0x" + adData.mailFour)) return;
            this.currentLux = Number("0x" + adData.mailFour);
        }
    }
}

const categorizeRSSI = (rssi) => {
    if (rssi >= -60) {
        return "Excellent";
    } else if (rssi >= -70) {
        return "Good";
    } else if (rssi >= -90) {
        return "Fair";
    } else {
        return "Poor";
    }
};

export const ScanPageTable = () => {
    const navigate = useNavigate();

    const [listenMode, setListenMode] = useState(1);

    const [bleDevices, setBleDevices] = useState([]);

    const [connectedDevices, setConnectedDevice] = useState([]);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);



    const [firmwareOptions, setFirmwareOptions] = useState([]);

    const [activateUpgradeBtn, setActivateUpgradeBtn] = useState(false);

    const [isUpgradeAvailable, setIsUpgradeAvailable] = useState(false);



    const intervalRef = useRef(null);

    const delay = (delayInms) => {
        return new Promise((resolve) => setTimeout(resolve, delayInms));
    };

    const updateBleDevices = useCallback(() => {
        setBleDevices((prevData) => {
            const now = Date.now();

            const mappedData = prevData.map((d) => {
                if (!Math.abs(now - d.lastSeen <= 3000)) {
                    d.connectionState = connectionStates.TIMEOUT;
                    d.timer = 30;
                }
                return d;
            });

            // Update selected row keys to remove those that are filtered out
            setSelectedRowKeys((prevKeys) =>
                prevKeys.filter((key) => mappedData.some((d) => d.key === key))
            );

            return mappedData.sort((a, b) => b.signalStrength - a.signalStrength);
        });
    }, [setBleDevices, setSelectedRowKeys]);

    useEffect(() => {
        intervalRef.current = setInterval(updateBleDevices, 5000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [updateBleDevices]);

    const addData = useCallback(
        (event) => {
            const device = JSON.parse(event.data);

            let macAddress = device.commonBleData.bleAddress;
            let eventType = device.commonBleData.eventType;
            let signalStrength = device.commonBleData.signalStrength;

            setBleDevices((currentBleDevices) => {
                const index = currentBleDevices.findIndex(
                    (d) => d.macAddress === macAddress
                );

                const currentDevice = currentBleDevices[index];

                if (index !== -1) {
                    currentBleDevices[index].handleConnectionState(
                        eventType,
                        connectedDevices
                    );

                    if (!currentDevice.scanData && device.scanData) {
                        currentBleDevices[index].handleScanData(device.scanData);
                    }

                    if (device.advertisementData) {
                        currentBleDevices[index].handleAdvertisementData(
                            device.advertisementData
                        );
                    }

                    currentBleDevices[index].lastSeen = Date.now();
                    return [...currentBleDevices];
                }

                const bleDevice = new BLEDeviceV2(
                    macAddress,
                    eventType,
                    signalStrength
                );

                if (device.scanData) bleDevice.handleScanData(device.scanData);

                if (device.advertisementData)
                    bleDevice.handleAdvertisementData(device.advertisementData);

                return [...currentBleDevices, bleDevice];
            });
        },
        [connectedDevices]
    );

    const handleConnectionData = useCallback((event) => {
        const data = JSON.parse(event.data);

        setConnectedDevice((prev) => {
            const exists = prev.findIndex((d) => d.macAddress === data.handle);

            setBleDevices((prevDevices) => {
                const devices = [...prevDevices];

                const index = devices.findIndex(
                    (device) => device.macAddress === data.handle
                );

                if (index !== -1) {
                    if (data.connectionState === "connected") {
                        data.reason = "Host connected";

                        devices[index].connectionState = connectionStates.CONNECTED;
                    }

                    if (data.connectionState === "disconnected") {
                        data.reason = "Host disconnected";

                        devices[index].connectionState = connectionStates.DISCONNECTED;
                    }

                    if (data.connectionState === "failure") {
                        data.reason = "Client disconnected";

                        devices[index].connectionState = connectionStates.DISCONNECTED;
                    }

                    // devices[exists].reason = data.reason;
                }
                return devices;
            });

            if (exists !== -1) {
                prev[exists].connectionState = data.connectionState;
                prev[exists].reason = data.connectionState;

                return [...prev];
            }

            return [...prev, { data, macAddress: data.handle }];
        });
    }, []);

    useEffect(() => {
        const events = new EventSource(
            `http://localhost:8888/api/v1/next-gen/scan/?listenMode=${listenMode}`
        );

        events.addEventListener("message", addData);

        events.onerror = () => {
            events.removeEventListener("message", addData);
            events.close();
        };

        return () => {
            events.removeEventListener("message", addData);
            events.close();
            console.log("CLOSING DOWN AD AND SCAN STREAM");
        };
    }, [addData, listenMode]);

    useEffect(() => {
        const connectionEvents = new EventSource(
            `http://localhost:8888/api/v1/next-gen/sse/connection-status`
        );

        connectionEvents.addEventListener("message", handleConnectionData);

        connectionEvents.onerror = () => {
            connectionEvents.removeEventListener("message", handleConnectionData);
            connectionEvents.close();
        };

        return () => {
            connectionEvents.removeEventListener("message", handleConnectionData);
            connectionEvents.close();
            console.log("CLOSING DOWN CONNECTION SSE ");
        };
    }, [handleConnectionData]);

    const getConnectionList = useCallback(async () => {
        const connectionList = await fetch(
            `http://localhost:8888/api/v1/next-gen/connection-list`
        );

        const { data } = await connectionList.json();

        if (!data.nodes) return;

        if (data.nodes.length > 0) {
            setBleDevices((prev) => {
                return prev.map((d) => {
                    if (d.macAddress === d.bdaddrs?.bdaddr) {
                        d.connectionState = connectionStates.CONNECTED;
                    }

                    return d;
                });
            });

            setConnectedDevice(
                data.nodes.map((d) => {
                    return { data: { ...d }, macAddress: d.bdaddrs.bdaddr };
                })
            );
        }
    }, []);

    useEffect(() => {
        getConnectionList();
    }, [getConnectionList]);

    const connectOne = useCallback((macAddress) => {
        fetch(" http://localhost:8888/api/v1/next-gen/login", {
            method: "POST",
            body: JSON.stringify({ macAddress }),
            headers: {
                "Content-type": "application/json",
            },
        }).then((res) => res.json());
    }, []);

    const connectMany = useCallback(
        async (macAddresses) => {
            for (let i = 0; i < macAddresses.length;) {
                connectOne(macAddresses[i]);
                let delayres = await delay(5000);
                i++;
            }
        },
        [connectOne]
    );

    const disconnectOne = useCallback((macAddress) => {
        fetch("http://localhost:8888/api/v1/next-gen/disconnect", {
            method: "POST",
            body: JSON.stringify({ macAddress }),
            headers: {
                "Content-type": "application/json",
            },
        });
    }, []);

    const connect = (macAddresses) => {
        if (macAddresses.length === 1) {
            return connectOne(macAddresses[0]);
        }

        return connectMany(macAddresses);
    };

    function disconnectMany(macAddresses) {
        fetch("http://localhost:8888/disconnect-mobile/multiple", {
            method: "POST",
            body: JSON.stringify({ macAddresses }),
            headers: {
                "Content-type": "application/json",
            },
        });
    }

    const disconnect = (macAddresses) => {
        if (macAddresses.length === 1) {
            return disconnectOne(macAddresses[0]);
        }

        return disconnectMany(macAddresses);
    };

    const navigateToSettings = (mac, name) => {
        navigate(`/detector/${mac}/${name}`);
    };

    const navigateToMonitor = (mac, name) => {
        navigate(`/detector/monitor/${mac}/${name}`);
    };

    const onClick = ({ item, key, keyPath, domEvent }) => {
        const splittedKey = key.split("-");
        const version = key.split("-")[0];
        const macAddress = key.split("-")[1];

        fetch(" http://localhost:8888/api/v1/next-gen/upgrade", {
            method: "POST",
            body: JSON.stringify({ macAddress, version }),
            headers: {
                "Content-type": "application/json",
            },
        });
    };

    //     {
    //         dataIndex: 'isLocked',
    //         key: 'isLocked',
    //         render: (_, record) => {
    //             if (!record.isLocked) {
    //                 return <IoLockOpen size={20} color="#00ad65" />
    //             }
    //             return <IoLockClosed size={20} color="#ad1400" />
    //         }
    //     },

    //     {
    //         title: 'Name',
    //         dataIndex: 'name',
    //         key: 'name',
    //     },

    //     {
    //         title: 'Short name',
    //         dataIndex: 'shortName',
    //         key: 'shortName',
    //     },

    //     {
    //         title: 'Product number',
    //         dataIndex: 'productNumber',
    //         key: 'productNumber',
    //     },

    //     {
    //         title: 'Mac',
    //         dataIndex: 'macAddress',
    //         key: 'macAddress',
    //     },

    //     {
    //         title: 'Connected',
    //         dataIndex: 'states',
    //         key: 'states',

    //         render: (_, record) => {

    //             return (
    //                 <>
    //                     {record.connectionState === connectionStates.CONNECTED && <Tag color="#03c9a9">Connected</Tag>}
    //                     {record.connectionState === connectionStates.DISCONNECTED && <Tag color="#f64747">Not connected</Tag>}
    //                     {record.connectionState === connectionStates.BUSY && <Tag color="#474af6">{connectionStates.BUSY}</Tag>}

    //                 </>

    //             )
    //         }
    //     },

    //     {
    //         title: 'Signal strength',
    //         dataIndex: 'signalStrength',
    //         key: 'signalStrength',
    //     },

    //     {
    //         title: 'Action',
    //         key: 'action',
    //         render: (_, record) => {

    //             if (record) {

    //                 let items = record.firmwaresAvailable;;

    //                 return (

    //                     record.connectionState === connectionStates.BUSY ?
    //                         (<Space size="middle">
    //                             <DisabledAnchor>Settings</DisabledAnchor>
    //                             <DisabledAnchor >Monitor</DisabledAnchor>
    //                             <DisabledAnchor>Disconnect</DisabledAnchor>
    //                         </Space>

    //                         )
    //                         : (
    //                             <Space size="middle">
    //                                 <a onClick={() => navigateToSettings(record.macAddress, record.productNumber)}>Settings</a>
    //                                 <a onClick={() => navigateToMonitor(record.macAddress, record.productNumber)}>Monitor</a>
    //                                 <a onClick={() => disconnectOne(record.macAddress)}>Disconnect</a>

    //                                 <Dropdown menu={{ items, onClick }}>

    //                                     <a> Upgrade </a>

    //                                 </Dropdown>

    //                             </Space>
    //                         )

    //                 )
    //             }

    //         }
    //     },

    // ];

    const columns = [
        {
            dataIndex: "isLocked",
            key: "isLocked",
            render: (_, record) => {
                if (!record.isLocked) {
                    return <IoLockOpen size={20} color="#00ad65" />;
                }
                return <IoLockClosed size={20} color="#ad1400" />;
            },
        },

        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },

        {
            title: "Short name",
            dataIndex: "shortName",

            showSorterTooltip: {
                target: 'full-header',
            },

            filters: [
                {
                    text: 'P48',
                    value: 'P48',
                },
                {
                    text: 'P47',
                    value: 'P47',
                },

                {
                    text: 'P46',
                    value: 'P46',
                },

                {
                    text: 'P42',
                    value: 'P42',
                },

                {
                    text: 'P41',
                    value: 'P41',
                },
            ],

            onFilter: (value, record) => record.shortName && record.shortName.includes(value),
            // sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend'],


            key: "shortName",

        },

        {
            title: "Product number",
            dataIndex: "productNumber",
            key: "productNumber",
        },

        {
            title: "Mac",
            dataIndex: "macAddress",
            key: "macAddress",
        },

        {
            title: "Connected",
            dataIndex: "states",
            key: "states",

            render: (_, record) => {
                return (
                    <>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div>
                                {record.connectionState === connectionStates.CONNECTED && (
                                    <Tag color="#03c9a9">{connectionStates.CONNECTED}</Tag>
                                )}
                                {record.connectionState === connectionStates.DISCONNECTED && (
                                    <Tag color="#f64747">{connectionStates.DISCONNECTED}</Tag>
                                )}
                                {record.connectionState === connectionStates.BUSY && (
                                    <Tag color="#474af6">{connectionStates.BUSY}</Tag>
                                )}
                                {record.connectionState === connectionStates.TIMEOUT && (
                                    <Tag color="#a747f6">{connectionStates.TIMEOUT}</Tag>
                                )}
                            </div>

                            <div>
                                {record.reason && <Tag color="#ffa33a">{record.reason}</Tag>}
                            </div>
                        </div>
                    </>
                );
            },
        },

        {
            title: "Signal strength",
            dataIndex: "signalStrength",
            key: "signalStrength",

            render: (_, record) => {
                const rssiStrength = categorizeRSSI(record.signalStrength);

                return (
                    <>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div>
                                {rssiStrength === "Excellent" && (
                                    <Tag color="#03c9a9">{rssiStrength}</Tag>
                                )}
                                {rssiStrength === "Good" && (
                                    <Tag color="#474af6">{rssiStrength}</Tag>
                                )}
                                {rssiStrength === "Fair" && (
                                    <Tag color="#ffb326">{rssiStrength}</Tag>
                                )}
                                {rssiStrength === "Poor" && (
                                    <Tag color="#f64747">{rssiStrength}</Tag>
                                )}
                            </div>
                        </div>
                    </>
                );
            },
        },

        {
            title: "Lux",
            dataIndex: "currentLux",
            key: "currentLux",
        },

        {
            title: "Movement",
            dataIndex: "isMovementRegistered",
            key: "isMovementRegistered",
            render: (_, record) => {
                if (record.isMovementRegistered) {
                    return <IoWalkOutline color="green" size={25} />;
                }
                return <IoWalkOutline color="red" />;
            },
        },

        {
            title: "Action",
            key: "action",
            render: (_, record) => {
                if (record) {
                    let items = record.firmwareAvailable;

                    return record.connectionState === connectionStates.BUSY ||
                        record.connectionState === connectionStates.TIMEOUT ? (
                        <Space size="middle">
                            <DisabledAnchor>Settings</DisabledAnchor>
                            <DisabledAnchor>Monitor</DisabledAnchor>
                            <DisabledAnchor>Disconnect</DisabledAnchor>
                            <DisabledAnchor>Upgrade</DisabledAnchor>
                        </Space>
                    ) : (
                        <Space size="middle">
                            <a
                                onClick={() =>
                                    navigateToSettings(record.macAddress, record.productNumber)
                                }
                            >
                                Settings
                            </a>
                            <a
                                onClick={() =>
                                    navigateToMonitor(record.macAddress, record.productNumber)
                                }
                            >
                                Monitor
                            </a>
                            <a onClick={() => disconnectOne(record.macAddress)}>Disconnect</a>

                            <Dropdown menu={{ items, onClick }}>
                                <a> Upgrade </a>
                            </Dropdown>
                        </Space>
                    );
                }
            },
        },
    ];

    const onSelectChange = (newSelectedRowKeys) => {

        setSelectedRowKeys(newSelectedRowKeys);

        console.log(newSelectedRowKeys)
        if (newSelectedRowKeys.length === 0) {
            setFirmwareOptions([])
            setIsUpgradeAvailable(false);
            return;
        };

        const productNumbers = newSelectedRowKeys.map(mac => {

            const { shortName, isLocked, firmwareAvailable } = bleDevices.find(d => d.macAddress === mac);

            return { isLocked, shortName: shortName.slice(0, 3), firmwareAvailable: firmwareAvailable ?? [] };

        })

        const isAllFiltered = productNumbers.filter(d => d.shortName !== productNumbers[0].shortName);

        let currentFirmwareOptions = productNumbers[0].firmwareAvailable.map(f => { return { value: f.key, label: f.label } });

        console.log(currentFirmwareOptions)

        setIsUpgradeAvailable(isAllFiltered.length === 0)

        setActivateUpgradeBtn(isAllFiltered.length === 0)

        setFirmwareOptions(currentFirmwareOptions)
    };

   
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,

        getCheckboxProps: (record) => ({
            disabled:
                record.connectionState === connectionStates.BUSY ||
                record.connectionState === connectionStates.TIMEOUT, // Column configuration not to be checked
        }),
    };


    const hasSelected = selectedRowKeys.length > 0;

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };


    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "20px",
                height: "100%",
            }}
        >
            <h3 style={{ padding: 0, margin: 0 }}>Connect to a detector</h3>
            <p style={{ padding: 0, margin: 0, fontSize: "14px" }}>
                Select the detector you want to connect to
            </p>

            <div>
                <div
                    style={{
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        columnGap: "20px",
                    }}
                >
                    <Button
                        type="primary"
                        onClick={() => connect(selectedRowKeys)}
                        disabled={!hasSelected}
                    >
                        Connect
                    </Button>

                    <Button
                        type="primary"
                        onClick={() => disconnect(selectedRowKeys)}
                        disabled={!hasSelected}
                    >
                        Disconnect
                    </Button>

                    <div>
                        <div style={{ display: 'flex', columnGap: 20 }}>

                            <Select
                                defaultValue={"Firmwares"}
                                options={firmwareOptions}
                                disabled={!isUpgradeAvailable}
                                style={{
                                    width: 120,
                                }}

                            />

                            <Button
                                type="primary"
                                disabled={!activateUpgradeBtn}
                            >
                                Upgrade
                            </Button>


                        </div>
                    </div>
                    <span
                        style={{
                            marginLeft: 8,
                        }}
                    >
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
                    </span>

                    <div
                        style={{
                            alignItems: "end",
                            width: "100%",
                            justifyItems: "end",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "end",
                        }}
                    >
                        <div style={{ alignSelf: "end", justifyContent: "end" }}>
                            <p>Scan mode</p>
                            <Switch
                                checked={listenMode}
                                onChange={() =>
                                    setListenMode((prevValue) => (prevValue ? 0 : 1))
                                }
                            ></Switch>
                        </div>
                    </div>
                </div>

                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    pagination={true}
                    dataSource={bleDevices}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

