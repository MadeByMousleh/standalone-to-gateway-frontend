import { Card, Space, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { LuminariesCardContainer } from './styled'
import { useParams } from 'react-router-dom'
import { FaPowerOff } from "react-icons/fa";
import { IoBulbOutline, IoBulbSharp } from 'react-icons/io5';

export default function LuminariesPage() {

  const { mac } = useParams();

  const [data, setData] = useState([]);

  const columns = [
    {
      title: '',
      dataIndex: 'powerOn',
      key: 0,
      render: (powerOn) =>
        <>
          {powerOn ?  <IoBulbSharp color="#f5f106" size={25} /> : <IoBulbOutline color="#bdbdbd" size={25} />}
        </>
    },
    {
      title: 'Short Address',
      dataIndex: 'shortAddress',
      key: 1,
      render: (shortAddress) =>
        <p>{shortAddress}</p>,
    },
    {
      title: 'Zone',
      dataIndex: 'zone',
      key: 2,
      render: (zone) => <a>{zone}</a>,

    },
    {
      title: 'Active energy',
      dataIndex: 'activeEnergyData',
      key: 3,
      render: (activeEnergyData) => <p>{Math.round(activeEnergyData.activeEnergy)} {activeEnergyData.SIUnit}</p>,

    },

    {
      title: 'Operating time',
      dataIndex: 'operatingTimeText',
      key: 4,
      render: (operatingTimeText) => <p>{operatingTimeText}</p>,

    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => {
            if(record.powerOn)
            {
              turnOFFLuminary(record.shortAddress)
            }
            else {
              turnOnLuminary(record.shortAddress)
            }
          }}> <FaPowerOff /> </a>
          <a>Identify</a>
        </Space>
      ),
    },
  ];


  const turnOFFLuminary = async (shortAddress) => {

    let response = await fetch(`http://localhost:8888/api/v1/next-gen/controls/mac/${mac}`, {
      method: 'POST',
      body: JSON.stringify({
        shortAddress: shortAddress.toString().padStart(2, "0"),
      }),
      headers: { 'Content-type': 'application/json' }
    })

    let answer = await response.json();

    console.log(answer);

    if (answer.status === "success") {

      setData(prev => {

        const copy = [...prev];

        const shortAddress = +answer.shortAddress;

        const exists = copy.findIndex(p => p.shortAddress === shortAddress);

        console.log(exists, '"#################')

        if (exists !== -1) {
          copy[exists].powerOn = false;
          return [...copy]
        }

        return [...prev];
      })

    }

  }

  const turnOnLuminary = async (shortAddress) => {

    let response = await fetch(`http://localhost:8888/api/v1/next-gen/controls/mac/${mac}/on`, {
      method: 'POST',
      body: JSON.stringify({
        shortAddress: shortAddress.toString().padStart(2, "0"),
      }),
      headers: { 'Content-type': 'application/json' }
    })

    let answer = await response.json();

    console.log(answer);

    if (answer.status === "success") {

      setData(prev => {

        const copy = [...prev];

        const shortAddress = +answer.shortAddress;

        const exists = copy.findIndex(p => p.shortAddress === shortAddress);

        console.log(exists, '"#################')

        if (exists !== -1) {
          copy[exists].powerOn = true;
          return [...copy]
        }

        return [...prev];
      })

    }

  }

  useEffect(() => {

    const fetchLuminaries = async () => {
      const response = await fetch(`http://localhost:8888/api/v1/next-gen/info/mac/${mac}/luminaries/info`)
      const responseData = await response.json()
      setData(responseData);
    }
    fetchLuminaries();
  }, []);


  useEffect(() => {
    console.log(data)
  })
  return (
    <>
      {data.length > 0 &&
        <Table columns={columns} dataSource={data ?? []} />
      }
    </>
    // <LuminariesCardContainer>

    //   <div>
    //     <h3>Zone 1</h3>
    //     <div style={{ display: 'flex', columnGap: 60, justifyContent: 'space-evenly', border: '1px dashed #b3b3b3', padding: 20, borderRadius: "10px" }}>

    //       <Card onClick={() => turnOFFLuminary()} style={{ width: 150, height: 150, display: 'flex', cursor: 'pointer' }}>
    //         <h3>A0</h3>
    //       </Card>

    //       <Card style={{ width: 150, height: 150, display: 'flex', cursor: 'pointer' }}>
    //         <h3>A0</h3>
    //       </Card>

    //     </div>

    //   </div>

    //   <div>
    //     <h3>Zone 1</h3>
    //     <div style={{ display: 'flex', columnGap: 60, justifyContent: 'space-evenly', border: '1px dashed #b3b3b3', padding: 20, borderRadius: "10px" }}>

    //       <Card style={{ width: 150, height: 150, display: 'flex', cursor: 'pointer' }}>
    //         <h3>A0</h3>
    //       </Card>

    //       <Card style={{ width: 150, height: 150, display: 'flex', cursor: 'pointer' }}>
    //         <h3>A0</h3>
    //       </Card>

    //     </div>

    //   </div>

    //   <div>
    //     <h3>Zone 1</h3>
    //     <div style={{ display: 'flex', columnGap: 60, justifyContent: 'space-evenly', border: '1px dashed #b3b3b3', padding: 20, borderRadius: "10px" }}>

    //       <Card style={{ width: 150, height: 150, display: 'flex', cursor: 'pointer' }}>
    //         <h3>A0</h3>
    //       </Card>

    //       <Card style={{ width: 150, height: 150, display: 'flex', cursor: 'pointer' }}>
    //         <h3>A0</h3>
    //       </Card>

    //     </div>

    //   </div>


    // </LuminariesCardContainer>
  )
}
