import React, { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useState, } from "react";
import { Button, Card } from "antd";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";


const connectToDetector = async (mac) => {

    console.log(mac);
    const result = await fetch(`http://localhost:8888/connect-mobile`, {
        method: 'POST',
        body: JSON.stringify({ mac }),
        headers: { 'Content-Type': 'application/json' }
    })

    const data = await result.json();

    if (data.status === 200) {
        return true;
    }
    return false;
}

const disconnectFromDetector = async (mac) => {

    const result = await fetch(`http://localhost:8888/disconnect-mobile`, {
        method: 'POST',
        body: JSON.stringify({ mac }),
        headers: { 'Content-Type': 'application/json' }
    })

    const data = await result.json();

    if (data.status === 200) {
        return true;
    }
    return false;
}



const SecondaryList = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const networkId = searchParams.get('networkId');
    const location = useLocation();

    const [data, setData] = useState([]);


    console.log('Rerendered')



    useEffect(() => {
        let events = new EventSource('http://localhost:8888/scan-mobile');

        events.onmessage = (event) => {

            const parsedData = JSON.parse(event.data);

            if (parsedData.scanData) {
                const isSecondary = parsedData.asciiName.includes('P41');

                if (isSecondary) {

                    setData(prevState => {

                        if (prevState) {
                            const index = prevState.findIndex(d => d.macAddress === parsedData.macAddress);
                            parsedData.msg = '';
                            parsedData.isLinked = Number(`0x${parsedData.scanData.networkId}`);
                            if (index === -1) return [...prevState.sort((a, b) => b.signalStrength - a.signalStrength), parsedData];
                        }
                        return prevState;
                    })
                }

            }

        };

        return () => {
            events.close();
        }


    }, []);


    const link = useCallback(async (productNumber, mac) => {

        setData(prevState => {
            const index = prevState.findIndex(d => d.macAddress === mac);
            prevState[index].msg = 'Connecting...';
            if (index !== -1) return [...prevState];
        });


        let isConnected = await connectToDetector(mac);

        if (isConnected) {
            setData(prevState => {
                const index = prevState.findIndex(d => d.macAddress === mac);
                prevState[index].msg = 'Linking...';
                if (index !== -1) return [...prevState];
            });

            const result = await fetch(`http://localhost:8888/detector/${productNumber}/${mac}/user-config/system-network-byte`, {
                method: 'PUT',
                body: JSON.stringify({
                    networkByte: networkId.toString(16),
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await result.json();

            if (data.status === 200) {
                setData(prevState => {
                    const index = prevState.findIndex(d => d.macAddress === mac);
                    prevState[index].scanData.networkId = Number(`0x${networkId}`);
                    return [...prevState];
                })

                const isDisconnected = await disconnectFromDetector(mac);

                setData(prevState => {
                    const index = prevState.findIndex(d => d.macAddress === mac);
                    prevState[index].msg = 'Disconnecting...';
                    if (index !== -1) return [...prevState];
                });


                if (isDisconnected) {
                    console.log('Disconnected');

                    setData(prevState => {
                        const index = prevState.findIndex(d => d.macAddress === mac);
                        prevState[index].msg = '';
                        if (index !== -1) return [...prevState];
                    });

                }
            }
        }
    }, [networkId])

    const unlink = useCallback(async (productNumber, mac) => {
        setData(prevState => {
            const index = prevState.findIndex(d => d.macAddress === mac);
            prevState[index].msg = 'Connecting...';
            if (index !== -1) return [...prevState];
        });


        let isConnected = await connectToDetector(mac);

        if (isConnected) {
            setData(prevState => {
                const index = prevState.findIndex(d => d.macAddress === mac);
                prevState[index].msg = 'Unlinking...';
                if (index !== -1) return [...prevState];
            });

            const result = await fetch(`http://localhost:8888/detector/${productNumber}/${mac}/user-config/system-network-byte`, {
                method: 'PUT',
                body: JSON.stringify({
                    networkByte: '00',
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await result.json();

            if (data.status === 200) {
                setData(prevState => {
                    const index = prevState.findIndex(d => d.macAddress === mac);
                    prevState[index].scanData.networkId = 0;
                    return [...prevState];
                })

                const isDisconnected = await disconnectFromDetector(mac);

                setData(prevState => {
                    const index = prevState.findIndex(d => d.macAddress === mac);
                    prevState[index].msg = 'Disconnecting...';
                    if (index !== -1) return [...prevState];
                });


                if (isDisconnected) {
                    setData(prevState => {
                        const index = prevState.findIndex(d => d.macAddress === mac);
                        prevState[index].msg = '';
                        if (index !== -1) return [...prevState];
                    });

                }
            }
        }
    }, [])

    return (

        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '20px', height: '100%' }}>
            <h3 style={{ padding: 0, margin: 0 }}>Link secondaries to the same network</h3>
            <p style={{ padding: 0, margin: 0, fontSize: '14px' }}>Link a secondary detector</p>

            <Suspense >


                {data && data.map((device, index) => {
                    const currentNetworkId = device.scanData.networkId;
                    const linkedToCurrentNetwork = currentNetworkId === Number('0x' + networkId);
                    const linkedToDifferentNetwork = (!linkedToCurrentNetwork && currentNetworkId !== 0);

                    return (
                        <Card
                            key={index}
                            style={{ width: '100%' }}
                            actions={[
                                <>
                                    {linkedToCurrentNetwork
                                        ? <Button onClick={() => unlink(device.scanData.productNumber, device.macAddress)}>Unlink</Button>
                                        : <Button onClick={() => link(device.scanData.productNumber, device.macAddress)}>Link</Button>
                                    }
                                </>,
                            ]}>


                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h4 style={{ margin: 0 }}>{device.asciiName}</h4>
                                {linkedToCurrentNetwork ?
                                    <p style={{ fontSize: '10px', backgroundColor: '#13bd7e', color: '#045537', fontWeight: 'bold', padding: '3px 10px', borderRadius: '4px' }}>Linked</p>
                                    : <p style={{ fontSize: '10px', backgroundColor: '#bfbfbf', color: '#3e3e3e', fontWeight: 'bold', padding: '3px 10px', borderRadius: '4px' }}>Not linked</p>
                                }
                            </div>
                            <div style={{ display: 'flex', margin: '0px 0px', flexDirection: 'column' }}>
                                <p style={{ margin: ' 0', fontSize: '12px' }}>{device.macAddress} </p>
                                <p style={{ margin: ' 0', fontSize: '12px' }}>Network: {currentNetworkId === 0 ? '- -' : currentNetworkId} </p>
                                {linkedToDifferentNetwork &&
                                    <p style={{ margin: ' 0', fontSize: '12px' }}>Linked to different network</p>
                                }
                                <p style={{ margin: ' 0', fontSize: '12px' }}>{device.msg}</p>

                            </div>

                        </Card>)
                })}

            </Suspense>
        </div>
    );
};

export default SecondaryList;