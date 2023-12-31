// import React from 'react'
import { useEffect, useState } from "react";
import { DatePickerInput } from "@mantine/dates"
import { Button, Select } from "@mantine/core";
// import { fetchBankList } from "../../../services/Utilities";
import classes from './InterBank.module.css'
import BarChart from "../byday/BarChart";
import dayjs from "dayjs";
const InterBank = () => {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    // const [listFromBank, setListFromBank] = useState([{ value: '970406', label: 'TH Bank' }])
    // const [fromBankId, setFromBankId] = useState(listFromBank[0].value)
    // const [listToBank, setListToBank] = useState([{ value: '970406', label: 'TH Bank' }])
    // const [toBankId, setToBankId] = useState(listToBank[0].value)
    const [viewType] = useState([
        {
            label: 'Phát lệnh',
            value: "0"
        },
        {
            label: 'Nhận lệnh',
            value: "1"
        }
    ])
    const [viewTypeId, setViewTypeId] = useState(viewType[0].value)
    const [barChartData, setBarChartData] = useState({
        fromDate: dayjs(fromDate).format('DD/MM/YYYY'),
        toDate: dayjs(toDate).format('DD/MM/YYYY'),
        viewType: "0",
        data: {
            labels: ['ACB', 'TCB'],
            datasets: [
                {
                    label: 'VCB',
                    data: [1000, 2000],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'TCB',
                    data: [2000, null],
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
                {
                    label: 'BIDV',
                    data: [3000, 5000],
                    backgroundColor: 'rgba(100, 100, 235, 0.5)',
                },
                {
                    label: 'ACB',
                    data: [null, 4000],
                    backgroundColor: 'rgba(53, 200, 150, 0.5)',
                },
            ],
        }
    })
    useEffect(() => {
        // const fetchData = async () => {
        //     const [acquirer, issuer] = await fetchBankList()
        //     setListFromBank(acquirer)
        //     setListToBank(issuer)
        // }

        // fetchData().catch((error) => console.log(error))
    }, [])
    const handleChangeFromDate = (e) => {
        if (e > toDate) setToDate(e)
        setFromDate(e)
    }
    const handleChangeToDate = (e) => {
        if (e < fromDate) setFromDate(e)
        setToDate(e)
    }

    const handleChangeViewType = (value) => {
        setViewTypeId(value)
    }

    // const handleChangeFromBank = (value) => {
    //     setFromBankId(value)
    // }

    // const handleChangeToBank = value => {
    //     setToBankId(value)
    // }

    const handleSearch = () => {
        setBarChartData({
            fromDate: dayjs(fromDate).format('DD/MM/YYYY'),
            toDate: dayjs(toDate).format('DD/MM/YYYY'),
            viewType: viewTypeId,
            data: {
                labels: ['ACB', 'TCB'],
                datasets: [
                    {
                        label: 'VCB',
                        data: [1000, 2000],
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                    {
                        label: 'TCB',
                        data: [2000, null],
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                    {
                        label: 'BIDV',
                        data: [3000, 5000],
                        backgroundColor: 'rgba(100, 100, 235, 0.5)',
                    },
                    {
                        label: 'ACB',
                        data: [null, 4000],
                        backgroundColor: 'rgba(53, 200, 150, 0.5)',
                    },
                ],
            }
        })
    }
    return (
        <div className="relative flex flex-col gap-2">
            <section id="search" className="flex flex-col md:flex-row justify-center items-end gap-2">
                <div className="flex flex-1 w-full">
                    <DatePickerInput
                        valueFormat="DD/MM/YYYY"
                        label="Từ ngày"
                        value={fromDate}
                        onChange={handleChangeFromDate}
                        size="sm"
                        maxDate={toDate}
                        classNames={{
                            input: classes.input,
                            wrapper: classes.wrapper,
                            root: classes.root
                        }}
                    />
                </div>
                <div className="flex flex-1 w-full">
                    <DatePickerInput
                        valueFormat="DD/MM/YYYY"
                        label="Đến ngày"
                        value={toDate}
                        onChange={handleChangeToDate}
                        size="sm"
                        maxDate={new Date()}
                        classNames={{
                            input: classes.input,
                            wrapper: classes.wrapper,
                            root: classes.root
                        }}
                    />
                </div>
                <div className="flex flex-1 w-full">
                    <Select
                        label="Theo chiều"
                        data={viewType}
                        value={viewTypeId}
                        searchable
                        nothingFoundMessage="Không tìm thấy ..."
                        className="w-full"
                        maxDropdownHeight={200}
                        onChange={handleChangeViewType}
                    />
                </div>
                {/* <div className="flex flex-1 w-full">
                    <Select
                        label="Ngân hàng phát lệnh"
                        data={listFromBank}
                        value={fromBankId}
                        searchable
                        nothingFoundMessage="Không tìm thấy ..."
                        className="w-full"
                        maxDropdownHeight={200}
                        onChange={handleChangeFromBank}
                    />
                </div>
                <div className="flex flex-1 w-full">
                    <Select
                        label="Ngân hàng nhận lệnh"
                        data={listToBank}
                        value={toBankId}
                        searchable
                        nothingFoundMessage="Không tìm thấy ..."
                        className="w-full"
                        maxDropdownHeight={200}
                        onChange={handleChangeToBank}
                    />
                </div> */}
                <div className="flex ">
                    <Button variant="filled" onClick={handleSearch}>Tìm kiếm</Button>
                </div>
            </section>
            <section id="chart" className="relative bg-white flex w-full h-full md:h-96 rounded-sm shadow-md hover:shadow-xl transaction duration-200">
                <BarChart data={barChartData} />
            </section>
        </div>
    )
}

export default InterBank