import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);


const createHour = (hour) => {

    let arr = [];

    for (let i = 0; i < 60; i++) {
        arr.push(`${hour}:${i < 10 ? `0${i}` : i}`)
    }

    return arr;
}

const createPirHourData = () => {

    let arr = [];

    for (let i = 0; i < 60; i++) {

        let random = Math.random();

        if (random < 0.5) {
            arr.push(0)

        } else {
            arr.push(1)
        }


    }

    return arr;
}


const createFakeData = () => {
    const timeArr = [];

    for (let i = 0; i < 24; i++) {
        timeArr.push(i);
    }


}
const ChartPages = () => {

    const labels = createHour('08');


    const data = {
        datasets: [{
            label: 'Scatter Dataset',
            data: [
                { x: 1, y: 1 },
                { x: 1.20, y: 1 },
                { x: 1.22, y: 1 },
                { x: 1.45, y: 1 },

                { x: 2, y: 1 },
                { x: 3, y: 0 },
                { x: 4, y: 1 },
                { x: 5, y: 0 },
                { x: 6, y: 1 },
                { x: 7, y: 0 },
                { x: 8, y: 1 },
                { x: 9, y: 1 },
                { x: 10, y: 1 },
                { x: 11, y: 1 },
                { x: 12, y: 1 },
                { x: 13, y: 1 },
                { x: 14, y: 1 },
                { x: 15, y: 1 },
                { x: 16, y: 1 },
                { x: 17, y: 1 },
                { x: 18, y: 1 },
                { x: 19, y: 1 },
                { x: 20, y: 1 },
                { x: 21, y: 1 },
                { x: 22, y: 1 },
                { x: 23, y: 1 },
                { x: 24, y: 1 },



            ],
            backgroundColor: 'rgb(255, 99, 132)'
        }],
    };


    return (<Scatter data={data}></Scatter>)

}

export default ChartPages;
