/* eslint-disable react/prop-types */
// import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = ({ data }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Biểu đồ giao dịch liên ngân hàng theo chiều ${data.viewType === '0' ? 'phát lệnh' : 'nhận lệnh'} từ ngày ${data.fromDate} đến ${data.toDate}`,
            },
            barStrokeWidth: 0,
        },
        skipNull: true,
        maintainAspectRatio: false
    };
    return <Bar options={options} data={data.data} className='w-full h-full' />;
}

export default BarChart


