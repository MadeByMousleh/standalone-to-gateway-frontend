import React, { useCallback, useEffect, useState, } from "react";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";


console.log("YOYO from mobile scan page")


export const MobileScanPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [connectedDevices, setConnectedDevices] = useState([]);

    console.log('Hey we are rendering the components again')

    useEffect(() => {
        const fetchConnectedDevices = async () => {
            try {
                const response = await fetch('http://localhost:8888/connected-devices');
                const data = await response.json();

                if (Object.keys(data.nodes).length !== 0) {
                    setConnectedDevices([...data.nodes]);
                }
            } catch (error) {
                console.error('Error fetching connected devices:', error);
                // You might want to handle the error, e.g., show a message to the user
            }
        };

        fetchConnectedDevices();

    }, []);

    const addData = useCallback((event) => {
        const parsedData = JSON.parse(event.data);

        if (parsedData.scanData) {
            setData((prevData) => {

                const index = prevData.findIndex((d) => d.macAddress === parsedData.macAddress);

                const isConnected = !!connectedDevices.find((node) => node.id === parsedData.macAddress)



                if (index === -1) {
                    if (isConnected) parsedData.isConnected = true;
                    return [...prevData.sort((a, b) => b.signalStrength - a.signalStrength), parsedData]
                }

                const existingDevice = prevData[index];

                const hasSignalChanged = Math.abs(parsedData.signalStrength - existingDevice.signalStrength) > 10;

                if (!hasSignalChanged) return prevData;

                if (hasSignalChanged) prevData[index].signalStrength = existingDevice.signalStrength;

                return [...prevData.sort((a, b) => b.signalStrength - a.signalStrength)];
            });
        }
    }, [connectedDevices]);


    useEffect(() => {
        let events = new EventSource('http://localhost:8888/scan-mobile');

        if (events.OPEN) {
            events.addEventListener('message', addData);
        }

        events.onerror = () => {
            events.removeEventListener('message', addData);
            events.close();
        };

        return () => {
            events.removeEventListener('message', addData);
            events.close();
            console.log("CLOSING DOWN - EVENT SOURCE CLOSED FROM CLIENT")
        };
    }, [addData]);



    const connect = useCallback((macAddress) => {


        fetch('http://localhost:8888/connect-mobile', {
            method: 'POST',
            body: JSON.stringify({ mac: macAddress }),
            headers: {
                'Content-type': 'application/json',
            }
        })
            .then(res => res.json())

            .then(data => {
                console.log(data)
                if (data.status === 200) {

                    setData(prevState => {

                        let index = prevState.findIndex(d => d.macAddress === macAddress);

                        if (index === -1) return prevState;

                        let device = prevState[index];

                        device.isConnected = true;

                        prevState[index] = device;

                        return [...prevState];
                    })
                }
            })
    }, [])


    const disconnect = useCallback((macAddress) => {
        fetch('http://localhost:8888/disconnect-mobile', {
            method: 'POST',
            body: JSON.stringify({ mac: macAddress }),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    setData(prevState => {
                        let index = prevState.findIndex(d => d.macAddress === macAddress);
                        if (index === -1) return prevState;
                        let device = prevState[index];
                        device.isConnected = false;
                        prevState[index] = device;
                        return [...prevState];
                    })
                }
            })
    }, [])


    const navigateToSettings = (mac, name) => {

        navigate(`/detector/${mac}/${name}`)

    }

    return (

        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '20px', height: '100%' }}>
            <h3 style={{ padding: 0, margin: 0 }}>Connect to a detector</h3>
            <p style={{ padding: 0, margin: 0, fontSize: '14px' }}>Select the detector you want to connect to</p>

            {data.map((device, index) => {

                return (
                    <Card
                        key={index}
                        style={{
                            width: '100%',
                        }}
                        actions={[
                            <>
                                {!device.isConnected
                                    ? <Button onClick={() => connect(device.macAddress)}>Connect</Button>
                                    : <Button onClick={() => disconnect(device.macAddress)}>Disconnect</Button>
                                }
                            </>,

                            <>
                                {device.isConnected &&
                                    <Button onClick={() => { navigateToSettings(device.macAddress, device.scanData.productNumber) }}>Change Settings</Button>
                                }
                            </>
                        ]}
                    >

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h4 style={{ margin: 0 }}>{device.asciiName}</h4>
                            {device.isConnected ?
                                <p style={{ fontSize: '10px', backgroundColor: '#13bd7e', color: '#045537', fontWeight: 'bold', padding: '3px 10px', borderRadius: '4px' }}>Connected</p>
                                : <p style={{ fontSize: '10px', backgroundColor: '#bfbfbf', color: '#3e3e3e', fontWeight: 'bold', padding: '3px 10px', borderRadius: '4px' }}>Not connected</p>
                            }
                        </div>

                        <div style={{ display: 'flex', margin: '0px 0px', flexDirection: 'column' }}>
                            <p style={{ margin: ' 0', fontSize: '12px' }}>{device.macAddress}</p>
                        </div>

                    </Card>)
            })}

        </div>
    );
};

