import { Card, } from 'antd'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { SettingOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

export default function FunctionsPage() {
    const navigate = useNavigate();
    const [networkId, setNetworkId] = useState()
    const { productNumber, mac } = useParams();

    useLayoutEffect(() => {

        fetch(`http://localhost:8888/detector/${productNumber}/${mac}/network-id`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    setNetworkId(data.value);
                }
            })
    }, [])

    const onMasterSecondaryClicked = () => {
        navigate(`functions/master-secondary?networkId=${networkId}`);
    }

    return (
        <div>
            <Card
                style={{
                    width: '100%',
                    margin: '20px auto',
                }}
                actions={[
                    <SettingOutlined onClick={() => onMasterSecondaryClicked()} key="setting" />,
                ]}
            >

                <h4 style={{ margin: 0 }}>Master - secondary detector</h4>

                <div style={{ display: 'flex', margin: '0px 0px', flexDirection: 'column' }}>
                    <p style={{ margin: ' 0', fontSize: '12px' }}>Wireless communication: {networkId === '00' ? 'OFF' : 'ON'}</p>
                </div>

            </Card>


        </div>
    )
}
