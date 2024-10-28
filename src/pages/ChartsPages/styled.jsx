import React from 'react';
import { Line } from 'react-chartjs-2';
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

        if(random < 0.5)
            {
                arr.push(0)

            }else {
                arr.push(1)
            }
        

    }

    return arr;
}
const ChartPages = () => {

    const labels = createHour('08');
    console.log(labels)

    const data = {
        labels: labels,

        datasets: [{
            label: 'My First Dataset',
            data: createPirHourData(),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const config = {
        type: 'line',
        data: data,
    };

    return (<Line data={data}></Line>)

}

export default ChartPages;
