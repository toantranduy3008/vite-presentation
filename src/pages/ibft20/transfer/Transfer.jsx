import { Badge, Button, Loader, LoadingOverlay, NumberInput, Select, TextInput, Textarea } from '@mantine/core'
import { useEffect, useState } from 'react'
import { fetchBankList, formatVietnamese, numberWithCommas, setBadge, validateInValidAmount } from '../../../services/Utilities'
import classes from './Transfer.module.css'
import { authHeader, getCurrentUser } from '../../../services/AuthServices'
import { destinationType } from '../../ibft/ibftConfig'
import axios from 'axios'
import NotificationServices from '../../../services/notificationServices/NotificationServices'
import dayjs from 'dayjs'
export const Transfer = () => {
    const { bankId, accountNumber, cardNo } = getCurrentUser()
    let sourceAccount = []
    if (!accountNumber && !cardNo) {
        sourceAccount.push({
            group: 'Số tài khoản',
            items: [
                {
                    label: '88889999',
                    value: '88889999'
                }
            ]
        })
    }

    if (cardNo) {
        sourceAccount.push({
            group: 'Số thẻ',
            items: [
                {
                    label: cardNo,
                    value: cardNo
                }
            ]
        })
    }

    if (accountNumber) {
        sourceAccount.push({
            group: 'Số tài khoản',
            items: [
                {
                    label: accountNumber,
                    value: accountNumber
                }
            ]
        })
    }

    const [fromAccount, setFromAccount] = useState(sourceAccount[0].items[0].value)
    const [destinationTypeId, setAccountType] = useState(destinationType[0].value)
    const [initData, setInitData] = useState(
        {
            acqBankName: 'DongA Bank',
            acqBankId: '',
            acqAccountNo: '',
            acqAccountName: '',
            transTime: '',
            refNo: '',
            traceNo: '',
            amount: 0,
            description: '',
            depositStatus: ''
        }
    )

    const [status, setStatus] = useState({
        inquiry: 'PENDING',
        deposit: 'PENDING',

    })

    const [listBank, setListBank] = useState({
        acq: [{ value: '970406', label: 'DongA Bank' }],
        iss: [{ value: '970406', label: 'DongA Bank' }],
    })

    const [acqBank, setAcqBank] = useState({
        id: listBank.acq[0].value,
        name: listBank.acq[0].label,
    })

    const [issBank, setIssBank] = useState({
        id: listBank.iss[0].value,
        name: listBank.iss[0].label,
    })

    useEffect(() => {
        const fetchData = async () => {
            const [acquirer, issuer] = await fetchBankList()
            setListBank({ iss: issuer, acq: acquirer })
            setIssBank({
                id: bankId,
                name: issuer.find(b => b.value === bankId).name
            })
        }

        fetchData().catch((error) => console.log(error))
    }, [])

    const handleChangeFromAcc = value => {
        setFromAccount(value)
    }

    const handleChangeToAccountType = (value) => {
        setAccountType(value)
        setInitData({
            ...initData,
            acqAccountNo: '',
            acqAccountName: '',
            refNo: '',
            depositStatus: '',
            transTime: '',
            traceNo: ''
        })
    }

    const handleChangeIssBank = (value) => {
        setIssBank({
            id: value,
            name: listBank.iss.find(b => b.value.toString() === value.toString()).label
        })
    }

    const handleChangeAcqBank = value => {
        setAcqBank({
            id: value,
            name: listBank.acq.find(b => b.value.toString() === value.toString()).label
        })

        setInitData({
            ...initData,
            acqBankName: listBank.acq.find(b => b.value.toString() === value.toString()).label,
            depositStatus: '',
            transTime: '',
            traceNo: ''
        })
    }

    const handleChangeAmount = (data) => {
        setInitData({ ...initData, amount: data })
    }

    const handleChangeAcqAccount = e => {
        setInitData({
            ...initData,
            acqAccountNo: e.target.value,
            acqAccountName: '',
            refNo: '',
            depositStatus: '',
            transTime: '',
            traceNo: ''
        })
    }

    const handleSearchAccount = () => {
        if (initData.acqAccountNo) {
            axios.get(`/1st/bankdemo/api/payment/investigatename?creditorAgent=${acqBank.id}&toAccount=${initData.acqAccountNo}&toAccountType=${destinationTypeId.toString() === '20' ? 'ACC' : 'PAN'}`, { headers: authHeader() })
                .then(res => {
                    const { f39, f63, f120 } = res.data
                    if (f39 !== '00') {
                        NotificationServices.warning(`Không tìm được thông tin ${destinationTypeId.toString() === '20' ? 'tài khoản' : 'thẻ'}.`)
                        return;
                    }

                    setInitData({
                        ...initData,
                        acqAccountName: f120,
                        refNo: f63,
                        transTime: '',
                        traceNo: ''
                    })
                })
                .catch(() => {
                    NotificationServices.error(`Không tìm được thông tin ${destinationTypeId.toString() === '20' ? 'tài khoản' : 'thẻ'}.`)
                    return;
                })
                .finally(() => { })
        }
    }

    const handleChangeDescription = (e) => {
        setInitData({
            ...initData,
            description: formatVietnamese(e.target.value)
        })
    }

    const handleResetInitData = () => {
        setInitData(
            {
                acqBankName: 'DongA Bank',
                acqBankId: '',
                acqAccountNo: '',
                acqAccountName: '',
                transTime: '',
                refNo: '',
                traceNo: '',
                amount: 0,
                description: '',
                depositStatus: ''
            }
        )
    }

    const validData = () => {
        if (initData.traceNo) {
            NotificationServices.warning('Vui lòng truy vấn lại.')
            return false
        }

        if (!issBank.id) {
            NotificationServices.warning('Ngân hàng phát lệnh không được để trống.')
            return false
        }

        if (!acqBank.id) {
            NotificationServices.warning('Ngân hàng thụ hưởng không được để trống.')
            return false
        }

        if (!fromAccount) {
            NotificationServices.warning('Nguồn thẻ không được để trống.')
            return false
        }

        if (!initData.acqAccountNo) {
            NotificationServices.warning(`${destinationTypeId.toString() === '20' ? 'Tài khoản' : 'Thẻ'} thụ hưởng không được để trống.`)
            return false
        }

        if (!initData.acqAccountName || !initData.refNo) {
            NotificationServices.warning('Tài khoản không hợp lệ.')
            return false
        }

        if (!initData.description) {
            NotificationServices.warning('Nội dung giao dịch không được để trống.')
            return false
        }

        if (validateInValidAmount(initData.amount)) {
            NotificationServices.warning('Số tiền phải lớn hơn 2,000 và nhỏ hơn 500,000,000.')
            return false
        }

        return true
    }

    const handleTransfer = () => {
        const isValid = validData()
        if (!isValid) return

        const requestBody = {
            amount: initData.amount,
            content: initData.description,
            creditorAgent: acqBank.id,
            f63: initData.refNo,
            toAccount: initData.acqAccountNo,
            toAccountType: destinationTypeId.toString() === '20' ? 'ACC' : 'PAN'
        }

        setStatus({
            ...status,
            deposit: 'PROCESSING'
        })
        axios.post('/1st/bankdemo/api/payment/fundtransfer', requestBody, { headers: authHeader() })
            .then(
                res => {
                    const { f11, f39, transDate } = res.data
                    console.log(dayjs(transDate).format('DD/MM/YYYY HH:mm'))
                    setInitData({
                        ...initData,
                        transTime: dayjs(transDate).format('DD/MM/YYYY HH:mm'),
                        traceNo: f11,
                        depositStatus: f39
                    })

                }
            )
            .catch(err => {
                const { status } = err.response
                setInitData({
                    ...initData,
                    depositStatus: status.toString()
                })
                NotificationServices.error(`${status}: Không thể thực hiện giao dịch.`)
            })
            .finally(() => {
                setStatus({
                    ...status,
                    deposit: 'PENDING'
                })
            })
    }
    return (
        <div className="relative flex w-full gap-2">
            <div className='relative flex flex-col basis-2/3 w-full h-full gap-2 p-2 bg-white'>
                <LoadingOverlay visible={status.deposit.toUpperCase() === 'PROCESSING'} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <div className='flex xs:flex-col md:flex-row w-full  gap-2'>
                    <div className='flex flex-col basis-1/2'>
                        <Select
                            label="Ngân hàng phát lệnh"
                            data={listBank.iss}
                            value={issBank.id}
                            searchable
                            nothingFoundMessage="Không tìm thấy ..."
                            className="w-1/2 md:w-full"
                            maxDropdownHeight={200}
                            disabled
                            onChange={handleChangeIssBank}
                        />
                        <Select
                            label="Nguồn"
                            data={sourceAccount}
                            value={fromAccount}
                            searchable
                            nothingFoundMessage="Không tìm thấy ..."
                            className="w-1/2 md:w-full"
                            onChange={handleChangeFromAcc}
                        />
                        <TextInput
                            label="Tới thẻ/ tài khoản"
                            placeholder="Số thẻ/ Số tài khoản"
                            value={initData.acqAccountNo}
                            classNames={{
                                input: classes.input,
                                wrapper: classes.wrapper
                            }}
                            onChange={handleChangeAcqAccount}
                            onBlur={handleSearchAccount}
                        />
                        <TextInput
                            label="Tên chủ tài khoản"
                            value={initData.acqAccountName}
                            disabled
                            classNames={{
                                input: classes.input,
                                wrapper: classes.wrapper
                            }}
                        />
                    </div>

                    <div className='flex flex-col basis-1/2'>
                        <Select
                            label="Ngân hàng thụ hưởng"
                            data={listBank.acq}
                            value={acqBank.id}
                            searchable
                            nothingFoundMessage="Không tìm thấy ..."
                            className="w-1/2 md:w-full"
                            maxDropdownHeight={200}
                            onChange={handleChangeAcqBank}
                        />
                        <Select
                            label="Tới"
                            data={destinationType}
                            value={destinationTypeId}
                            searchable
                            nothingFoundMessage="Không tìm thấy ..."
                            className="w-1/2 md:w-full"
                            onChange={handleChangeToAccountType}
                        />
                        <NumberInput
                            label="Số tiền"
                            placeholder="Số tiền"
                            classNames={{
                                input: classes.input,
                                wrapper: classes.wrapper
                            }}
                            value={initData.amount}
                            onChange={(data) => handleChangeAmount(data)}
                            allowNegative={false}
                            thousandSeparator=","
                            hideControls
                        />
                        <TextInput
                            label="Số tham chiếu"
                            disabled
                            value={initData.refNo}
                            classNames={{
                                input: classes.input,
                                wrapper: classes.wrapper
                            }}
                        />
                    </div>
                </div>
                <div id='transaction-description' className='flex w-full bg-white'>
                    <Textarea
                        label="Nội dung giao dịch"
                        placeholder="Nội dung giao dịch"
                        value={initData.description}
                        classNames={{
                            root: classes.textAreaWrapperRoot
                        }}
                        onChange={handleChangeDescription}
                    />
                </div>
                <div id='transaction-action' className='flex w-full  justify-end items-center gap-2'>
                    <Button variant="filled" className=" bg-slate-500 hover:bg-red-600" onClick={handleResetInitData}>Reset</Button>
                    <Button variant="filled" className="hover:bg-teal-600" onClick={handleTransfer}>Xác nhận</Button>
                </div>
            </div>
            <div className='flex basis-1/3 flex-col w-full h-full gap-2 p-2 bg-white'>
                <div id="logo-napas" className="flex w-full justify-center items-center">
                    <img src='/bankdemo/napas-logo.svg' className=" w-auto xs:w-24 h-10 xs:h-auto align-middle border-none " />
                </div>
                <div id="transaction-status" className='flex flex-col w-full justify-center items-center border border-indigo-400 border-dashed rounded-md py-1 gap-1'>
                    <div className='w-full flex justify-center items-center'>Tổng tiền</div>
                    <div className='w-full flex font-semibold text-xl justify-center items-center text-center'>{numberWithCommas(initData.amount)} VND</div>
                    <div className='w-full flex justify-center items-center'>
                        {setBadge(initData.depositStatus, true)}
                    </div>
                </div>
                <div id="transaction-info" className='flex flex-col w-full justify-start items-center gap-1 py-1'>
                    <div className='flex flex-start w-full items-center font-semibold text-xl text-slate-700 italic'>Thông tin giao dịch</div>
                    <div id="transaction-detail" className='flex flex-col w-full gap-1'>
                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Ngân hàng thụ hưởng</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{initData.acqBankName}</div>
                        </div>
                        {/* <Divider size="xs" variant="dashed" orientation="horizontal" className="xs:hidden lg:block" /> */}
                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Tài khoản thụ hưởng</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{initData.acqAccountNo}</div>
                        </div>
                        {/* <Divider size="xs" variant="dashed" orientation="horizontal" className="xs:hidden lg:block" /> */}
                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Tên chủ tài khoản</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{initData.acqAccountName}</div>
                        </div>
                        {/* <Divider size="xs" variant="dashed" orientation="horizontal" className="xs:hidden lg:block" /> */}
                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Thời gian giao dịch</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{initData.transTime}</div>
                        </div>
                        {/* <Divider size="xs" variant="dashed" orientation="horizontal" className="xs:hidden lg:block" /> */}
                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Số tham chiếu</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{initData.refNo}</div>
                        </div>
                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Số lưu vết</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{initData.traceNo}</div>
                        </div>
                        {/* <Divider size="xs" variant="dashed" orientation="horizontal" className="xs:hidden lg:block" /> */}
                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Số tiền giao dịch</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{numberWithCommas(initData.amount)}</div>
                        </div>
                        {/* <Divider size="xs" variant="dashed" orientation="horizontal" className="xs:hidden lg:block" /> */}
                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Nội dung giao dịch</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{initData.description}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
