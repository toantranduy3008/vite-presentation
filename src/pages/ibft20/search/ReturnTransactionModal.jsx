/* eslint-disable react/prop-types */
import { Button, Modal, NumberInput, Textarea, LoadingOverlay } from '@mantine/core'
import { useState } from 'react'
import { authHeader } from '../../../services/AuthServices'
import NotificationServices from '../../../services/notificationServices/NotificationServices'
import axiosInstance from '../../../services/axiosInstance'

const ReturnTransactionModal = ({ data, opened, onClose }) => {
    const { seqNo } = data
    const [amount, setAmount] = useState(0)
    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)
    const handleChangeAmount = (value) => {
        setAmount(value)
    }

    const handleChangeReason = (e) => {
        setReason(e.target.value)
    }

    const handleConfirmReturn = () => {
        const requestBody = {
            seqNo: seqNo,
            amount: amount,
            reason: reason
        }
        axiosInstance.post('/api/bankdemo/api/payment/returnIbft', requestBody, { headers: authHeader() })
            .then(res => {
                const { responseCode } = res.data
                if (responseCode === 0) {
                    NotificationServices.success('Hoàn trả thành công.')
                    onClose()
                } else {
                    NotificationServices.warning('Hoàn trả không thành công.')
                }
            })
            .catch(err => {
                const { status } = err.response
                NotificationServices.error(`${status}: Không thể thực hiện giao dịch hoàn trả`)
            })
            .finally(() => {
                setLoading(false)
            })
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
                        // classNames={{
                        //     input: classes.input,
                        //     wrapper: classes.wrapper
                        // }}
                        // value={initData.amount}
                        // onChange={(data) => handleChangeAmount(data)}
                        onChange={handleChangeAmount}
                        value={amount}
                        allowNegative={false}
                        thousandSeparator=","
                        hideControls
                    />
                    <Textarea
                        label="Lý do hoàn trả"
                        placeholder="Lý do hoàn trả"
                        value={reason}
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