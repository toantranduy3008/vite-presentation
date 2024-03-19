/* eslint-disable react/prop-types */
import { Button, Modal, NumberInput, Textarea, LoadingOverlay } from '@mantine/core'
import { useEffect, useState } from 'react'
import NotificationServices from '../../../services/notificationServices/NotificationServices'
import { ReturnTransactionAPI } from '../../../apis/ReturnTransactionAPI'

const ReturnTransactionModal = ({ data, opened, onClose }) => {
    const { seqNo, amount, reason } = data
    const [returnAmount, setReturnAmount] = useState(amount)
    const [returnReason, setReturnReason] = useState('')
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setReturnAmount(amount)
        setReturnReason('')
    }, [])
    const handleChangeAmount = (value) => {
        setReturnAmount(value)
    }

    const handleChangeReason = (e) => {
        console.log(e.target.value)
        setReturnReason(e.target.value)
    }

    const handleConfirmReturn = () => {
        const requestBody = {
            seqNo: seqNo,
            amount: parseInt(returnAmount ? returnAmount : amount),
            reason: returnReason
        }

        // ReturnTransactionAPI.returnTransaction(requestBody, true)
        //     .then(res => {
        //         const { responseCode } = res.data
        //         if (responseCode === 0) {
        //             NotificationServices.success('Hoàn trả thành công.')
        //             onClose()
        //         } else {
        //             NotificationServices.warning('Hoàn trả không thành công.')
        //         }
        //     })
        //     .catch(err => {
        //         console.log('error: ', err)
        //         // const { status } = err.response
        //         NotificationServices.error(`Không thể thực hiện giao dịch hoàn trả.`)
        //     })
        //     .finally(() => {
        //         setLoading(false)
        //     })
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
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <div className='flex flex-col w-full justify-start items-start gap-1'>
                    <img src='/bankdemo/napas-logo.svg' className="flex flex-1 w-auto xs:w-24 h-5 xs:h-auto align-middle border-none " />
                    <div className="flex flex-1 justify-start items-center text-left font-bold uppercase italic text-slate-700 text-base">Thông tin giao dịch hoàn trả</div>

                </div>
                <div id="transaction-detail" className='flex flex-col w-full gap-1'>
                    <NumberInput
                        label="Số tiền"
                        placeholder="Số tiền"
                        onChange={handleChangeAmount}
                        value={returnAmount}
                        allowNegative={false}
                        thousandSeparator=","
                        hideControls
                    />
                    <Textarea
                        label="Lý do hoàn trả"
                        placeholder="Lý do hoàn trả"
                        value={returnReason}
                        onChange={() => { handleChangeReason }}
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