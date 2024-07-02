// import { Radio, Space } from 'antd'
// import React, { useCallback, useState } from 'react'

// export default function TelegramRadioGroup({ byteTelegram }) {
//     // const [telegram, setTelegram] = useState(byteTelegram);
//     const [bitSelected, setBitSelected] = useState(4);

//     // const onBitChange = useCallback((e) => {

//     //     console.log(e);
//     // }, []);

//     Object.entries(byteTelegram).map((s) =>  [
//         console.log(s)
//     ])
//     console.log(byteTelegram, 'BYTETELEGRAM')
//     return (
//         <>
//             {byteTelegram &&
//                 <Radio.Group
//                     onChange={setBitSelected}
//                     value={bitSelected}>
//                     <Space direction="vertical">
//                         {Object.entries(byteTelegram).map(([key, value]) => (
//                             <>
//                                 {(value.bit === 6 || value.bit === 5) &&
//                                     <Radio value={value.bit}>{value.description}</Radio>
//                                 }
//                             </>
//                         ))}
//                     </Space>
//                 </Radio.Group>
//             }
//         </>
//     )
// }
