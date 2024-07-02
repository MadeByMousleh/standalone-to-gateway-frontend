import React, { useCallback, useEffect, useState } from 'react'
import ByteHelper from '../../../helper/ByteHelper';
import ZoneCommonFunc1 from '../../../telegrams/v1/userConfig/bytes/zone/bytes/commonFunc1';
import { useParams, useSearchParams } from 'react-router-dom';
import Zone from '../../../telegrams/v1/userConfig/bytes/zone';
import { Button, Checkbox, Radio, Select, Space } from 'antd';

class ProductInfo {

    series
    technology
    mounting
    output
    detection
    variant

    constructor(series, technology, mounting, output, detection, variant) {
        this.series = series;
        this.technology = technology;
        this.mounting = mounting;
        this.output = output;
        this.detection = detection;
        this.variant = variant;
    }

}

export default function SettingsTab() {

    const params = useParams();
    const { mac, productNumber } = params;
    const [searchParams, setSearchParams] = useSearchParams();
    // const productNumber = searchParams.get('product_number');
    const [productInfo, setProductInfo] = useState(new ProductInfo());

    const [zone, setZone] = useState();
    const [zoneCommonFuncOne, setZoneCommonFuncOne] = useState();
    const [switchDevicesOn, setSwitchDevicesOn] = useState();
    const [requiredLuxLevel, setRequiredLuxLevel] = useState();
    const [overExposed, setOverexposed] = useState();
    const [offPirDelay, setOffPirDelay] = useState();
    const [orientationTimer, setOrientationTimer] = useState();
    const [orientationLightLevel, setOrientationLightLevel] = useState();

    const byteHelper = new ByteHelper();

    const zoneNr = 1;

    
    
    useEffect(() => {

        console.log(productNumber)
        
        fetch(`http://localhost:8888/detector/${productNumber}/${mac}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
            .then(res => res.json())
            .then(data => {


                const { metaData, userConfigReply } = data;

                setProductInfo(new ProductInfo(
                    metaData.series,
                    metaData.technology,
                    metaData.mounting,
                    metaData.output,
                    metaData.detection,
                    metaData.variant
                ))

                const userConfig = userConfigReply;
                // Sets the zone settings
                let zoneOne = new Zone(userConfig.zone1.value);

                setZone(zoneOne);
                // console.log(zoneReply.zone1);

                // console.log(zoneOne.vSetpoint.value);

                // Sets the required lux level - Required lux level
                setRequiredLuxLevel(zoneOne.vSetpoint.value)

                const commonFunc1 = new ZoneCommonFunc1(zoneOne.zoneCommonFunc1.value);

                // Set the zone common func 1 settings
                setZoneCommonFuncOne(commonFunc1)

                // Set the switch devices on value - Switch devices ON

                setSwitchDevicesOn(commonFunc1.getBit(commonFunc1.Bits.AUTO_ON))

                // Above the required lux level

                setOverexposed(commonFunc1.getBit(commonFunc1.Bits.OVEREXPOSED_ACTIVE))

                // Switch-off delay timer
                setOffPirDelay(zoneOne.tOffPirDelay.value);

                // Orientation light timer
                setOrientationTimer(byteHelper.reverse(zoneOne.tOrientationDelay.value.toString(16).padStart(4, '0')))

                // Orientation light level
                setOrientationLightLevel(byteHelper.reverse(zoneOne.orientationLevel.value.toString(16).padStart(2, '0')))

            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const timerArray = [
        { value: 15, label: "15 seconds" },
        { value: 30, label: "30 seconds" },
        { value: 120, label: "2 minutes" },
        { value: 300, label: "5 minutes" },
        { value: 600, label: "10 minutes" },
        { value: 900, label: "15 minutes" },
        { value: 1200, label: "20 minutes" },
        { value: 1500, label: "25 minutes" },
        { value: 1800, label: "30 minutes" },
        { value: 2100, label: "35 minutes" },
        { value: 2400, label: "40 minutes" },
        { value: 2700, label: "45 minutes" },
        { value: 3000, label: "50 minutes" },
        { value: 3300, label: "55 minutes" },
        { value: 3600, label: "60 minutes" },
        { value: 65533, label: "Pulse: 1s on, 20s off" },
        { value: 65534, label: "Pulse: 1s on, 60s off" },
        { value: 65535, label: "Disable Timer" },
    ];

    const delayOptionsOrientation = Array.from([{ value: 0, label: 'Off' }, ...timerArray]);

    const handleOffPirOptionChange = useCallback((value) => {
        zone.setOffPirTimer(value);
        setOffPirDelay(value);
    }, [zone])


    const luxLevels = [
        { value: 0x0014, label: "20 lux" },
        { value: 0x0032, label: "50 lux" },
        { value: 0x004B, label: "75 lux" },
        { value: 0x0064, label: "100 lux" },
        { value: 0x0096, label: "150 lux" },
        { value: 0x00C8, label: "200 lux" },
        { value: 0x012C, label: "300 lux" },
        { value: 0x0190, label: "400 lux" },
        { value: 0x01F4, label: "500 lux" },
        { value: 0x02EE, label: "750 lux" },
        { value: 0x03E8, label: "1000 lux" },
        { value: 0x05DC, label: "1500 lux" },
        { value: 0xFFFF, label: "Disable" }
    ];

    const orientationLevelOptions = [
        { value: 10, label: "10 %" },
        { value: 20, label: "20 %" },
        { value: 30, label: "30 %" },
        { value: 40, label: "40 %" },
        { value: 50, label: "50 %" },
        { value: 60, label: "60 %" },
        { value: 70, label: "70 %" },
        { value: 80, label: "80 %" },
        { value: 90, label: "90 %" },
        { value: 100, label: "100 %" },
    ];

    const handleOrientationLevel = (e) => {
        const copied = { ...zone };
        zone.orientationLevel = e;
        setOrientationLightLevel(e)
        setZone(copied);
    }

    const handleLuxLevelChange = (value) => {

        setZone(prevState => {
            prevState.vSetpoint.value = value;
            return prevState;
        });
        setRequiredLuxLevel(value);
    }


    const onSwitchDeviceOnChange = useCallback((bit) => {

        zoneCommonFuncOne.deactivateAutoOn();
        setZone(prevState => {
            prevState.zoneCommonFunc1.value = zoneCommonFuncOne.byte;
            return prevState;
        });
        setSwitchDevicesOn(bit);

    }, [zoneCommonFuncOne])

    const handleOverExposedChange = useCallback((bit) => {


        if (overExposed === 1) {
            zoneCommonFuncOne.deactivateOverexposed();
            setOverexposed(0);
        }
        else {
            zoneCommonFuncOne.activateOverexposed();
            setOverexposed(1);
        }

        setZone(prevState => {
            prevState.zoneCommonFunc1.value = zoneCommonFuncOne.byte;
            return prevState;
        });

    }, [overExposed, zoneCommonFuncOne])


    const handleOrientationDelay = useCallback((value) => {
        const copied = { ...zone };
        if (orientationTimer === 0) {
            zone.orientationLevel = 20;
            setOrientationLightLevel(20);
        }
        copied.tOrientationDelay = value
        setZone(copied);
        setOrientationTimer(value);
    }, [zone, orientationTimer])


    const updateZone = useCallback(() => {

        console.log(productNumber)
        fetch(`http://localhost:8888/detector/${productNumber}/${mac}/zones/${zoneNr}`, {
            method: 'PUT',
            body: JSON.stringify({
                zone: zone.getRawData()
            }),
            headers: { 'Content-type': 'application/json' }

        })
            .then(res => res.json())
            .then(data => console.log(data))

    }, [zone, productNumber, mac])


    return (

        <>
            {zone &&
                <div style={{ margin: '20px' }}>

                    {/* <text>{name}</text>
            <text>{connected}</text> */}
                    {/* <text>{mac}</text>
            <p>Series: {productInfo.series}</p>
            <p>Technology: {productInfo.technology}</p>
            <p>Mounting: {productInfo.mounting}</p>
            <p>Output: {productInfo.output}</p>
            <p>Detection: {productInfo.detection}</p>
            <p>Variant: {productInfo.variant}</p>

            <text>{productNumber}</text> */}

                    <div style={{ display: 'flex', flexDirection: 'column', 'rowGap': 25 }}>

                        <div>
                            <div style={{ margin: '10px auto', display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Required lux level</p>
                                <p style={{ fontSize: '12px', padding: 0, margin: 0 }}>Specify the intensity of the light in the room. Higher values are equal to more light.</p>
                            </div>

                            <Select
                                defaultValue={500}
                                style={{ width: '100%' }}
                                onChange={handleLuxLevelChange}
                                options={luxLevels}
                                value={requiredLuxLevel}
                            />

                        </div>

                        <div>
                            <div style={{ margin: '10px auto', display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Above the required lux level</p>
                                <p style={{ fontSize: '12px', padding: 0, margin: 0 }}>When there is more LUX in the room then required, the detector should</p>
                            </div>

                            <Checkbox checked={overExposed === 1} onChange={handleOverExposedChange}>Turn the lights OFF</Checkbox>


                        </div>

                        <div>
                            
                            <div style={{ margin: '10px auto', display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Switch-off delay timer</p>
                                <p style={{ fontSize: '12px', padding: 0, margin: 0 }}>Specify the duration for the light to stay on after motion stops.</p>
                            </div>

                            <Select
                                defaultValue='15 min'
                                style={{ width: '100%' }}
                                onChange={handleOffPirOptionChange}
                                options={timerArray}
                                value={offPirDelay}
                            />
                        </div>



                        <div>

                            <div style={{ margin: '10px auto', display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Switch devices ON</p>
                                <p style={{ fontSize: '12px', padding: 0, margin: 0 }}>Specify how the devices should be activated. They will always turn OFF automatically.</p>
                            </div>

                            <Radio.Group onChange={e => onSwitchDeviceOnChange(e.target.value)} value={switchDevicesOn}>

                                <Space direction="vertical">
                                    <Radio value={1}> When movement is detected</Radio>
                                    <Radio value={0}> Manually (E.g buttons)</Radio>
                                </Space>

                            </Radio.Group>

                            {/* <TelegramRadioGroup byteTelegram={switchDevicesOnByte} /> */}

                        </div>






                        {productInfo.technology !== '230V' &&
                            <>
                                <section>

                                    <div>
                                        <div style={{ margin: '10px auto', display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
                                            <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Orientation light - switch-off delay</p>
                                            <p style={{ fontSize: '12px', padding: 0, margin: 0 }}>Specify the duration for the orientation light to stay on after motion stops.</p>
                                        </div>
                                        <Select
                                            defaultValue='15 min'
                                            style={{ width: '100%' }}
                                            onChange={handleOrientationDelay}
                                            options={delayOptionsOrientation}
                                            value={orientationTimer}
                                        />
                                    </div>

                                    {orientationTimer > 0 &&
                                        <div>
                                            <div style={{ margin: '10px auto', display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
                                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Orientation light intensity</p>
                                                <p style={{ fontSize: '12px', padding: 0, margin: 0 }}>Specify the intensity of the orientation light in the room. Higher values are equal to more light.</p>
                                            </div>

                                            <Select
                                                style={{ width: '100%' }}
                                                onChange={handleOrientationLevel}
                                                options={orientationLevelOptions}
                                                value={orientationLightLevel}
                                            />

                                        </div>
                                    }
                                </section>
                            </>
                        }

                        <Button onClick={() => updateZone()}>Update settings</Button>

                    </div>

                </div>
            }
        </>
    )
}
