/* eslint-disable react/prop-types */
import { Badge, Button, Modal, ScrollArea } from '@mantine/core';
import { numberWithCommas, setBadge } from '../../../services/Utilities';

// eslint-disable-next-line react/prop-types
const InquiryModal = ({ data, opened, onClose }) => {
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
                        <p className='flex m-0 p-0 text-xl font-semibold uppercase'>Thông tin chuyển khoản</p>
                        <p className='flex m-0 p-0 justify-start items-center font-semibold gap-2'>Số lượng giao dịch:
                            <Badge
                                size="sm"
                                color={"blue"}
                                className="text-[10px]"
                            >
                                {data.toBankList.length}
                            </Badge>
                        </p>
                        <p className='flex m-0 p-0 justify-start items-center font-semibold gap-2'>Số lượng giao dịch truy vấn lỗi:
                            <Badge
                                size="sm"
                                color={"red"}
                                className="text-[10px]"
                            >
                                {data.toBankList.filter(item => item.f11 !== '00').length}
                            </Badge>
                        </p>
                    </section>
                    <section className='flex flex-col w-full  max-h-80  max-w-full overflow-x-auto'>
                        <div className="flex items-center w-full space-x-8">
                            <p className="m-0 w-10 flex-shrink-0 items-center justify-start p-0 font-semibold">STT</p>
                            <p className="m-0 w-40 md:w-52 flex-shrink-0 items-center justify-end p-0 text-right font-semibold">Số thẻ/ Số tài khoản</p>
                            <p className="m-0 w-24 md:w-32 flex-shrink-0 items-center justify-end p-0 text-right font-semibold">Số tiền</p>
                            <p className="m-0 w-60 flex-shrink-0 md:flex-grow items-center justify-end p-0 text-right font-semibold">Tên người nhận</p>
                            <p className="m-0 w-32 md:w-40 flex-shrink-0 items-center justify-end p-0 text-right font-semibold">Số trace truy vấn</p>
                            <p className="m-0 w-40 md:w-40 flex-shrink-0 items-center justify-end p-0 text-right font-semibold">Trạng thái truy vấn</p>
                        </div>
                        <div className='flex flex-col'>
                            {
                                data.toBankList.map((item, index) => (
                                    <div className="flex items-center w-full space-x-8 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-200" key={item.hash}>
                                        <p className="m-0 w-10 flex-shrink-0 items-center justify-start p-0 ">{index + 1}</p>
                                        <p className="m-0 w-40 md:w-52 flex-shrink-0 items-center justify-end p-0 text-right ">{item.f103}</p>
                                        <p className="m-0 w-24 md:w-32 flex-shrink-0 items-center justify-end p-0 text-right ">{numberWithCommas(item.f4)}</p>
                                        <p className="m-0 w-60 flex-shrink-0 md:flex-grow items-center justify-end p-0 text-right ">{item.f120}</p>
                                        <p className="m-0 w-32 md:w-40 flex-shrink-0 items-center justify-end p-0 text-right ">{item.f11}</p>
                                        <p className="m-0 w-40 md:w-40 flex-shrink-0 items-center justify-end p-0 text-right ">{setBadge(item.f39, false)}</p>
                                    </div>
                                ))}
                        </div>

                    </section>

                    <section className='flex flex-row w-full justify-end items-center gap-2'>
                        <Button variant='filled'>Xác nhận</Button>
                        <Button variant='filled' color="gray">Đóng</Button>
                    </section>
                </div>

            </Modal>
        </>
    );
}

export default InquiryModal