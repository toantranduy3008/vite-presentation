/* eslint-disable react/prop-types */
import { Modal } from '@mantine/core'
import { maskRefCode, numberWithCommas } from '../../../services/Utilities'

const TransactionDetailModal = ({ data, opened, onClose }) => {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            closeOnClickOutside={true}
            size={"50%"}
            centered
            className='flex flex-col'
        >
            <div className='flex w-full h-full gap-4'>
                <div id="transaction-detail" className="flex flex-col w-full h-full justify-center items-center gap-2">
                    <div className='flex flex-col w-full justify-start items-start gap-1 border-0 border-b border-dashed border-indigo-200'>
                        <img src='/bankdemo/napas-logo.svg' className="flex flex-1 w-auto xs:w-24 h-5 xs:h-auto align-middle border-none " />
                        <div className="flex flex-1 justify-start items-center text-left font-bold uppercase italic text-slate-700 text-base">Thông tin giao dịch</div>
                    </div>
                    {/* <img src='/bankdemo/napas-logo.svg' className="flex flex-1 w-auto xs:w-24 h-5 xs:h-auto align-middle border-none justify-start items-start" />
                    <p className='flex w-full m-0 p-0 text-xl text-slate-700 italic uppercase font-semibold justify-start items-center'>Thông tin giao dịch</p> */}
                    <div id="detail" className='flex w-full h-full gap-5 items-start justify-center'>
                        <div className='flex flex-col flex-1 w-full h-full justify-center items-start'>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Ngân hàng phát lệnh</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.issBankName}</div>
                            </div>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Bank ID</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.bankId}</div>
                            </div>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Nguồn gửi</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.fromCardNo ? data.fromCardNo : data.fromAccount}</div>
                            </div>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Số tiền giao dịch</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{numberWithCommas(data.amount)}</div>
                            </div>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Số tiền đã hoàn trả</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{numberWithCommas(data.returnedAmount)}</div>
                            </div>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Trạng thái quyết toán</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.settlementStatus}</div>
                            </div>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Số lưu vết</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.traceNo}</div>
                            </div>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Thời gian giao dịch</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.transDate}</div>
                            </div>
                        </div>
                        <div className='flex flex-col flex-1 w-full h-full justify-center items-start'>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Ngân hàng thụ hưởng</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.acqBankName}</div>
                            </div>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Ben ID</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.benId}</div>
                            </div>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Nguồn thụ hưởng</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.toAccount}</div>
                            </div>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Tên chủ tài khoản</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.acqAccountName}</div>
                            </div>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Số tham chiếu</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{maskRefCode(data.transRef)}</div>
                            </div>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>TTGD tại Napas</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.response}</div>
                            </div>
                            <div id="transaction-source" className='flex w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                                <div className='flex flex-1 items-center justify-start'>Nội dung giao dịch</div>
                                <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.description}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default TransactionDetailModal