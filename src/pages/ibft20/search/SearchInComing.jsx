import { DateTimePicker } from '@mantine/dates'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { fetchBankList, get, numberWithCommas, setBadge } from '../../../services/Utilities'
import { Button, Group, LoadingOverlay, Pagination, Select, Table, TextInput } from '@mantine/core'
import TransactionDetailModal from './TransactionDetailModal'

const SearchInComing = () => {
    const currentDate = new Date()
    const [initData, setInitData] = useState({
        startDate: new Date(currentDate.setHours(0, 0, 0, 0)),
        endDate: new Date(currentDate.setHours(23, 59, 59, 0)),
        traceNo: '',
        transRef: ''
    })

    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({
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

    const handleShowModal = (e, element) => {
        setShowModal(true)
        setModalData({
            issBankName: listBank.find(b => b.value.toString() === element.bankId)?.label,
            fromAccount: element.fromAccount,
            acqBankName: listBank.find(b => b.value.toString() === element.benId)?.label,
            toAccount: element.toAccount,
            acqAccountName: element.f120,
            transDate: element.transDate ? dayjs(element.transDate).format('DD/MM/YYYY HH:mm') : '',
            transRef: element.transRef,
            traceNo: element.traceNo,
            amount: element.amount ? numberWithCommas(element.amount) : '',
            description: element.transContent,
            response: setBadge(element.respcode, true)
        })
    }
    // const handleShowDetailTransaction = (e, item) => {
    //     setShowModal(true)
    //     setModalData(item)
    // }

    const handleSearch = async (requestBody = null) => {
        setLoading(true)
        const pagingQuery = {
            page: requestBody ? parseInt(requestBody.page, 10) - 1 : 0,
            size: requestBody ? requestBody.size : paging.pageSize,
            sort: 'id,desc'
        }
        const filtersInput = {
            beginDate: dayjs(requestBody ? requestBody.startDate : initData.startDate).format('YYYY-MM-DDTHH:mm:ss.[000Z]'),
            endDate: dayjs(requestBody ? requestBody.endDate : initData.endDate).format('YYYY-MM-DDTHH:mm:ss.[000Z]'),
            traceNo: requestBody ? requestBody.traceNo : initData.traceNo,
            transRef: requestBody ? requestBody.transRef : initData.transRef
        }
        get(`/1st/bankdemo/api/payment/listTrans`, pagingQuery, filtersInput).then(
            (res) => {
                const { content, totalPages, number } = res.data
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
            onDoubleClick={() => { setShowModal(true) }}
            className='hover:cursor-pointer'
        >
            <Table.Td>{(paging.pageNo - 1) * paging.pageSize + index + 1}</Table.Td>
            <Table.Td>{element.traceNo}</Table.Td>
            <Table.Td
                className=' hover:text-sky-700 hover:cursor-pointer font-semibold duration-150 ease-linear'
                onClick={(e) => { handleShowModal(e, element) }}
            >
                {element.transRef}
            </Table.Td>
            <Table.Td>{setBadge(element.respcode, true)}</Table.Td>
            <Table.Td>{listBank.find(b => b.value.toString() === element.benId).label}</Table.Td>
            <Table.Td>{dayjs(element.transDate).format('DD/MM/YYYY HH:mm')}</Table.Td>
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
                <Pagination.Root total={paging.totalPages} siblings={1} boundaries={1} onChange={handleChangePage}>
                    <Group gap={3} justify="center">
                        <Pagination.First />
                        <Pagination.Previous />
                        <Pagination.Items />
                        <Pagination.Next />
                        <Pagination.Last />
                    </Group>
                </Pagination.Root>
                {/* <Pagination total={20} siblings={1} boundaries={1} defaultValue={1} /> */}
            </div>
            <div id="result" className='relative flex w-full h-full bg-white'>
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Table stickyHeader stickyHeaderOffset={60} highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Stt</Table.Th>
                            <Table.Th>Số lưu vết</Table.Th>
                            <Table.Th>Số tham chiếu</Table.Th>
                            <Table.Th>Trạng thái giao dịch</Table.Th>
                            <Table.Th>Ngân hàng thụ hưởng</Table.Th>
                            <Table.Th>Thời gian giao dịch</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{tblRows}</Table.Tbody>
                </Table>
            </div>

            <TransactionDetailModal data={modalData} opened={showModal} onClose={setShowModal} />
        </div>
    )
}

export default SearchInComing