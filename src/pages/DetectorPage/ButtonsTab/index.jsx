import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import WiredPushButtonList from '../../../telegrams/v1/wiredPushButton/WiredPushButtonList';
import WiredButtonCard from './WiredButtonCard';
import GeneralHelper from '../../../generalHelpers/helper';
console.log("YOYO from buttons page")

export default function ButtonsTab() {

    const params = useParams();
    const { mac, productNumber } = params;
    const [productInfo, setProductInfo] = useState(GeneralHelper.extractProductInfo(productNumber));
    const [wiredPushButtonList, setWiredButtonPushButtonList] = useState();


    useEffect(() => {
        fetch(`http://localhost:8888/detector/${productNumber}/${mac}/wired-push-button-list`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        })
            .then(res => res.json())
            .then(reply => {
                let wiredPushButtonList = new WiredPushButtonList(reply.data.value);
                setWiredButtonPushButtonList(wiredPushButtonList);
            })

    }, []);

    return (
        <>
            {wiredPushButtonList &&
                <div>
                    <WiredButtonCard
                        number={1}
                        wiredPushButton={wiredPushButtonList.wiredPushButtonOne}
                        typeOfDetector={productInfo.technology}
                        buttonsList={wiredPushButtonList}
                    />

                    <WiredButtonCard
                        number={2}
                        wiredPushButton={wiredPushButtonList.wiredPushButtonTwo}
                        typeOfDetector={productInfo.technology}
                        buttonsList={wiredPushButtonList}
                    />

                    <WiredButtonCard
                        number={3}
                        wiredPushButton={wiredPushButtonList.wiredPushButtonThree}
                        typeOfDetector={productInfo.technology}
                        buttonsList={wiredPushButtonList}
                    />

                    <WiredButtonCard
                        number={4}
                        wiredPushButton={wiredPushButtonList.wiredPushButtonFour}
                        typeOfDetector={productInfo.technology}
                        buttonsList={wiredPushButtonList}
                    />

                </div>
            }
        </>
    )
}
