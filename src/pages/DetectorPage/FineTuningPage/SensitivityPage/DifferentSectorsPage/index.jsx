import { Card } from 'antd'
import React from 'react'
import { SettingOutlined } from '@ant-design/icons'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import ConfigurationPirSens from '../../../../../telegrams/v1/userConfig/bytes/zone/bytes/configurationPirSens';

export default function DifferentSectorsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();


    const onSettingsClicked = (sector) => {
        navigate(`sector/${sector}${location.search}`);
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', rowGap: '20px'}}>
            <h3 style={{padding: 0, margin: 0}}>Different for each sector</h3>
            <p style={{padding: 0, margin: 0, fontSize: '14px'}}>Select the sector you want to change the sensitivity for</p>
            <Card actions={[<SettingOutlined onClick={() => onSettingsClicked('A')} key="setting" />]} >

                <h4 style={{ margin: 0 }}>Sector A</h4>

                <div style={{ display: 'flex', margin: '0px 0px', flexDirection: 'column' }}>
                    <p style={{ margin: ' 0', fontSize: '12px' }}> Sensitivity: {ConfigurationPirSens.sensValueToText(+searchParams.get('sectorA'))}</p>
                </div>


            </Card>

            <Card actions={[<SettingOutlined onClick={() => onSettingsClicked('B')} key="setting" />]} >

                <h4 style={{ margin: 0 }}>Sector B</h4>

                <div style={{ display: 'flex', margin: '0px 0px', flexDirection: 'column' }}>
                    <p style={{ margin: ' 0', fontSize: '12px' }}> Sensitivity: {ConfigurationPirSens.sensValueToText(+searchParams.get('sectorB'))} </p>
                </div>


            </Card>

            <Card actions={[<SettingOutlined onClick={() => onSettingsClicked('C')} key="setting" />]} >

                <h4 style={{ margin: 0 }}>Sector C</h4>

                <div style={{ display: 'flex', margin: '0px 0px', flexDirection: 'column' }}>
                    <p style={{ margin: ' 0', fontSize: '12px' }}> Sensitivity: {ConfigurationPirSens.sensValueToText(+searchParams.get('sectorC'))}</p>
                </div>

            </Card>
        </div>

    )
}
