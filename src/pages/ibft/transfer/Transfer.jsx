// import React from 'react'
import { useEffect, useState } from "react"
import { Button, LoadingOverlay, NumberInput, Select, Switch, TextInput, Tooltip } from "@mantine/core"
import { ibftChannel, destinationType, fromAcc } from "../ibftConfig"
import classes from './Transfer.module.css'
import { IconCirclePlus, IconTrash } from "@tabler/icons-react"
import { fetchBankList, formatVietnamese, generateUID, validateInValidAmount, validateInvalidAccount } from "../../../services/Utilities"
import NotificationServices from "../../../services/notificationServices/NotificationServices"
import TransactionModal from "./TransactionModal"
import { authHeader } from "../../../services/AuthServices"
import axios from "axios"
const Transfer = () => {
    const [transactionChannelId, setTransactionChannelId] = useState(ibftChannel[0].value)
    const [destinationTypeId, setDestinationTypeId] = useState(destinationType[0].value)
    const [listFromBank, setListFromBank] = useState([{ value: '970406', label: 'TH Bank' }])
    const [fromBankId, setFromBankId] = useState(listFromBank[0].value)
    const [listToBank, setListToBank] = useState([{ value: '970406', label: 'TH Bank' }])
    const [toBankId, setToBankId] = useState(listToBank[0].value)
    const [fromAccount, setFromAccount] = useState(fromAcc[0].items[0].value)
    const [content, setContent] = useState('')
    const [showInquiryModal, setShowInquiryModal] = useState(false)
    const [loadingInquiry, setLoadingInquiry] = useState(false)
    const [abortInquiry, setAbortInquiry] = useState(true)
    const [responseModel, setResponseModel] = useState({
        f60: transactionChannelId,
        tranType: destinationTypeId,
        fromAccount: fromAccount,
        f32: fromBankId,
        f100: toBankId,
        f104: content,
        toBankList: [{
            f4: '',
            f63: '',
            f103: '',
            f120: '',
            inquiryResult: {
                f11: '',
                f39: '',
                f63: ''
            },
            transferResult: {
                f11: '',
                f39: '',
                f63: ''
            }
        }]
    })

    const [listTransaction, setListTransaction] = useState([
        {
            hash: generateUID(),
            toAccount: '',
            amount: 0
        }
    ])

    useEffect(() => {
        const fetchData = async () => {
            const [acquirer, issuer] = await fetchBankList()
            setListFromBank(acquirer)
            setListToBank(issuer)
        }

        fetchData().catch((error) => console.log(error))
    }, [])

    const hanldeChangeChannel = (value) => {
        setTransactionChannelId(value)
    }

    const handleChangeDestination = (value) => {
        setDestinationTypeId(value)
    }

    const handleChangeFromBank = (value) => {
        setFromBankId(value)
    }

    const handleChangeToBank = value => {
        setToBankId(value)
    }

    const handleChangeFromAcc = value => {
        setFromAccount(value)
    }

    const handleChangeContent = e => {
        const content = formatVietnamese(e.target.value)
        setContent(content)
    }

    const handleAddTransaction = () => {
        setListTransaction(current => [...current, {
            hash: generateUID(),
            toAccount: '',
            amount: 0
        }])
    }

    const handleResetTransaction = () => {
        setListTransaction([
            {
                hash: generateUID(),
                toAccount: '',
                amount: 0
            }
        ])
    }

    const handleRemoveTransaction = (e, index, hash) => {
        if (listTransaction.length <= 1) {
            NotificationServices.warning('Phải có ít nhất 1 giao dịch')
            return
        }

        if (index !== -1) {
            setListTransaction(listTransaction.filter(item => item.hash !== hash))
        }
    }

    const handleChangeDetailAccount = (data, index, hash) => {
        if (index !== -1) {
            const newListTransaction = [listTransaction.find(item => item.hash === hash).toAccount = data.target.value, ...listTransaction].slice(1)
            setListTransaction(newListTransaction)
        }
    }

    const handleChangeDetailAmount = (data, index, hash) => {
        if (index !== -1) {
            const newListTransaction = [listTransaction.find(item => item.hash === hash).amount = data, ...listTransaction].slice(1)
            setListTransaction(newListTransaction)
        }
    }

    const validateRequest = () => {
        const invalidAmount = listTransaction.some(item => validateInValidAmount(item.amount))
        if (invalidAmount) {
            NotificationServices.warning('Số tiền phải lớn hơn 2,000 và nhỏ hơn 500,000,000.')
            return false;
        }

        const invalidAccount = listTransaction.some(item => !validateInvalidAccount(item.toAccount))
        if (invalidAccount) {
            NotificationServices.warning('Số tài khoản/ Số thẻ không hợp lệ.')
            return false;
        }

        if (content.length > 210) {
            NotificationServices.warning('Nội dung chuyển khoản dài tối đa 210 ký tự.')
            return false;
        }

        return true
    }

    const handleProcessTransaction = () => {
        const valid = validateRequest()
        if (!valid) return
        if (abortInquiry) {
            handleProcessTransfer()
        }
        else {
            handleProcessInquiryAndTransfer()
        }
    }

    const handleProcessTransfer = async (inquiryData = null, responseInquiryData = null, loading = false) => {
        let request, response
        response = request = {
            f60: transactionChannelId,
            tranType: destinationTypeId,
            fromAccount: fromAccount,
            f32: fromBankId,
            f100: toBankId,
            f104: content,
            toBankList: listTransaction.map(item => {
                return {
                    f4: item.amount,
                    f103: item.toAccount
                }
            })
        }
        if (inquiryData) request = inquiryData
        if (responseInquiryData) response = responseInquiryData
        const fetchTransferData = async () => {
            for (let i = 0; i < request.toBankList.length; i++) {
                const requestBody = { ...request, toBankList: request.toBankList.filter((item, index) => index === i) }
                await axios.post('/1st/bankdemo/api/payment/fundTransferList10', requestBody, { headers: authHeader() })
                    .then(res => {
                        const { f11, f39, f63, f120 } = res.data[0]
                        response.toBankList[i]['transferResult'] = {
                            f11: f11,
                            f39: f39,
                            f63: f63,
                            f120: f120
                        }
                    })
                    .catch(err => {
                        console.log(err.response)
                        response.toBankList[i]['transferResult'] = {
                            f11: '',
                            f39: '',
                            f63: '',
                            f120: ''
                        }
                    })
            }
        }
        if (!loading) setLoadingInquiry(true)
        fetchTransferData()
            .then(() => {
                setResponseModel(response)
            })
            .then(() => setShowInquiryModal(!showInquiryModal))
            .finally(() => { setLoadingInquiry(false) })
    }

    const handleProcessInquiryAndTransfer = async () => {
        let request, response
        request = response = {
            f60: transactionChannelId,
            tranType: destinationTypeId,
            fromAccount: fromAccount,
            f32: fromBankId,
            f100: toBankId,
            f104: content,
            toBankList: listTransaction.map(item => {
                return {
                    f4: item.amount,
                    f103: item.toAccount
                }
            })
        }
        const fetchInquiryData = async () => {
            for (let i = 0; i < request.toBankList.length; i++) {
                const requestBody = { ...request, toBankList: request.toBankList.filter((item, index) => index === i) }
                await axios.post('/1st/bankdemo/api/payment/fundInquiryList10', requestBody, { headers: authHeader() })
                    .then(res => {
                        const { f11, f39, f63, f120 } = res.data[0]
                        request.toBankList[i].f63 = f63
                        request.toBankList[i].f120 = f120
                        response.toBankList[i]['inquiryResult'] = {
                            f11: f11,
                            f39: f39,
                            f63: f63,
                            f120: f120
                        }
                    })
                    .catch(err => {
                        console.log(err.response)
                        response.toBankList[i]['inquiryResult'] = {
                            f11: '',
                            f39: '',
                            f63: '',
                            f120: ''
                        }
                    })
            }
        }

        setLoadingInquiry(true)
        fetchInquiryData()
            .then(() => {
                handleProcessTransfer(request, response, true)
            })
            .catch((error) => console.log('error', error))
    }

    return (
        <div className="relative flex flex-col gap-2">
            <LoadingOverlay visible={loadingInquiry} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <div className="flex flex-col md:flex-row gap-2 w-full">
                <section className="flex flex-row md:flex-col gap-2 w-full md:w-1/3">
                    <Select
                        label="Kênh giao dịch"
                        data={ibftChannel}
                        value={transactionChannelId}
                        searchable
                        nothingFoundMessage="Không tìm thấy ..."
                        className="w-1/2 md:w-full"
                        onChange={hanldeChangeChannel}
                    />

                    <Select
                        label="Tới"
                        data={destinationType}
                        value={destinationTypeId}
                        searchable
                        nothingFoundMessage="Không tìm thấy ..."
                        className="w-1/2 md:w-full"
                        onChange={handleChangeDestination}
                    />
                </section>
                <section className="flex flex-row md:flex-col gap-2 w-full md:w-1/3">
                    <Select
                        label="Ngân hàng phát lệnh"
                        data={listFromBank}
                        value={fromBankId}
                        searchable
                        nothingFoundMessage="Không tìm thấy ..."
                        className="w-1/2 md:w-full"
                        maxDropdownHeight={200}
                        onChange={handleChangeFromBank}
                    />

                    <Select
                        label="Ngân hàng nhận lệnh"
                        data={listToBank}
                        value={toBankId}
                        searchable
                        nothingFoundMessage="Không tìm thấy ..."
                        className="w-1/2 md:w-full"
                        maxDropdownHeight={200}
                        onChange={handleChangeToBank}
                    />
                </section>
                <section className="flex flex-row md:flex-col gap-2 w-full md:w-1/3">
                    <Select
                        label="Từ thẻ/ tài khoản"
                        data={fromAcc}
                        value={fromAccount}
                        searchable
                        nothingFoundMessage="Không tìm thấy ..."
                        className="w-1/2 md:w-full"
                        onChange={handleChangeFromAcc}
                    />

                    <TextInput
                        label="Nội dung"
                        placeholder="Nội dung chuyển khoản"
                        value={content}
                        onChange={handleChangeContent}
                    />
                </section>
            </div>
            <div className="flex flex-col w-full md:w-1/2 gap-2">
                <div className="flex flex-col w-full gap-2 items-center justify-between">
                    <p className="flex w-full m-0 p-0 font-semibold uppercase">Thông tin chuyển khoản</p>
                    <div className="flex w-full justify-between items-center">
                        <Switch
                            size="sm" onLabel="ON" offLabel="OFF"
                            label="Bỏ qua vấn tin"
                            checked={abortInquiry}
                            onChange={(event) => setAbortInquiry(event.currentTarget.checked)}
                        />
                        <Tooltip label="Thêm giao dịch" color="#0ea5e9">
                            <IconCirclePlus stroke={1.5} size={24} className="flex fill-green-500 text-white cursor-pointer hover:fill-green-700 hover:scale-125 transaction ease-linear duration-200" onClick={handleAddTransaction} />
                        </Tooltip>
                    </div>

                </div>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-row w-full gap-2">
                        <div className="flex w-10">STT</div>
                        <div className="flex flex-1 justify-end text-right">Số thẻ/ Số tài khoản</div>
                        <div className="flex flex-1 justify-end text-right">Số tiền</div>
                        <div className="flex  w-10 justify-end">###</div>
                    </div>
                    <div className="flex flex-col gap-2 max-h-80 overflow-y-auto ">
                        {
                            listTransaction.map((item, index) => (
                                <div key={item.hash} className="flex w-full gap-2 justify-center items-center">
                                    <div className="flex w-10">{index + 1}</div>
                                    <div className="flex flex-1 justify-end">
                                        <TextInput
                                            placeholder="Số thẻ/ Số tài khoản"
                                            className="flex flex-row flex-grow justify-end text-base"
                                            value={item.toAccount}
                                            onChange={(data) => handleChangeDetailAccount(data, index, item.hash)}
                                            classNames={{
                                                input: classes.input,
                                                wrapper: classes.wrapper
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-1 justify-end">
                                        <NumberInput
                                            placeholder="Số tiền"
                                            className="flex flex-row flex-grow justify-end text-base"
                                            classNames={{
                                                input: classes.input,
                                                wrapper: classes.wrapper
                                            }}
                                            value={item.amount}
                                            onChange={(data) => handleChangeDetailAmount(data, index, item.hash)}
                                            allowNegative={false}
                                            thousandSeparator=","
                                            hideControls
                                        />
                                    </div>
                                    <div className="flex w-10 items-center justify-end">
                                        <IconTrash className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer" onClick={(e) => handleRemoveTransaction(e, index, item.hash)} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex w-full gap-2 mt-2 justify-end items-center">
                        <Button variant="filled" onClick={handleResetTransaction} className="hover:bg-red-600">Reset</Button>
                        <Button variant="filled" onClick={handleProcessTransaction} className="hover:bg-teal-600">Xác nhận</Button>

                    </div>
                </div>
            </div>
            <TransactionModal data={responseModel} abortInquiry={abortInquiry} opened={showInquiryModal} onClose={setShowInquiryModal} />
        </div>
    )
}

export default Transfer