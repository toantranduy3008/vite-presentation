import { DateTimePicker } from '@mantine/dates'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { fetchBankList, maskRefCode, numberWithCommas, setBadge } from '../../../services/Utilities'
import { Button, Group, LoadingOverlay, Menu, Pagination, Select, Table, TextInput } from '@mantine/core'
import TransactionDetailModal from './TransactionDetailModal'
import { IconDotsVertical } from '@tabler/icons-react'
import NotificationServices from '../../../services/notificationServices/NotificationServices'
import ReturnTransactionModal from './ReturnTransactionModal'
import { SearchAPI } from '../../../apis/SearchAPI'
import { listRowsPerPage } from '../../../configs/GlobalConfig'
export const SearchInComing = () => {
    const currentDate = new Date()
    const previousWeek = new Date(dayjs().subtract(1, 'w'))
    const [lookupParams, setLookupParams] = useState({
        startDate: new Date(previousWeek.setHours(0, 0, 0, 0)),
        endDate: new Date(currentDate.setHours(23, 59, 59, 0)),
        traceNo: '',
        transRef: ''
    })
    const [showDetailTransactionModal, setShowDetailTransactionModal] = useState(false)
    const [showReturnTransactionModal, setShowReturnTransactionModal] = useState(false)
    const [detailTransactionData, setDetailTransactionData] = useState({
        seqNo: '',
        issBankName: '',
        fromAccount: '',
        acqBankName: '',
        toAccount: '',
        acqAccountName: '',
        transTime: '',
        transRef: '',
        traceNo: '',
        amount: 0,
        description: '',
        response: '',
        returnedAmount: 0,
        settlementStatus: ''
    })
    const [returnTransactionData, setReturnTransactionData] = useState({
        seqNo: '',
        amount: 0,
        reason: '',
        traceNo: '',
        transRef: '',
        returnedAmount: 0,
        rootAmount: 0
    })
    const [loading, setLoading] = useState(false)
    const [paging, setPaging] = useState({
        pageNo: 1,
        pageSize: '30',
        totalPages: 1
    })
    const [listBank, setListBank] = useState([])
    const [tableData, setTableData] = useState([])
    const [pagingDataDescription, setPagingDataDescription] = useState('Từ 0 đến 0/ 0 kết quả')
    const [rowsPerPage] = useState(listRowsPerPage)
    useEffect(() => {
        const fetchData = async () => {
            const [acquirer] = await fetchBankList()
            setListBank(acquirer)
        }

        fetchData()
            .then(() => {
                handleSearch()
            })
            .catch(() => { })
    }, [])

    const handleChangeStartDate = (data) => {
        setLookupParams({
            ...lookupParams,
            startDate: data
        })
    }

    const handleChangeEndDate = (data) => {
        setLookupParams({
            ...lookupParams,
            endDate: data
        })
    }

    const handleChangeTraceNo = (e) => {
        setLookupParams({
            ...lookupParams,
            traceNo: e.target.value
        })
    }

    const handleChangeTransRef = (e) => {
        setLookupParams({
            ...lookupParams,
            transRef: e.target.value
        })
    }

    const handleChangeRowNum = (value) => {
        setPaging({
            ...paging,
            pageSize: value
        })
    }

    const handleChangePage = (value) => {
        setPaging({ ...paging, pageNo: value })
        const requestBody = {
            page: value,
            size: paging.pageSize,
            startDate: lookupParams.startDate,
            endDate: lookupParams.endDate,
            traceNo: lookupParams.traceNo,
            transRef: lookupParams.transRef
        }
        handleSearch(requestBody)
    }

    const handleShowDetailTransactionModal = (e, data) => {
        setShowDetailTransactionModal(true)
        setDetailTransactionData(createModalData(data))
    }

    const handleShowReturnTransactionModal = (e, data) => {
        setShowReturnTransactionModal(true)
        setReturnTransactionData({
            seqNo: data.seqNo,
            amount: data.amount - data.returnedAmount,
            reason: '',
            traceNo: data.traceNo,
            transRef: maskRefCode(data.transRef),
            rootAmount: data.amount,
            returnedAmount: data.returnedAmount
        })
    }
    const handleSearch = async (requestBody = null) => {
        setPaging({ ...paging, pageNo: 1 })
        setLoading(true)
        const pagingQuery = {
            page: requestBody ? parseInt(requestBody.page, 10) - 1 : 0,
            size: requestBody ? requestBody.size : paging.pageSize,
            sort: 'id,desc'
        }
        const filtersInput = {
            beginDate: dayjs(requestBody ? requestBody.startDate : lookupParams.startDate).format('YYYY-MM-DDTHH:mm:ss'),
            endDate: dayjs(requestBody ? requestBody.endDate : lookupParams.endDate).format('YYYY-MM-DDTHH:mm:ss'),
            traceNo: requestBody ? requestBody.traceNo : lookupParams.traceNo,
            transRef: requestBody ? requestBody.transRef : lookupParams.transRef
        }

        SearchAPI.incoming(`/bankdemo/api/payment/listIncomingTrans`, pagingQuery, filtersInput)
            .then(
                (response) => {
                    const { content, totalPages, number, numberOfElements, totalElements } = response
                    setTableData(content)
                    if (content.length === 0) {
                        NotificationServices.info('Không tìm thấy giao dịch.')
                        return;
                    }

                    setPagingDataDescription(`Từ ${pagingQuery.size * number + 1} đến ${pagingQuery.size * number + numberOfElements} / ${totalElements} kết quả`)
                    setPaging({
                        ...paging,
                        pageNo: number + 1,
                        totalPages: totalPages
                    })
                }
            ).catch(
                () => {
                    setTableData([])
                    setPagingDataDescription(`Từ 0 đến 0 / 0 kết quả`)
                    NotificationServices.error('Không thể tìm kiếm giao dịch.')
                }
            ).finally(
                () => { setLoading(false) }
            )
    }

    const createModalData = (data) => {
        return {
            seqNo: data.seqNo,
            issBankName: listBank.find(b => b.value.toString() === data.bankId)?.label,
            bankId: data.bankId,
            fromAccount: data.fromAccount,
            fromCardNo: data.fromCardNo,
            acqBankName: listBank.find(b => b.value.toString() === data.benId)?.label,
            benId: data.benId,
            toAccount: data.toAccount,
            acqAccountName: data.f120,
            transDate: data.transDate ? dayjs(data.transDate).format('DD/MM/YYYY HH:mm') : '',
            transRef: data.transRef,
            traceNo: data.traceNo,
            amount: data.amount ? data.amount : 0,
            description: data.transContent,
            response: setBadge(data.respcode, true),
            returnedAmount: data.returnedAmount,
            reason: '',
            settlementStatus: data.settlementStatus
        }
    }
    const onChangeReturnData = (data) => {
        setReturnTransactionData(data)
    }
    const onSubmitReturnTransaction = (data) => {
        if (data.amount < 2000 || !data.amount) return NotificationServices.warning('Số tiền hoàn trả không hợp lệ.')
        if (!data.reason.trim()) return NotificationServices.warning('Lý do hoàn trả không được để trống.')
        SearchAPI.returnTransaction(data, true)
            .then(res => {
                const { responseCode } = res
                if (responseCode === '00') {
                    NotificationServices.success('Gửi yêu cầu hoành trả thành công.')
                    setShowReturnTransactionModal(false)
                } else {
                    NotificationServices.warning('Gửi yêu cầu hoàn trả không thành công.')
                }
            })
            .then(() => { handleSearch() })
            .catch((e) => {
                console.log(e)
                NotificationServices.error(`Không thể gửi yêu cầu hoàn trả.`)
            })
            .finally(() => { })
    }

    const handleInvestigateTransaction = (e, data) => {
        SearchAPI.investigateTransaction({ seqNo: data.seqNo }, true)
            .then(res => {
                const { responseCode } = res
                if (responseCode === '00') {
                    NotificationServices.success('Gửi yêu cầu tra cứu thành công.')
                    setShowReturnTransactionModal(false)
                } else {
                    NotificationServices.warning('Gửi yêu cầu tra cứu không thành công.')
                }
            })
            .then(() => { handleSearch() })
            .catch((e) => {
                console.log(e)
                NotificationServices.error(`Không thể gửi yêu cầu tra cứu.`)
            })
            .finally(() => { })
    }

    const handleCopyTransaction = (e, data) => {
        SearchAPI.copyTransaction({ seqNo: data.seqNo }, true)
            .then(res => {
                const { responseCode } = res
                if (responseCode === '00') {
                    NotificationServices.success('Gửi yêu cầu copy giao dịch thành công.')
                    setShowReturnTransactionModal(false)
                } else {
                    NotificationServices.warning('Gửi yêu cầu copy giao dịch không thành công.')
                }
            })
            .catch((e) => {
                console.log(e)
                NotificationServices.error(`Không thể gửi yêu cầu copy giao dịch.`)
            })
            .finally(() => { })
    }

    const tblRows = tableData.map((element, index) => (
        <Table.Tr
            key={`${index}_${element.transRef}`}
            className='hover:cursor-pointer'
        >
            <Table.Td>
                {(paging.pageNo - 1) * paging.pageSize + index + 1}
            </Table.Td>
            <Table.Td>
                {element.traceNo}
            </Table.Td>
            <Table.Td>
                {maskRefCode(element.transRef)}
            </Table.Td>
            <Table.Td>
                {numberWithCommas(element.amount)}
            </Table.Td>
            <Table.Td>
                {numberWithCommas(element.returnedAmount)}
            </Table.Td>
            <Table.Td>
                {setBadge(element.respcode, true)}
            </Table.Td>
            <Table.Td>
                {element.settlementStatus}
            </Table.Td>
            <Table.Td>
                {listBank.find(b => b.value.toString() === element.benId).label}
            </Table.Td>
            <Table.Td>
                {dayjs(element.transDate).format('DD/MM/YYYY HH:mm')}
            </Table.Td>
            <Table.Td>
                <Menu shadow="md" width={200} position="bottom-end" offset={0} className="flex">
                    <Menu.Target className=" hover:cursor-pointer hover:shadow-md rounded-full p-1 transition ease-linear duration-200">
                        <IconDotsVertical className="w-6 h-6 text-slate-700 hover:text-white hover:bg-sky-700" />
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            className='text-slate-700 hover:bg-orange-500 hover:font-semibold hover:text-white'
                            onClick={(e) => { handleShowDetailTransactionModal(e, element) }}
                        >
                            Chi tiết
                        </Menu.Item>
                        <Menu.Item
                            className='text-slate-700 hover:bg-orange-500 hover:font-semibold hover:text-white'
                            onClick={(e) => { handleShowReturnTransactionModal(e, element) }}
                        >
                            Hoàn trả
                        </Menu.Item>
                        <Menu.Item
                            className='text-slate-700 hover:bg-orange-500 hover:font-semibold hover:text-white'
                            onClick={(e) => { handleCopyTransaction(e, element) }}
                        >
                            Copy giao dịch
                        </Menu.Item>
                        <Menu.Item
                            className='text-slate-700 hover:bg-orange-500 hover:font-semibold hover:text-white'
                            onClick={(e) => { handleInvestigateTransaction(e, element) }}
                            disabled
                        >
                            Tra cứu TTGD tại NHTH
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));
    return (
        <div className='relative flex flex-col w-full gap-2'>
            <div id="search" className='flex w-full justify-start items-end  gap-1'>
                <DateTimePicker
                    label="Thời gian bắt đầu"
                    value={lookupParams.startDate}
                    onChange={handleChangeStartDate}
                />
                <DateTimePicker
                    label="Thời gian kết thúc"
                    value={lookupParams.endDate}
                    onChange={handleChangeEndDate}
                />
                <TextInput
                    label="Số truy vấn"
                    placeholder="F11"
                    value={lookupParams.traceNo}
                    onChange={handleChangeTraceNo}
                />
                <TextInput
                    label="Số tham chiếu"
                    placeholder="F63"
                    value={lookupParams.transRef}
                    onChange={handleChangeTransRef}
                />
                <Button variant="filled" className="hover:bg-teal-600" onClick={() => { handleSearch() }}>Tìm kiếm</Button>
            </div>
            <div id="paging" className='flex w-full  gap-1 items-end justify-between'>
                <Select
                    label="Số dòng/ trang"
                    data={rowsPerPage}
                    value={paging.pageSize}
                    searchable
                    nothingFoundMessage="Không tìm thấy ..."
                    maxDropdownHeight={200}
                    onChange={handleChangeRowNum}
                />
                <div className='flex gap-4 '>
                    <p className='flex p-0 m-0 italic text-indigo-400 font-semibold justify-end items-end'>{pagingDataDescription}</p>
                    <Pagination.Root
                        total={paging.totalPages}
                        value={paging.pageNo}
                        siblings={1}
                        boundaries={1}
                        onChange={handleChangePage}
                    >
                        <Group gap={3} justify="center">
                            <Pagination.First />
                            <Pagination.Previous />
                            <Pagination.Items />
                            <Pagination.Next />
                            <Pagination.Last />
                        </Group>
                    </Pagination.Root>
                </div>
            </div>
            <div id="result" className='relative flex w-full h-full bg-white'>
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Table stickyHeader stickyHeaderOffset={60} highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Stt</Table.Th>
                            <Table.Th>Số lưu vết</Table.Th>
                            <Table.Th>Số tham chiếu</Table.Th>
                            <Table.Th>Số tiền</Table.Th>
                            <Table.Th>Số tiền đã hoàn trả</Table.Th>
                            <Table.Th>TTGD tại Napas</Table.Th>
                            <Table.Th>TT quyết toán</Table.Th>
                            <Table.Th>Ngân hàng thụ hưởng</Table.Th>
                            <Table.Th>Thời gian giao dịch</Table.Th>
                            <Table.Th></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{tblRows}</Table.Tbody>
                </Table>
            </div>

            <TransactionDetailModal
                data={detailTransactionData}
                opened={showDetailTransactionModal}
                onClose={setShowDetailTransactionModal}
            />
            <ReturnTransactionModal
                data={returnTransactionData}
                opened={showReturnTransactionModal}
                onClose={setShowReturnTransactionModal}
                onChangeReturnData={onChangeReturnData}
                onSubmitReturnTransaction={onSubmitReturnTransaction}
            />
        </div>
    )
}