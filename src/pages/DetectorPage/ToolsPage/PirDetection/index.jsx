import { Collapse } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react'


class AdvertisementData {
    flags;
    header;
    sequenceNumber;
    source;
    sourceType;
    wirelessFunction;
    mail;
    tw;
    pushButtonEvent;
    pushButtonNumber;
    pirEvent;
    bleButtonMac;
    padding;
    macAddress;
    timeStamp = null;

    constructor(hexString, macAddress) {
        if (hexString.length > 0) {
            // Flags
            this.flags = hexString.slice(0, 2);

            // Header
            this.header = hexString.slice(2, 12);

            // [A6-03-01-00]
            this.sequenceNumber = Number(`0x${hexString.slice(12, 14)}`);
            this.source = Number(`0x${hexString.slice(14, 16)}`);
            this.sourceType = Number(`0x${hexString.slice(16, 18)}`);
            this.wirelessFunction = Number(`0x${hexString.slice(18, 20)}`);

            // [00-00-00-00-00-00-00-00-00]
            this.mail = hexString.slice(20, 38);
            this.tw = hexString.slice(38, 40);

            // [00-00-08-00-00-00]
            this.pushButtonEvent = hexString.slice(40, 42);
            this.pushButtonNumber = hexString.slice(42, 44);
            this.pirEvent = hexString.slice(44, 46);
            this.bleButtonMac = hexString.slice(46, 56);

            // [00-00-00-00-00]
            this.padding = hexString.slice(56, 66);
            this.macAddress = macAddress;

            if (this.pirEvent === '08') {
                const options = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' };
                this.timeStamp = new Date().toLocaleDateString('en-US', options);
            }
        }
    }


    // console.log(header, 'header');
    // console.log(payload, 'payload');

    // [02-01-06-1B-FF-FE-05]-[A6-03-01-00]-[00-00-00-00-00-00-00-00-00]-[00-00-08-00-00-00]-[00-00-00-00-00]
    // Header
    // [02-01-06-1B-FF-FE-05]-
    // 02 = Flags indicating BLE General Discoverable Mode
    // 01 = Length of the Flags field
    // 06 = Data Type indicating the Shortened Local Name
    // 1BFFFE05 = Bluetooth MAC Address (Little Endian)

    // [A6-03-01-00]
    // A6 = Sequence number
    // 03 = Source (network)
    // 01 = Source Type (Sec/push-button/master)
    // 00 = Wireless function

    // [00-00-00-00-00-00-00-00-00]
    // 00 = Mail
    // 00 = Mail
    // 00 = Mail
    // 00 = Mail
    // 00 = Mail
    // 00 = Mail
    // 00 = Mail
    // 00 = Mail
    // 00 = TW

    // [00-00-08-00-00-00]
    // 00 = Push button event
    // 00 = Push button number
    // 00 = Pir event
    // 00 = BLE button mac (Last three as the others are known)

    // [00-00-00-00-00]
    // 00 = Padding
    // 00 = Padding
    // 00 = Padding
    // 00 = Padding
    // 00 = Padding
}

export default function PirDetection() {
    const [data, setData] = useState({});

    const addData = useCallback((event) => {
        const parsedData = JSON.parse(event.data);

        if (parsedData.advertisementData) {

            const advData = parsedData.advertisementData;

            setData(prevState => {

                const packet = new AdvertisementData(advData);

                if (prevState[parsedData.macAddress]) {
                    prevState[parsedData.macAddress].push(packet)
                } else {
                    prevState[parsedData.macAddress] = [packet]
                }
                return { ...prevState };
            })
        }


    }, []);

    // useEffect(() => {
    //     console.log(data)
    // }, [data])


    useEffect(() => {
        let events = new EventSource('http://localhost:8888/listen/advertisement');

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

    const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

    const items = [
        {
            key: '1',
            label: 'This is panel header 1',
            children: <p>{text}</p>,
        },
        {
            key: '2',
            label: 'This is panel header 2',
            children: <p>{text}</p>,
        },
        {
            key: '3',
            label: 'This is panel header 3',
            children: <p>{text}</p>,
        },
    ];

    const items2 = useMemo(() => {
        const items = [];
        Object.keys(data).map((key) => {
            console.log(key)
            items.push({
                key, label: key,
                children:
                    <div>
                        {data[key].map(packet => {
                            if (packet.timeStamp) {
                                return (<div> Movement detected: {packet.timeStamp} </div>)
                            }
                        })}
                    </div>

            })
        })
        return items;
    }, [data])

    const onChange = (key) => {
        console.log(key);
    };

    return (
        <div>
            <Collapse items={items2} onChange={onChange} />
        </div>
    )
}
