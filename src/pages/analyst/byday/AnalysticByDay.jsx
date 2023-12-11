// import React from 'react'
import { useEffect, useState } from "react";
import { DatePickerInput } from "@mantine/dates"
import BarChart from "./BarChart"
import classes from './AnalystByDay.module.css'
import { Button, Select } from "@mantine/core";
import { fetchBankList } from "../../../services/Utilities";
import LineChart from "./LineChart";

const AnalysticByDay = () => {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [listFromBank, setListFromBank] = useState([{ value: '970406', label: 'TH Bank' }])
    const [fromBankId, setFromBankId] = useState(listFromBank[0].value)
    const [listToBank, setListToBank] = useState([{ value: '970406', label: 'TH Bank' }])
    const [toBankId, setToBankId] = useState(listToBank[0].value)
    useEffect(() => {
        const fetchData = async () => {
            const [acquirer, issuer] = await fetchBankList()
            setListFromBank(acquirer)
            setListToBank(issuer)
        }

        fetchData().catch((error) => console.log(error))
    }, [])
    const handleChangeFromDate = (e) => {
        setFromDate(e)
    }
    const handleChangeToDate = (e) => {
        setToDate(e)
    }
    const handleChangeFromBank = (value) => {
        setFromBankId(value)
    }

    const handleChangeToBank = value => {
        setToBankId(value)
    }

    return (
        <div className='flex flex-col w-full gap-2 xs:gap-2 lg:gap-2 justify-start items-center'>
            <div className="flex flex-col w-full gap-2">
                <div className="relative flex flex-col xl:flex-row w-full gap-2 justify-center items-end">
                    <div className="flex flex-1 w-full">
                        <DatePickerInput
                            valueFormat="DD/MM/YYYY"
                            label="Từ ngày"
                            value={fromDate}
                            onChange={handleChangeFromDate}
                            size="sm"
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
                            classNames={{
                                input: classes.input,
                                wrapper: classes.wrapper,
                                root: classes.root
                            }}
                        />
                    </div>
                    <div className="flex flex-1 w-full">
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
                    </div>
                    <div className="flex ">
                        <Button variant="filled">Tìm kiếm</Button>
                    </div>
                </div>
                <div className="relative flex flex-grow w-full max-h-max md:max-h-96 bg-white p-2 justify-center items-center">
                    <BarChart />
                </div>
                <div className="relative flex flex-grow w-full max-h-max md:max-h-96 md:h-96 bg-white p-2 justify-center items-center">
                    <LineChart />
                </div>
            </div>
        </div>
    )
}

export default AnalysticByDay