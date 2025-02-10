import { Card } from 'antd'
import React from 'react'
import { LuminariesCardContainer } from './styled'
import { useParams } from 'react-router-dom'

export default function LuminariesPage() {

  const { mac } = useParams();

  console.log(mac)

  const turnOnLuminary = () => {

    fetch(`http://localhost:8888/api/v1/next-gen/controls/mac/${mac}`, {
      method: 'POST',
      body: JSON.stringify({
        shortAddress: '00',
      }),
      headers: { 'Content-type': 'application/json' }
    })

  }

  return (
    <LuminariesCardContainer>

      <div>
        <h3>Zone 1</h3>
        <div style={{ display: 'flex', columnGap: 60, justifyContent: 'space-evenly', border: '1px dashed #b3b3b3', padding: 20, borderRadius: "10px" }}>

          <Card onClick={() => turnOnLuminary()} style={{ width: 150, height: 150, display: 'flex', cursor: 'pointer' }}>
            <h3>A0</h3>
          </Card>

          <Card style={{ width: 150, height: 150, display: 'flex', cursor: 'pointer' }}>
            <h3>A0</h3>
          </Card>

        </div>

      </div>

      <div>
        <h3>Zone 1</h3>
        <div style={{ display: 'flex', columnGap: 60, justifyContent: 'space-evenly', border: '1px dashed #b3b3b3', padding: 20, borderRadius: "10px" }}>

          <Card style={{ width: 150, height: 150, display: 'flex', cursor: 'pointer' }}>
            <h3>A0</h3>
          </Card>

          <Card style={{ width: 150, height: 150, display: 'flex', cursor: 'pointer' }}>
            <h3>A0</h3>
          </Card>

        </div>

      </div>

      <div>
        <h3>Zone 1</h3>
        <div style={{ display: 'flex', columnGap: 60, justifyContent: 'space-evenly', border: '1px dashed #b3b3b3', padding: 20, borderRadius: "10px" }}>

          <Card style={{ width: 150, height: 150, display: 'flex', cursor: 'pointer' }}>
            <h3>A0</h3>
          </Card>

          <Card style={{ width: 150, height: 150, display: 'flex', cursor: 'pointer' }}>
            <h3>A0</h3>
          </Card>

        </div>

      </div>


    </LuminariesCardContainer>
  )
}
