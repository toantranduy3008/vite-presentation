/* eslint-disable react/prop-types */
import { Badge, Button, Modal } from '@mantine/core';
import { numberWithCommas, setBadge } from '../../../services/Utilities';

// eslint-disable-next-line react/prop-types
const TransactionModal = ({ data, abortInquiry, opened, onClose }) => {
    const handleConfirmTransfer = () => {

    }
    return (
        <>
            <Modal
                opened={opened}
                onClose={onClose}
                withCloseButton={false}
                size={'100%'}
            >
                <div className='flex flex-col w-full gap-2 justify-start items-center'>
                    <section className='flex flex-col w-full justify-center items-start gap-2'>
                        <div className='flex m-0 p-0 text-xl font-semibold uppercase'>Thông tin truy vấn</div>
                        <div className='flex m-0 p-0 justify-start items-center font-semibold gap-2'>Số lượng giao dịch:
                            <Badge
                                size="sm"
                                color={"blue"}
                                className="text-[10px]"
                            >
                                {data.toBankList.length}
                            </Badge>
                        </div>
                    </section>
                    <section className='flex flex-col w-full  max-h-80  max-w-full overflow-x-auto'>
                        <div className="flex items-center w-full space-x-8">
                            <div className="m-0 w-10 flex-shrink-0 items-center justify-start p-0 font-semibold">STT</div>
                            <div className="m-0 w-40 md:w-52 flex-shrink-0 items-center justify-end p-0 text-right font-semibold">Số thẻ/ Số tài khoản</div>
                            <div className="m-0 w-24 md:w-32 flex-shrink-0 items-center justify-end p-0 text-right font-semibold">Số tiền</div>
                            <div className="m-0 w-60 flex-shrink-0 md:flex-grow items-center justify-end p-0 text-right font-semibold">Tên người nhận</div>
                            {!abortInquiry &&
                                <>
                                    <div className="m-0 w-32 md:w-40 flex-shrink-0 items-center justify-end p-0 text-right font-semibold">Số trace truy vấn</div>
                                    <div className="m-0 w-32 md:w-44 flex-shrink-0 items-center justify-end p-0 text-right font-semibold">Số tham chiếu truy vấn</div>
                                    <div className="m-0 w-40 md:w-44 flex-shrink-0 items-center justify-end p-0 text-right font-semibold">Trạng thái truy vấn</div>
                                </>
                            }
                            <div className="m-0 w-32 md:w-44 flex-shrink-0 items-center justify-end p-0 text-right font-semibold">Số trace chuyển khoản</div>
                            <div className="m-0 w-32 md:w-56 flex-shrink-0 items-center justify-end p-0 text-right font-semibold">Số tham chiếu chuyển khoản</div>
                            <div className="m-0 w-40 md:w-48 flex-shrink-0 items-center justify-end p-0 text-right font-semibold">Trạng thái chuyển khoản</div>
                        </div>
                        <div className='flex flex-col'>
                            {console.log('render', data)}
                            {
                                data.toBankList.map((item, index) => (

                                    <div className="flex items-center w-full min-w-max space-x-8 py-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-200" key={item.hash ?? 'xxx-xxx-xxx'}>
                                        <div className="m-0 w-10 flex-shrink-0 items-center justify-start p-0 ">{index + 1}</div>
                                        <div className="m-0 w-40 md:w-52 flex-shrink-0 items-center justify-end p-0 text-right ">{item.f103}</div>
                                        <div className="m-0 w-24 md:w-32 flex-shrink-0 items-center justify-end p-0 text-right ">{numberWithCommas(item.f4)}</div>
                                        <div className="m-0 w-60 flex-shrink-0 md:flex-grow items-center justify-end p-0 text-right ">{item.f120}</div>
                                        {!abortInquiry &&
                                            <>
                                                <div className="m-0 w-32 md:w-40 flex-shrink-0 items-center justify-end p-0 text-right ">{item.inquiryResult?.f11}</div>
                                                <div className="m-0 w-32 md:w-44 flex-shrink-0 items-center justify-end p-0 text-right ">{item.inquiryResult?.f63}</div>
                                                <div className="m-0 w-40 md:w-44 flex flex-shrink-0 items-center justify-end p-0 text-right ">{setBadge(item.inquiryResult?.f39, false)}</div>
                                            </>
                                        }
                                        <div className="m-0 w-32 md:w-44 flex-shrink-0 items-center justify-end p-0 text-right ">{item.transferResult.f11}</div>
                                        <div className="m-0 w-32 md:w-56 flex-shrink-0 items-center justify-end p-0 text-right ">{item.transferResult.f63}</div>
                                        <div className="m-0 w-40 md:w-48 flex flex-shrink-0 items-center justify-end p-0 text-right ">{setBadge(item.transferResult.f39, false)}</div>
                                    </div>
                                ))}
                        </div>

                    </section>

                    <section className='flex flex-row w-full justify-end items-center gap-2'>
                        <Button variant='filled' onClick={handleConfirmTransfer}>Xác nhận</Button>
                        <Button variant='filled' color="gray" onClick={() => { onClose() }}>Đóng</Button>
                    </section>
                </div>

            </Modal>
        </>
    );
}

export default TransactionModal