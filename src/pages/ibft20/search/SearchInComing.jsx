import { DateTimePicker } from '@mantine/dates'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { fetchBankList, get, maskRefCode, numberWithCommas, setBadge } from '../../../services/Utilities'
import { Button, Group, LoadingOverlay, Menu, Pagination, Select, Table, TextInput } from '@mantine/core'
import TransactionDetailModal from './TransactionDetailModal'
import { IconDotsVertical } from '@tabler/icons-react'
import NotificationServices from '../../../services/notificationServices/NotificationServices'
import ReturnTransactionModal from './ReturnTransactionModal'

export const SearchInComing = () => {
    const currentDate = new Date()
    const [initData, setInitData] = useState({
        startDate: new Date(currentDate.setHours(0, 0, 0, 0)),
        endDate: new Date(currentDate.setHours(23, 59, 59, 0)),
        traceNo: '',
        transRef: ''
    })

    const [showDetailTransactionModal, setShowDetailTransactionModal] = useState(false)
    const [showReturnTransactionModal, setShowReturnTransactionModal] = useState(false)
    const [modalData, setModalData] = useState({
        seqNo: '',
        issBankName: '',
        fromAccount: '',
        acqBankName: '',
        toAccount: '',
        acqAccountName: '',
        transTime: '',
        transRef: '',
        traceNo: '',
        amount: '',
        description: '',
        response: ''
    })
    const [loading, setLoading] = useState(false)
    const [paging, setPaging] = useState({
        pageNo: 1,
        pageSize: '10',
        totalPages: 1
    })
    const [listBank, setListBank] = useState([])
    const [tableData, setTableData] = useState([])
    const [rowsPerPage] = useState([
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '30', label: '30' },
        { value: '50', label: '50' }
    ])


    useEffect(() => {
        const fetchData = async () => {
            const [acquirer] = await fetchBankList()
            setListBank(acquirer)
        }

        fetchData().catch((error) => console.log(error))
    }, [])

    const handleChangeStartDate = (data) => {
        setInitData({
            ...initData,
            startDate: data
        })
    }

    const handleChangeEndDate = (data) => {
        setInitData({
            ...initData,
            endDate: data
        })
    }

    const handleChangeTraceNo = (e) => {
        setInitData({
            ...initData,
            traceNo: e.target.value
        })
    }

    const handleChangeTransRef = (e) => {
        setInitData({
            ...initData,
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
            startDate: initData.startDate,
            endDate: initData.endDate,
            traceNo: initData.traceNo,
            transRef: initData.transRef
        }
        handleSearch(requestBody)
    }

    const handleShowDetailTransactionModal = (e, data) => {
        setShowDetailTransactionModal(true)
        setModalData({
            seqNo: data.seqNo,
            issBankName: listBank.find(b => b.value.toString() === data.bankId)?.label,
            fromAccount: data.fromAccount,
            acqBankName: listBank.find(b => b.value.toString() === data.benId)?.label,
            toAccount: data.toAccount,
            fromCardNo: data.fromCardNo,
            acqAccountName: data.f120,
            transDate: data.transDate ? dayjs(data.transDate).format('DD/MM/YYYY HH:mm') : '',
            transRef: data.transRef,
            traceNo: data.traceNo,
            amount: data.amount ? numberWithCommas(data.amount) : '',
            description: data.transContent,
            response: setBadge(data.respcode, true)
        })
    }

    const handleShowReturnTransactionModal = (e, data) => {
        setShowReturnTransactionModal(true)
        setModalData({
            seqNo: data.seqNo,
            issBankName: listBank.find(b => b.value.toString() === data.bankId)?.label,
            fromAccount: data.fromAccount,
            acqBankName: listBank.find(b => b.value.toString() === data.benId)?.label,
            toAccount: data.toAccount,
            fromCardNo: data.fromCardNo,
            acqAccountName: data.f120,
            transDate: data.transDate ? dayjs(data.transDate).format('DD/MM/YYYY HH:mm') : '',
            transRef: data.transRef,
            traceNo: data.traceNo,
            amount: data.amount ? numberWithCommas(data.amount) : '',
            description: data.transContent,
            response: setBadge(data.respcode, true)
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
            beginDate: dayjs(requestBody ? requestBody.startDate : initData.startDate).format('YYYY-MM-DDTHH:mm:ss'),
            endDate: dayjs(requestBody ? requestBody.endDate : initData.endDate).format('YYYY-MM-DDTHH:mm:ss'),
            traceNo: requestBody ? requestBody.traceNo : initData.traceNo,
            transRef: requestBody ? requestBody.transRef : initData.transRef
        }
        get(`/1st/bankdemo/api/payment/listIncomingTrans`, pagingQuery, filtersInput).then(
            (res) => {
                const { content, totalPages, number } = res.data
                if (content.length === 0) {
                    NotificationServices.info('Không tìm thấy giao dịch.')
                    return;
                }
                setPaging({
                    ...paging,
                    pageNo: number + 1,
                    totalPages: totalPages
                })

                setTableData(content)
            }
        ).catch(
            (e) => { throw new Error(e) }
        ).finally(
            () => { setLoading(false) }
        )
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
            <Table.Td
            // className=' hover:text-sky-700 hover:cursor-pointer duration-150 ease-linear'
            >
                {maskRefCode(element.transRef)}
            </Table.Td>
            <Table.Td>
                {numberWithCommas(element.amount)}
            </Table.Td>
            <Table.Td>
                {setBadge(element.respcode, true)}
            </Table.Td>
            <Table.Td>
                {listBank.find(b => b.value.toString() === element.benId).label}
            </Table.Td>
            <Table.Td>
                {dayjs(element.transDate).format('DD/MM/YYYY HH:mm')}
            </Table.Td>
            <Table.Td>
                <Menu shadow="md" width={100} position="bottom-end" offset={0} className="flex">
                    <Menu.Target className=" hover:cursor-pointer hover:shadow-md rounded-full p-1 transition ease-linear duration-200">
                        <IconDotsVertical className="w-6 h-6 text-slate-700 hover:text-white hover:bg-sky-700" />
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            className='text-slate-700 hover:bg-sky-700 hover:font-semibold hover:text-white'
                            onClick={(e) => { handleShowDetailTransactionModal(e, element) }}
                        >
                            Chi tiết
                        </Menu.Item>
                        <Menu.Item
                            className='text-slate-700 hover:bg-sky-700 hover:font-semibold hover:text-white'
                            onClick={(e) => { handleShowReturnTransactionModal(e, element) }}
                        >
                            Hoàn trả
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
                    value={initData.startDate}
                    onChange={handleChangeStartDate}
                />
                <DateTimePicker
                    label="Thời gian kết thúc"
                    value={initData.endDate}
                    onChange={handleChangeEndDate}
                />
                <TextInput
                    label="Số truy vấn"
                    placeholder="F11"
                    value={initData.traceNo}
                    onChange={handleChangeTraceNo}
                />
                <TextInput
                    label="Số tham chiếu"
                    placeholder="F63"
                    value={initData.transRef}
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
            <div id="result" className='relative flex w-full h-full bg-white'>
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Table stickyHeader stickyHeaderOffset={60} highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Stt</Table.Th>
                            <Table.Th>Số lưu vết</Table.Th>
                            <Table.Th>Số tham chiếu</Table.Th>
                            <Table.Th>Số tiền</Table.Th>
                            <Table.Th>Trạng thái giao dịch</Table.Th>
                            <Table.Th>Ngân hàng thụ hưởng</Table.Th>
                            <Table.Th>Thời gian giao dịch</Table.Th>
                            <Table.Th></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{tblRows}</Table.Tbody>
                </Table>
            </div>

            <TransactionDetailModal data={modalData} opened={showDetailTransactionModal} onClose={setShowDetailTransactionModal} />
            <ReturnTransactionModal data={modalData} opened={showReturnTransactionModal} onClose={setShowReturnTransactionModal} />
        </div>
    )
}