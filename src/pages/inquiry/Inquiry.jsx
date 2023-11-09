import { ActionIcon, Divider, TextInput, LoadingOverlay } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates"
import { useState } from "react";
import classes from './Inquiry.module.css'
import { IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs"
import { authHeader } from "../../services/AuthServices";
import NotificationServices from "../../services/notificationServices/NotificationServices";
import axios from "axios"
const Inquiry = () => {
    const [date, setDate] = useState(new Date());
    const [refCode, setRefCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    const handleChangeDate = (e) => {
        setDate(e)
    }

    const handleChangeRefCode = (e) => {
        setRefCode(e.target.value)
    }

    const handleSearchTransaction = () => {
        setLoading(true)
        const dateS = `${dayjs(date).get('date')}`.length === 1 ? `0${dayjs(date).get('date')}` : `${dayjs(date).get('date')}`
        const monthS = `${dayjs(date).get('month') + 1}`.length === 1 ? `0${dayjs(date).get('month') + 1}` : `${dayjs(date).get('month') + 1}`
        const requestBody = {
            f13: `${monthS}${dateS}`
        }

        axios.post('/1st/bankdemo/api/payment/tranStatus', requestBody, { headers: authHeader() })
            .then(res => {
                setData(res.data.payload)
                if (res.data.payload.length === 0) {
                    NotificationServices.info(`Không tìm thấy giao dịch`)
                }

            })
            .catch(err => {
                const { status, statusText } = err.response
                NotificationServices.error(`${status}: ${statusText}`)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    return (
        <div className="relative flex flex-col min-h-screen w-full items-center ">
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <div className="flex h-14 max-h-24 w-full max-w-md bg-white items-center rounded-md p-2 gap-2 shadow-md xs:shadow-none lg:shadow-md xs:p-1 lg:p-2 transition duration-300 hover:shadow-xl">
                <DatePickerInput
                    valueFormat="DD/MM/YYYY"
                    value={date}
                    onChange={handleChangeDate}
                    size="sm"
                    fullWidth
                    classNames={{
                        input: classes.input,
                        wrapper: classes.wrapper,
                        root: classes.root
                    }}
                />
                <Divider variant="dashed" orientation="vertical" />
                <TextInput
                    placeholder="Mã giao dịch"
                    value={refCode}
                    onChange={handleChangeRefCode}
                    size="sm"
                    className="flex flex-1"
                    classNames={{
                        input: classes.input,
                        wrapper: classes.wrapper,
                        root: classes.root
                    }}
                />
                <ActionIcon
                    variant="default"
                    size="xl"
                    radius={"xl"}
                    className="border-none hover:bg-indigo-400 hover:text-white"
                    onClick={handleSearchTransaction}
                >
                    <IconSearch stroke={1.5} />
                </ActionIcon>
            </div>
        </div>
    )
}

export default Inquiry