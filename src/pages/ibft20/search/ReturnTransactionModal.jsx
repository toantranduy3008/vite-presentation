/* eslint-disable react/prop-types */
import { Button, Modal, NumberInput, Textarea, LoadingOverlay, TextInput, Tabs, Table } from '@mantine/core'
import { useState } from 'react'
import { SearchAPI } from '../../../apis/SearchAPI'
import { numberWithCommas } from '../../../services/Utilities'
import dayjs from 'dayjs'

const ReturnTransactionModal = ({ data, opened, onClose, onSubmitReturnTransaction, onChangeReturnData }) => {
    const [returnReason, setReturnReason] = useState('')
    const [historyData, setHistoryData] = useState([])
    const [loading, setLoading] = useState(false)
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

    const handleChangeTab = (value) => {
        if (value === 'history') {
            setLoading(true)
            SearchAPI.returnHistory(data.seqNo, true)
                .then(
                    (response) => {
                        setHistoryData(response)
                    }
                ).catch(
                    () => {
                        //NotificationServices.error('Không thể tìm kiếm giao dịch.')
                    }
                ).finally(
                    () => {
                        setLoading(false)

                    }
                )
        }
        else {
            setHistoryData([])
        }
    }

    const tblRows = historyData.map((element, index) => (
        <Table.Tr
            key={`${index}_${element.transRef}`}
            className='hover:cursor-pointer'
        >
            <Table.Td>
                {index + 1}
            </Table.Td>
            <Table.Td>
                {numberWithCommas(element.transactionAmount)}
            </Table.Td>
            <Table.Td>
                {dayjs(element.creationDateTime).format('DD/MM/YYYY HH:mm')}
            </Table.Td>
            <Table.Td>
                {element.responseCode}
            </Table.Td>
            <Table.Td>
                {element.reason}
            </Table.Td>
        </Table.Tr>
    ))
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            size={"lg"}
            centered
            className='flex flex-col'
        >
            <div className='relative flex flex-col w-full h-full gap-1'>
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <div className='flex flex-col w-full justify-start items-start gap-1 border-0 border-b border-dashed border-indigo-200'>
                    <img src='/bankdemo/napas-logo.svg' className="flex flex-1 w-auto xs:w-24 h-5 xs:h-auto align-middle border-none " />
                    <div className="flex flex-1 justify-start items-center text-left font-bold uppercase italic text-slate-700 text-base">Giao dịch hoàn trả</div>
                </div>
                <div id="transaction-detail" className='flex flex-col w-full gap-1'>
                    <Tabs
                        // value={activeTab} 
                        onChange={handleChangeTab}
                        defaultValue="return"
                    >
                        <Tabs.List>
                            <Tabs.Tab value="return" >
                                Giao dịch hoàn trả
                            </Tabs.Tab>
                            <Tabs.Tab value="history" >
                                Lịch sử hoàn trả
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="return">
                            <div className='flex flex-col w-full h-full gap-1 py-1'>
                                <div className="flex gap-2">
                                    <p className='m-0'>Số tham chiếu giao dịch gốc: </p>
                                    <p className='m-0 font-semibold'>{data.transRef}</p>
                                </div>
                                <div className="flex gap-2">
                                    <p className='m-0'>Số lưu vết giao dịch gốc: </p>
                                    <p className='m-0 font-semibold'>{data.traceNo}</p>
                                </div>
                                <NumberInput
                                    label="Số tiền hoàn trả"
                                    placeholder="Số tiền hoàn trả"
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

                            <div id="transaction-detail" className='flex flex-col w-full gap-1'>

                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel value="history">
                            {historyData.length > 0 ?
                                <Table stickyHeader stickyHeaderOffset={60} highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Stt</Table.Th>
                                            <Table.Th>Số tiền</Table.Th>
                                            <Table.Th>Thời gian</Table.Th>
                                            <Table.Th>Mã code</Table.Th>
                                            <Table.Th>Lý do</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>{tblRows}</Table.Tbody>
                                </Table>
                                :
                                <p className='m-0 py-1 font-semibold'>Chưa có lịch sử hoàn trả</p>
                            }
                        </Tabs.Panel>

                    </Tabs >

                </div>

            </div>
        </Modal>
    )
}

export default ReturnTransactionModal