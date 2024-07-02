import { Button, Radio, Space, notification } from 'antd'
import React, { useCallback } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ConfigurationPirSens from '../../../../../telegrams/v1/userConfig/bytes/zone/bytes/configurationPirSens';

export default function SectorPage() {
    const params = useParams();
    const { sector } = params;
    const [searchParams, setSearchParams] = useSearchParams();
    const { productNumber, mac } = useParams();
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    const location = useLocation();

    let sectorA = +searchParams.get('sectorA');
    let sectorB =  +searchParams.get('sectorB')
    let sectorC =  +searchParams.get('sectorC')

    const openNotificationWithIcon = useCallback((type) => {
        api[type]({
            message: 'Sensitivity updated successfully'
        });
    }, [api]);


    const onUpdateSettings = useCallback(() => {

        fetch(`http://localhost:8888/detector/${productNumber}/${mac}/sensitivity`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    sectorA: sectorA.toString(16),
                    sectorB: sectorB.toString(16),
                    sectorC: sectorC.toString(16)
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                let value = data.value;
                let byte = value.split("").reverse().splice(0, 2).join("");
                if (byte === '00') {
                    // navigate('/')
                    openNotificationWithIcon('success')

                }
            })
    }, [productNumber, mac, sectorA, sectorB, sectorC, openNotificationWithIcon])

    const onChangeSensitivity = useCallback((val) => {
        navigate(`${location.pathname}?sectorA=${sector === 'A' ? val : sectorA}&sectorB=${sector === 'B' ? val : sectorB}&sectorC=${sector === 'C' ? val : sectorC}`, { replace: true })
    }, [location.pathname, navigate, sector, sectorA, sectorB, sectorC])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
            {contextHolder}

            <div>
                <div style={{ margin: '10px auto', display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
                    <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Set the sensitivity for - Sector {sector} </p>
                    <p style={{ fontSize: '12px', padding: 0, margin: 0 }}>Specify how sensitive the detector should to movement</p>
                </div>

                <Radio.Group onChange={e => onChangeSensitivity(e.target.value)} value={+searchParams.get(`sector${sector}`)}>

                    <Space direction="vertical">
                        <Radio value={ConfigurationPirSens.MAX}> Maximum</Radio>
                        <Radio value={ConfigurationPirSens.HIGH}> High</Radio>
                        <Radio value={ConfigurationPirSens.LOW}> Low</Radio>
                        <Radio value={ConfigurationPirSens.MIN}> Minimum</Radio>
                        <Radio value={ConfigurationPirSens.OFF}> Off</Radio>
                    </Space>

                </Radio.Group>

            </div>

            <Button onClick={() => onUpdateSettings()}>Update sensitivity</Button>
        </div>
    )
}
