import { Space, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';



export default function FirmwareUpgrade() {
    const [firmware, setFirmware] = useState([]);

    const params = useParams();
    const { mac, productNumber } = params;

    useEffect(() => {

        fetch(`http://localhost:8888/detector/${productNumber}/${mac}/firmware`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        })
            .then(res => res.json())
            .then(data => { setFirmware(data.firmware) })
            .catch(err => console.log(err));

    }, []);


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {

                return (
                    <Space size="middle">
                        <a> Upgrade </a>
                    </Space>)

            }
        },

    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [loading, setLoading] = useState(false);


    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };



    return (
        <div>
            {firmware &&
                <Table columns={columns} dataSource={firmware ?? []} />
            }
        </div>
    )
}
