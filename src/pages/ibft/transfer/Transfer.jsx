// import React from 'react'
import { useEffect, useState } from "react"
import { Button, NumberInput, Select, TextInput, Tooltip } from "@mantine/core"
import { ibftChannel, destinationType, fromAcc } from "../ibftConfig"
import classes from './Transfer.module.css'
import { IconCirclePlus, IconTrash } from "@tabler/icons-react"
import { fetchBankList, formatVietnamese, generateUID, validateInValidAmount, validateInvalidAccount } from "../../../services/Utilities"
import NotificationServices from "../../../services/notificationServices/NotificationServices"
import InquiryModal from "./InquiryModal"
const Transfer = () => {
    const [transactionChannelId, setTransactionChannelId] = useState(ibftChannel[0].value)
    const [destinationTypeId, setDestinationTypeId] = useState(destinationType[0].value)
    const [listFromBank, setListFromBank] = useState([{ value: '970406', label: 'TH Bank' }])
    const [fromBankId, setFromBankId] = useState(listFromBank[0].value)
    const [listToBank, setListToBank] = useState([{ value: '970406', label: 'TH Bank' }])
    const [toBankId, setToBankId] = useState(listToBank[0].value)
    const [fromAccount, setFromAccount] = useState(fromAcc[0].items[0].value)
    const [content, setContent] = useState('')
    const [showInquiryModal, setShowInquiryModal] = useState(true)
    const [inquiryData, setInquiryData] = useState({
        f60: "MB" / "QR",
        tranType: "00" / "20",
        fromAccount: "9704aaaaa" / "",
        content: "nội dung chuyển khoản",
        f32: "970405",
        f100: "970406",
        toBankList: [
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
            {
                f103: "6666688886",
                f4: 100000,
                f120: "NGUYEN VAN A DA CHUYEN TIEN",
                f63: "ref code",
                f39: "76",
                f11: "1234556"
            },
        ]
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

    const handleProcessTransaction = () => {
        console.log(listTransaction)
        const invalidAmount = listTransaction.some(item => validateInValidAmount(item.amount))
        if (invalidAmount) {
            NotificationServices.warning('Số tiền phải lớn hơn 2,000 và nhỏ hơn 500,000,000.')
            return
        }

        const invalidAccount = listTransaction.some(item => !validateInvalidAccount(item.toAccount))
        if (invalidAccount) {
            NotificationServices.warning('Số tài khoản/ Số thẻ không hợp lệ.')
            return
        }

        if (content.length > 210) {
            NotificationServices.warning('Nội dung chuyển khoản dài tối đa 210 ký tự.')
            return;
        }

        setShowInquiryModal(!showInquiryModal)
    }
    return (
        <div className="flex flex-col gap-2">
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
                <div className="flex w-full gap-2 items-center justify-between">
                    <p className="flex w-full m-0 p-0 font-semibold uppercase">Thông tin chuyển khoản</p>
                    <Tooltip label="Thêm giao dịch" color="#0ea5e9">
                        <IconCirclePlus stroke={1.5} size={24} className="flex fill-green-500 text-white cursor-pointer hover:fill-green-700 hover:scale-125 transaction ease-linear duration-200" onClick={handleAddTransaction} />
                    </Tooltip>
                </div>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-row w-full gap-2">
                        <p className="flex w-10">STT</p>
                        <p className="flex flex-1 justify-end">Số thẻ/ Số tài khoản</p>
                        <p className="flex flex-1 justify-end">Số tiền</p>
                        <p className="flex  w-10 justify-end">###</p>
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
                        <Button variant="filled" onClick={handleProcessTransaction} className="hover:bg-red-600">Xác nhận</Button>
                    </div>
                </div>
            </div>
            <InquiryModal data={inquiryData} opened={showInquiryModal} onClose={setShowInquiryModal} />
        </div>
    )
}

export default Transfer