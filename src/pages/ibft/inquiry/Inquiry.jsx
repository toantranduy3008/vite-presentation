import { ActionIcon, Divider, TextInput, LoadingOverlay, Tooltip, Accordion } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates"
import { Suspense, useEffect, useState } from "react";
import classes from './Inquiry.module.css'
import { IconDiscountCheck, IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs"
import { authHeader } from "../../../services/AuthServices";
import NotificationServices from "../../../services/notificationServices/NotificationServices";
import axios from "axios"
import { setBadge, numberWithCommas } from "../../../services/Utilities";
const Inquiry = () => {
    const [date, setDate] = useState(new Date());
    const [refCode, setRefCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => {
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
                setData([])
                const { status, statusText } = err.response
                NotificationServices.error(`${status}: ${statusText}`)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

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
            f13: `${monthS}${dateS}`,
            f63: refCode.trim()
        }

        setTimeout(() => {
            axios.post('/1st/bankdemo/api/payment/tranStatus', requestBody, { headers: authHeader() })
                .then(res => {
                    setData(res.data.payload)
                    if (res.data.payload.length === 0) {
                        NotificationServices.info(`Không tìm thấy giao dịch`)
                    }

                })
                .catch(err => {
                    setData([])
                    const { status, statusText } = err.response
                    NotificationServices.error(`${status}: ${statusText}`)
                })
                .finally(() => {
                    setLoading(false)
                })
        }, 3000)

        // axios.post('/1st/bankdemo/api/payment/tranStatus', requestBody, { headers: authHeader() })
        //     .then(res => {
        //         setData(res.data.payload)
        //         if (res.data.payload.length === 0) {
        //             NotificationServices.info(`Không tìm thấy giao dịch`)
        //         }

        //     })
        //     .catch(err => {
        //         setData([])
        //         const { status, statusText } = err.response
        //         NotificationServices.error(`${status}: ${statusText}`)
        //     })
        //     .finally(() => {
        //         setLoading(false)
        //     })
    }
    return (
        <div className="relative flex flex-col min-h-screen w-full items-center gap-4">
            {/* <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} /> */}
            <div
                className="flex h-14 max-h-24 w-full max-w-md border border-solid border-slate-300 bg-white items-center rounded-md p-2 gap-2 shadow-md xs:shadow-none lg:shadow-md xs:p-1 lg:p-2 ring-0
                hover:shadow-xl
                hover:ring-offset-2
                hover:ring-indigo-700
                hover:ring-2
                transition duration-300"
            >
                <DatePickerInput
                    valueFormat="DD/MM/YYYY"
                    value={date}
                    onChange={handleChangeDate}
                    size="sm"
                    classNames={{
                        input: classes.input,
                        wrapper: classes.wrapper,
                        root: classes.root
                    }}
                />
                <Divider variant="dashed" orientation="vertical" />
                <TextInput
                    placeholder="Số tham chiếu (Ref ID)"
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
            <div className="flex flex-col w-full h-full max-w-full overflow-x-auto justify-center items-start text-sm">
                <Suspense fallback={<div>Loading Posts...</div>}>
                    <Accordion variant="contained" radius="lg" className="flex flex-col w-full h-full">
                        <Accordion.Item value="#" className="flex flex-col w-full dark:bg-slate-500" key="#">
                            <Accordion.Control chevron={<></>}>
                                <div className="flex flex-row w-full gap-2 text-sm">
                                    <p className="flex shrink w-10 xs:hidden lg:flex justify-start items-center font-semibold capitalize">STT</p>
                                    <p className="flex flex-1 justify-start items-center font-semibold capitalize">Số tham chiếu</p>
                                    <p className="flex flex-1 xs:hidden lg:flex justify-start items-center font-semibold capitalize">Số lưu vết</p>
                                    <p className="flex flex-1 xs:hidden lg:flex justify-start items-center font-semibold capitalize">Ngân hàng chuyển</p>
                                    <p className="flex flex-1 xs:hidden lg:flex justify-start items-center font-semibold capitalize">Ngân hàng nhận</p>
                                    <p className="flex flex-1 justify-start items-center font-semibold capitalize">Trạng thái tại Napas</p>
                                    <p className="flex flex-1 justify-start items-center font-semibold capitalize">Số tiền</p>
                                    <p className="flex flex-1 xs:hidden lg:flex justify-start items-center font-semibold capitalize">Thời gian GD</p>
                                </div>
                            </Accordion.Control>
                        </Accordion.Item>
                        {data.map((item, index) => (
                            <Accordion.Item value={item.trace_no} className="flex flex-col w-full dark:bg-slate-500" key={item.trace_no}>
                                <Accordion.Control>
                                    <div className="flex flex-row w-full gap-2 text-sm">
                                        <p className="flex shrink w-10 xs:hidden lg:flex justify-start items-center">{`${data.length > 1 ? index + 1 : '1'}`}</p>
                                        <p className="flex flex-1 justify-start items-center">{item.ref_code}</p>
                                        <p className="flex flex-1 xs:hidden lg:flex justify-start items-center">{item.trace_no}</p>
                                        <p className="flex flex-1 xs:hidden lg:flex justify-start items-center">Vina Bank</p>
                                        <p className="flex flex-1 xs:hidden lg:flex justify-start items-center">Đông Á Bank</p>
                                        <p className="flex flex-1 justify-start items-center">{setBadge(item.respcode)}</p>
                                        <p className="flex flex-1 justify-start items-center">{numberWithCommas(item.amount)}</p>
                                        <p className="flex flex-1 xs:hidden lg:flex justify-start items-center">{item.local_time}</p>
                                    </div>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <div className="flex flex-row xs:flex-col lg:flex-row justify-center items-start w-full gap-2">
                                        {/* cột trái */}
                                        <div className="flex flex-col lg:flex-1 xs:w-full">
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Ngân hàng phát lệnh</p>
                                                    <p className="flex flex-1 justify-start items-center">Vina Bank</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Tài khoản gửi</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.from_account}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Hình thức chuyển khoản</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.f60 === '99' ? 'Mã QR' : 'Thông thường'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Ngày giao dịch</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.local_time}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Trạng thái tại Napas</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.respcode ? setBadge(item.respcode) : 'Không phản hồi'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Số tiền giao dịch</p>
                                                    <p className="flex flex-1 justify-start items-center">{numberWithCommas(item.amount)}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Số tham chiếu (Ref ID)</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.ref_code}</p>
                                                </div>
                                            </div>

                                        </div>

                                        <Divider size="xs" variant="dashed" orientation="vertical" className="xs:hidden lg:block" />
                                        {/* cột phải */}
                                        <div className="flex flex-col xs:flex lg:flex-1 xs:w-full">
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Ngân hàng nhận lệnh</p>
                                                    <p className="flex flex-1 justify-start items-center">Đông Á Bank</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Tài khoản nhận</p>
                                                    <Tooltip label="Tài khoản đã xác minh" color="#0ea5e9">
                                                        <p className="flex flex-1 justify-start items-center cursor-pointer hover:text-sky-500">{item.to_account} {item.f60 === '99' && <IconDiscountCheck className="flex fill-sky-500 text-white items-start justify-center" />}</p>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Tên người nhận</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.f120}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Ngày quyết toán</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.local_time.split(' ')[0]}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Trạng thái tại NHNL</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.ben_respcode === '63' ? '' : setBadge(item.ben_respcode)}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Nội dung chuyển tiền</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.trans_content}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Số lưu vết</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.trace_no}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Suspense>

            </div>
        </div>
    )
}

export default Inquiry