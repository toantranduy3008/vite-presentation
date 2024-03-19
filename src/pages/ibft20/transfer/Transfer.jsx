import { Button, LoadingOverlay, NumberInput, Select, TextInput, Textarea } from '@mantine/core'
import { useEffect, useState } from 'react'
import { fetchBankList, formatVietnamese, maskRefCode, numberWithCommas, setBadge, validateInValidAmount } from '../../../services/Utilities'
import classes from './Transfer.module.css'
import NotificationServices from '../../../services/notificationServices/NotificationServices'
import dayjs from 'dayjs'
import { TransferAPI } from '../../../apis/TransferAPI'
import { getCurrentUser } from '../../../services/AuthServices'
import { TransferResultModal } from './TransferResultModal'

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

    const [fromSource] = useState([{ value: 'PAN', label: 'Thẻ' }, { value: 'ACC', label: 'Tài khoản' }])
    const [toSource] = useState([{ value: 'PAN', label: 'Thẻ' }, { value: 'ACC', label: 'Tài khoản' }])
    const [fromSourceValue, setFromSourceValue] = useState('ACC')
    const [toSourceValue, setToSourceValue] = useState('ACC')
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
        inquiry: false,
        deposit: false,

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

    const [showResultModal, setShowResultModal] = useState(false)
    const [transResult, setTransResult] = useState({
        amount: 0,
        depositStatus: '00',
        acqBankName: '',
        acqAccountNo: '',
        acqAccountName: '',
        transTime: '',
        refNo: '',
        traceNo: '',
        description: ''
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

    const handleChangeIssBank = (value) => {
        setIssBank({
            id: value,
            name: listBank.iss.find(b => b.value.toString() === value.toString()).label
        })
    }

    const handleChangeFromSourceValue = (value) => {
        setFromSourceValue(value)
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

    const handleChangeToSourceValue = (value) => {
        setToSourceValue(value)
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

    const handleChangeAcqBank = value => {
        setAcqBank({
            id: value,
            name: listBank.acq.find(b => b.value.toString() === value.toString()).label
        })

        setInitData({
            ...initData,
            acqBankName: listBank.acq.find(b => b.value.toString() === value.toString()).label,
            toAccount: '',
            depositStatus: '',
            acqAccountNo: '',
            acqAccountName: '',
            transTime: '',
            traceNo: '',
            refNo: '',
            amount: 0,
            description: ''
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
            setStatus({ ...status, inquiry: true })
            TransferAPI.inquiry(acqBank.id, initData.acqAccountNo, toSourceValue, true)
                .then(response => {
                    const { f39, f63, f120 } = response
                    if (f39 !== '00') {
                        NotificationServices.warning(`Không tìm được thông tin ${toSourceValue === 'ACC' ? 'tài khoản' : 'thẻ'}.`)
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
                .catch(error => {
                    setInitData({
                        ...initData,
                        acqAccountName: '',
                        refNo: '',
                        transTime: '',
                        traceNo: ''
                    })
                    const { status } = error.response
                    NotificationServices.error(`${status}: Không tìm được thông tin ${toSourceValue === 'ACC' ? 'tài khoản' : 'thẻ'}.`)
                    return;
                })
                .finally(() => { setStatus({ ...status, inquiry: false }) })
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

        if (!fromSourceValue) {
            NotificationServices.warning('Nguồn thẻ không được để trống.')
            return false
        }

        if (!toSourceValue) {
            NotificationServices.warning('Nguồn chuyển tới không được để trống.')
            return false
        }

        if (!initData.acqAccountNo) {
            NotificationServices.warning(`${toSourceValue === 'ACC' ? 'Tài khoản' : 'Thẻ'} thụ hưởng không được để trống.`)
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
            fromAccountType: fromSourceValue,
            toAccountType: toSourceValue,
        }

        setStatus({
            ...status,
            deposit: true
        })
        TransferAPI.transfer(requestBody, true)
            .then(response => {
                const { f11, f39, transDate } = response
                setInitData({
                    ...initData,
                    transTime: dayjs(transDate).format('DD/MM/YYYY HH:mm'),
                    traceNo: f11,
                    depositStatus: f39,
                    acqAccountNo: '',
                    acqAccountName: '',
                    refNo: '',
                    amount: 0,
                    description: ''
                })

                setTransResult({
                    amount: initData.amount,
                    depositStatus: f39,
                    acqBankName: initData.acqBankName,
                    acqAccountNo: initData.acqAccountNo,
                    acqAccountName: initData.acqAccountName,
                    transTime: dayjs(transDate).format('DD/MM/YYYY HH:mm'),
                    refNo: initData.refNo,
                    traceNo: f11,
                    description: initData.description
                })
            })
            .then(() => { setShowResultModal(true) })
            .catch(error => {
                console.log('error: ', error)
                NotificationServices.error('Không thể thực hiện giao dịch.')
            })
            .finally(() => {
                setStatus({
                    ...status,
                    deposit: false
                })
            })
    }
    return (
        <div className="relative flex w-full gap-2">
            <div className='relative flex flex-col md:basis-2/3 w-full h-full gap-2 p-2 bg-white'>
                <LoadingOverlay visible={status.deposit || status.inquiry} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <div className='flex xs:flex-col md:flex-row w-full  gap-2'>
                    <div className='flex flex-col basis-1/2'>
                        <Select
                            label="Ngân hàng phát lệnh"
                            data={listBank.iss}
                            value={issBank.id}
                            searchable
                            nothingFoundMessage="Không tìm thấy ..."
                            className="w-full"
                            maxDropdownHeight={200}
                            disabled
                            onChange={handleChangeIssBank}
                        />
                        <Select
                            label="Từ nguồn"
                            data={fromSource}
                            value={fromSourceValue}
                            searchable
                            nothingFoundMessage="Không tìm thấy ..."
                            className="w-full"
                            maxDropdownHeight={200}
                            onChange={handleChangeFromSourceValue}
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
                            className="w-full"
                            maxDropdownHeight={200}
                            onChange={handleChangeAcqBank}
                        />
                        <Select
                            label="Tới nguồn"
                            data={toSource}
                            value={toSourceValue}
                            searchable
                            nothingFoundMessage="Không tìm thấy ..."
                            className="w-full"
                            maxDropdownHeight={200}
                            onChange={handleChangeToSourceValue}
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
                            value={maskRefCode(initData.refNo)}
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
            <div className='flex basis-1/3 flex-col w-full h-full gap-2 p-2 bg-white hidden'>
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

                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Tài khoản thụ hưởng</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{initData.acqAccountNo}</div>
                        </div>

                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Tên chủ tài khoản</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{initData.acqAccountName}</div>
                        </div>

                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Thời gian giao dịch</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{initData.transTime}</div>
                        </div>

                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Số tham chiếu</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{maskRefCode(initData.refNo)}</div>
                        </div>
                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Số lưu vết</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{initData.traceNo}</div>
                        </div>

                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Số tiền giao dịch</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{numberWithCommas(initData.amount)}</div>
                        </div>

                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Nội dung giao dịch</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{initData.description}</div>
                        </div>
                    </div>
                </div>
            </div>

            <TransferResultModal data={transResult} opened={showResultModal} onClose={setShowResultModal} />
        </div >
    )
}
