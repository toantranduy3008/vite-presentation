/* eslint-disable react/prop-types */
import { Modal } from '@mantine/core'
import { maskRefCode, numberWithCommas, setBadge } from '../../../services/Utilities'

export const TransferResultModal = ({ data, opened, onClose }) => {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            size={"md"}
            centered
            className='flex flex-col'
        >
            <div className='flex flex-col w-full h-full gap-2 p-2 bg-white'>
                {/* <div id="logo-napas" className="flex w-full justify-center items-center">
                    <img src='/bankdemo/napas-logo.svg' className=" w-auto xs:w-24 h-10 xs:h-auto align-middle border-none " />
                </div> */}
                <div className='flex flex-col w-full justify-start items-start gap-1 border-0 border-b border-dashed border-indigo-200'>
                    <img src='/bankdemo/napas-logo.svg' className="flex flex-1 w-auto xs:w-24 h-5 xs:h-auto align-middle border-none " />
                    <div className="flex flex-1 justify-start items-center text-left font-bold uppercase italic text-slate-700 text-base">Thông tin giao dịch</div>
                </div>
                {/* <div id="transaction-status" className='flex flex-col w-full justify-center items-center border border-indigo-400 border-dashed rounded-md py-1 gap-1'>
                    <div className='w-full flex justify-center items-center'>Tổng tiền</div>
                    <div className='w-full flex font-semibold text-xl justify-center items-center text-center'>{numberWithCommas(data.amount)} VND</div>
                    <div className='w-full flex justify-center items-center'>
                        {setBadge(data.depositStatus, true)}
                    </div>
                </div> */}
                <div id="transaction-info" className='flex flex-col w-full justify-start items-center gap-1 py-1'>
                    {/* <div className='flex flex-start w-full items-center font-semibold text-xl text-slate-700 italic'>Thông tin giao dịch</div> */}
                    <div id="transaction-detail" className='flex flex-col w-full gap-1'>
                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Ngân hàng thụ hưởng</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.acqBankName}</div>
                        </div>

                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Nguồn thụ hưởng</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.acqAccountNo}</div>
                        </div>

                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Tên chủ tài khoản</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.acqAccountName}</div>
                        </div>

                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Thời gian giao dịch</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.transTime}</div>
                        </div>

                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Số tham chiếu</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{maskRefCode(data.refNo)}</div>
                        </div>
                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Số lưu vết</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.traceNo}</div>
                        </div>

                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Số tiền giao dịch</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{numberWithCommas(data.amount)}</div>
                        </div>

                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>Nội dung giao dịch</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{data.description}</div>
                        </div>
                        <div id="transaction-source" className='flex flex-row w-full justify-between items-center border-0 border-b border-dashed border-indigo-200 py-1'>
                            <div className='flex flex-1 items-center justify-start'>TTGD tại Napas</div>
                            <div className='flex flex-1 w-full text-right font-semibold items-center justify-end'>{setBadge(data.depositStatus, true)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}