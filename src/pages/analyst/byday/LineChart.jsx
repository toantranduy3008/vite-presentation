/* eslint-disable react/prop-types */
// import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = ({ data }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Biểu đồ thống kê số lượng giao dịch theo chiều ${data.viewType === '0' ? 'phát lệnh' : 'nhận lệnh'} từ ngày ${data.fromDate} đến ${data.toDate}`,
            },
            barStrokeWidth: 0,
        },
        skipNull: true,
        maintainAspectRatio: false
    };

    return <Line options={options} data={data.data} className='w-full h-full' />;
}

export default LineChart
