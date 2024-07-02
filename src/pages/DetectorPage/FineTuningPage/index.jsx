import React, { useEffect, useState } from 'react'
import { Card } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ByteHelper from '../../../helper/ByteHelper';
import ConfigurationPirSens from '../../../telegrams/v1/userConfig/bytes/zone/bytes/configurationPirSens';

const byteHelper = new ByteHelper();

export default function FineTuningPage() {

    const navigate = useNavigate();
    const { productNumber, mac } = useParams();
    const [pirA, setPirA] = useState();
    const [pirB, setPirB] = useState();
    const [pirC, setPirC] = useState();

    const onSettingsClicked = () => {
        navigate(`fine-tuning/sensitivity/?sectorA=${pirA}&sectorB=${pirB}&sectorC=${pirC}`)
    }



    useEffect(() => {

        fetch(`http://localhost:8888/detector/${productNumber}/${mac}/sensitivity`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
            .then(res => res.json())
            .then(data => {

                const { sectorA, sectorB, sectorC } = data;

                setPirA(byteHelper.hexStringToNumber(sectorA));
                setPirB(byteHelper.hexStringToNumber(sectorB));
                setPirC(byteHelper.hexStringToNumber(sectorC));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <Card
                style={{
                    width: '100%',
                    margin: '20px auto',
                }}
                actions={[
                    <SettingOutlined onClick={() => onSettingsClicked()} key="setting" />,
                ]}
            >

                <h4 style={{ margin: 0 }}>Sensitivity</h4>

                <div style={{ display: 'flex', margin: '0px 0px', flexDirection: 'column' }}>
                    <p style={{ margin: ' 0', fontSize: '12px' }}> Sector A: {ConfigurationPirSens.sensValueToText(pirA)} </p>
                    <p style={{ margin: ' 0', fontSize: '12px' }}> Sector B: {ConfigurationPirSens.sensValueToText(pirB)}</p>
                    <p style={{ margin: ' 0', fontSize: '12px' }}> Sector C: {ConfigurationPirSens.sensValueToText(pirC)}</p>
                </div>


            </Card>


        </div>
    )
}
