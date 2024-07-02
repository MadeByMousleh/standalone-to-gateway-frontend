import { Button, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

const networkIds = Array.from({ length: 100 }, (item, index) => item = { value: index + 1, label: index + 1 });


export default function MasterSecondaryFunction() {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { mac, productNumber } = useParams();

    const networkId = searchParams.get('networkId');

    const onButtonClick = () => {
        fetch(`http://localhost:8888/detector/${productNumber}/${mac}/user-config/system-network-byte`, {
            method: 'PUT',
            body: JSON.stringify({
                networkByte: networkId.toString(16),
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status === 200) {
                    navigate(location.pathname + `/secondary-list?networkId=${networkId}`);
                }
            })
    }

    const onNetworkIdChange = useCallback((value) => {
        navigate(location.pathname + `?networkId=${value}`, { replace: true });
    }, [location.pathname, navigate])


    return (
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '20px', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>

                <div>
                    <div style={{ margin: '10px auto', display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
                        <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Choose the network id</p>
                        <p style={{ fontSize: '12px', padding: 0, margin: 0 }}>By choosing a network id, you can link other detectors to this detector</p>
                    </div>

                    <Select
                        style={{ width: '100%' }}
                        options={networkIds}
                        value={networkIds[networkId - 1]}
                        onChange={onNetworkIdChange}

                    />

                </div>

                <Button onClick={() => onButtonClick()}>Continue</Button>
            </div>

        </div>
    )
}
