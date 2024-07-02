import { Card } from 'antd'
import React, { useCallback } from 'react'
import { SettingOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ToolsPage() {

    const navigate = useNavigate();
    const location = useLocation();

    const onListenToPirDetection = useCallback(() => {
        navigate(`${location.pathname}/tools/pir-detection`)
    }, [location.pathname, navigate])


    const navigateToUpgradePage = useCallback(() => {
        navigate(`${location.pathname}/tools/firmware-upgrade`)
    }, [location.pathname, navigate])


    return (
        <div>
            <Card
                style={{
                    width: '100%',
                    margin: '20px auto',
                }}
                actions={[
                    <SettingOutlined onClick={() => onListenToPirDetection()} key="setting" />,
                ]}
            >

                <h4 style={{ margin: 0 }}>PIR detection</h4>

                <div style={{ display: 'flex', margin: '0px 0px', flexDirection: 'column' }}>
                    <p style={{ margin: ' 0', fontSize: '12px' }}>Know when a detector have detected movement</p>
                </div>

            </Card>

            <Card
                style={{
                    width: '100%',
                    margin: '20px auto',
                }}
                actions={[
                    <SettingOutlined onClick={() => navigateToUpgradePage()} key="setting" />,
                ]}
            >

                <h4 style={{ margin: 0 }}>Firmware upgrade</h4>

                <div style={{ display: 'flex', margin: '0px 0px', flexDirection: 'column' }}>
                    <p style={{ margin: ' 0', fontSize: '12px' }}>Upgrade to available firmware versions</p>
                </div>

            </Card>


        </div>
    )
}
