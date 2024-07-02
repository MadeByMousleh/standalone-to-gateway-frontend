import { Button, Radio, Space, notification } from 'antd'
import React, { useCallback, useState } from 'react'
import ConfigurationPirSens from '../../../../../telegrams/v1/userConfig/bytes/zone/bytes/configurationPirSens'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Navigate } from "react-router-dom";

export default function AllSectorsPage() {

    const { mac, productNumber } = useParams();
    const [api, contextHolder] = notification.useNotification();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    let sensitivity = +searchParams.get('sectorA');

    const openNotificationWithIcon = useCallback((type) => {
        api[type]({
            message: 'Sensitivity updated successfully'
        });
    }, [api]);

    const onUpdateSettings = useCallback(() => {

        let hexData = (+searchParams.get('sectorA')).toString(16);

        fetch(`http://localhost:8888/detector/${productNumber}/${mac}/sensitivity`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    sectorA: hexData,
                    sectorB: hexData,
                    sectorC: hexData
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                let value = data.value;
                let byte = value.split("").reverse().splice(0, 2).join("");
                if (byte === '00') {
                    // navigate('/')
                    openNotificationWithIcon('success')

                }
            })
    }, [searchParams, productNumber, mac, openNotificationWithIcon])

    const onChangeSensitivity = useCallback((val) => {
        navigate(`${location.pathname}?sectorA=${val}&sectorB=${val}?sectorC=${val}`, { replace: true })
    }, [location.pathname, navigate])

    return (

        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '20px', height: '100%' }}>
            {contextHolder}

            <h3 style={{ padding: 0, margin: 0 }}>Sensitivity</h3>
            <p style={{ padding: 0, margin: 0, fontSize: '14px' }}>Set the detectors sensitivity</p>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>

                <div>


                    <Radio.Group onChange={e => onChangeSensitivity(e.target.value)} value={sensitivity}>

                        <Space direction="vertical">
                            <Radio value={ConfigurationPirSens.MAX}> Maximum</Radio>
                            <Radio value={ConfigurationPirSens.HIGH}> High</Radio>
                            <Radio value={ConfigurationPirSens.LOW}> Low</Radio>
                            <Radio value={ConfigurationPirSens.MIN}> Minimum</Radio>
                            <Radio value={ConfigurationPirSens.OFF}> OFF</Radio>
                        </Space>

                    </Radio.Group>

                </div>

                <Button onClick={() => onUpdateSettings()}>Update sensitivity</Button>

            </div>
        </div>
    )
}
