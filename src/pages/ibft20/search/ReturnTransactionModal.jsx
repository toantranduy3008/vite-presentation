/* eslint-disable react/prop-types */
import { Button, Modal, NumberInput, Textarea, LoadingOverlay, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'

const ReturnTransactionModal = ({ data, opened, onClose, onSubmitReturnTransaction, onChangeReturnData }) => {
    console.log('render')
    const [returnReason, setReturnReason] = useState('')
    // const [loading, setLoading] = useState(false)
    // const [reason1, setReason1] = useState('')
    // useEffect(() => {
    //     onChangeReturnData(data)
    // }, [data])
    const handleChangeAmount = (value) => {
        data.amount = value
        onChangeReturnData(data)
    }
    const handleChangeReason = (e) => {
        data.reason = e.target.value
        setReturnReason(e.target.value)
    }
    const handleConfirmReturn = () => {
        onSubmitReturnTransaction({ ...data, reason: returnReason })
    }
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            size={"md"}
            centered
            className='flex flex-col'
        >
            <div className='relative flex flex-col w-full h-full gap-1'>
                {/* <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} /> */}
                <div className='flex flex-col w-full justify-start items-start gap-1'>
                    <img src='/bankdemo/napas-logo.svg' className="flex flex-1 w-auto xs:w-24 h-5 xs:h-auto align-middle border-none " />
                    <div className="flex flex-1 justify-start items-center text-left font-bold uppercase italic text-slate-700 text-base">Thông tin giao dịch hoàn trả</div>

                </div>
                <div id="transaction-detail" className='flex flex-col w-full gap-1'>
                    <NumberInput
                        label="Số tiền"
                        placeholder="Số tiền"
                        onChange={handleChangeAmount}
                        value={data.amount}
                        allowNegative={false}
                        thousandSeparator=","
                        hideControls
                    />
                    <Textarea
                        label="Lý do hoàn trả"
                        placeholder="Lý do hoàn trả"
                        value={returnReason}
                        onChange={handleChangeReason}
                    />
                </div>
                <div id="transaction-detail" className='flex flex-col w-full gap-1'>
                    <div id='transaction-action' className='flex w-full  justify-end items-center gap-2'>
                        <Button
                            variant="filled"
                            className="hover:bg-teal-600"
                            onClick={handleConfirmReturn}
                        >
                            Xác nhận
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ReturnTransactionModal