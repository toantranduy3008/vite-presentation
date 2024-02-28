import { Badge, Button, NumberInput, Select, TextInput, Textarea } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { fetchBankList, numberWithCommas } from '../../../services/Utilities'
import classes from './Transfer.module.css'
import { getCurrentUser } from '../../../services/AuthServices'
import { fromAcc, destinationType } from '../../ibft/ibftConfig'
export const Transfer = () => {
    const { bankId } = getCurrentUser()
    const [fromAccount, setFromAccount] = useState(fromAcc[0].items[0].value)
    const [destinationTypeId, setAccountType] = useState(destinationType[0].value)
    const [initData, setInitData] = useState(
        {
            acqBankName: '',
            acqBankId: '',
            acqAccountNo: '',
            acqAccountName: '',
            transTime: '',
            refNo: '',
            traceNo: '',
            amount: 0,
            description: ''
        }
    )

    const [status, setStatus] = useState({
        inquiry: 'PENDING',
        deposit: 'PENDING'
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

    const handleChangeFromAcc = value => {
        setFromAccount(value)
    }

    const handleChangeToAccountType = (value) => {
        setAccountType(value)
    }

    const handleChangeFromBank = (value) => {
        setIssBank({
            id: value,
            name: listBank.iss.find(b => b.value === bankId).name
        })
    }

    const handleChangeToBank = value => {
        setAcqBank({
            id: value,
            name: listBank.acq.find(b => b.value === bankId).name
        })
    }

    const handleChangeAmount = (data) => {
        setInitData({ ...initData, amount: data })
    }

    useEffect(() => {
        const fetchData = async () => {
            const [acquirer, issuer] = await fetchBankList()
            console.log('acquirer', acquirer)
            console.log('issuer', issuer)
            setListBank({ iss: issuer, acq: acquirer })
            setIssBank({
                id: bankId,
                name: issuer.find(b => b.value === bankId).name
            })
        }

        fetchData().catch((error) => console.log(error))
    }, [])
    return (
        <div className=" flex w-full gap-2">
            <div className='flex flex-col basis-2/3 w-full h-full gap-2 p-2 bg-white'>
                <div className='flex xs:flex-col md:flex-row w-full h-full gap-2'>
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
                            onChange={handleChangeFromBank}
                        />
                        <Select
                            label="Nguồn"
                            data={fromAcc}
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
                            // onChange={(data) => handleChangeDetailAccount(data, index, item.hash)}
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
                            onChange={handleChangeToBank}
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
                    </div>
                </div>
                <div id='transaction-description' className='flex w-full bg-white'>
                    <Textarea
                        label="Nội dung chuyển khoản"
                        placeholder="Nội dung chuyển khoản"
                        value={initData.description}
                        classNames={{
                            root: classes.textAreaWrapperRoot,
                            // input: classes.input,
                            // wrapper: classes.wrapper
                        }}
                    />
                </div>
                <div id='transaction-action' className='flex w-full  justify-end items-center gap-2'>
                    <Button variant="filled" className=" bg-slate-500 hover:bg-red-600">Reset</Button>
                    <Button variant="filled" className="hover:bg-teal-600">Xác nhận</Button>
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
                        <Badge
                            size="md"
                            color={status.deposit.toUpperCase() === 'PENDING' ? 'gray' : status.deposit.toUpperCase() === 'FAIL' ? 'red' : 'green'}
                            className="text-[10px] font-normal"
                        >
                            {status.deposit.toUpperCase() === 'PENDING' ? 'Chưa xử lý' : status.deposit.toUpperCase() === 'FAIL' ? 'Thất bại' : 'Thành công'}
                        </Badge>
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
                            <div className='flex flex-1 items-center justify-start'>Tên tài khoản</div>
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
