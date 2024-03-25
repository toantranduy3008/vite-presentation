import { Button, Group, LoadingOverlay, Pagination, Select, Table, TextInput } from '@mantine/core'
import { useState } from 'react'
import { SearchAPI } from '../../../apis/SearchAPI'
import NotificationServices from '../../../services/notificationServices/NotificationServices'

const InvestigateMessage = () => {
    const [loading, setLoading] = useState(false)
    const [transRef, setTransRef] = useState('')
    const [investData, setInvestData] = useState([])
    const [pagingParams, setPagingParams] = useState({
        pageNo: 1,
        pageSize: '30',
        totalPages: 1
    })
    const [rowsPerPage] = useState([
        { value: '30', label: '30' },
        { value: '50', label: '50' },
        { value: '100', label: '100' }
    ])
    const handleChangeTransRef = (e) => {
        setTransRef(e.target.value)
    }
    const handleChangeRowNum = (value) => {
        setPagingParams({
            ...pagingParams,
            pageSize: value
        })
    }

    const handleChangePage = (value) => {
        setPagingParams({ ...pagingParams, pageNo: value })
        const requestBody = {
            page: value,
            size: pagingParams.pageSize,
            transRef: transRef
        }
        handleSearch(requestBody)
    }
    const handleSearch = async (requestBody = null) => {
        setPagingParams({ ...pagingParams, pageNo: 1 })
        setLoading(true)
        const pagingQuery = {
            page: requestBody ? parseInt(requestBody.page, 10) - 1 : 0,
            size: requestBody ? requestBody.size : pagingParams.pageSize,
            sort: 'id,desc'
        }
        const filtersInput = {
            transRef: requestBody ? requestBody.transRef : transRef
        }

        SearchAPI.investigateMessage(`/bankdemo/api/payment/listIncomingTrans`, pagingQuery, filtersInput)
            .then(
                (response) => {
                    const { content, totalPages, number } = response
                    setInvestData(content)
                    if (content.length === 0) {
                        NotificationServices.info('Không tìm thấy bản tin.')
                        return;
                    }

                    setPagingParams({
                        ...pagingParams,
                        pageNo: number + 1,
                        totalPages: totalPages
                    })
                }
            ).catch(
                () => {
                    NotificationServices.error('Không thể tìm kiếm bản tin.')
                }
            ).finally(
                () => { setLoading(false) }
            )
    }
    const tblRows = investData.map((element, index) => (
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
                            onClick={(e) => { handleInvestigateTransaction(e, element) }}
                        >
                            Tra cứu TTGD tại NHTH
                        </Menu.Item>
                        <Menu.Item
                            className='text-slate-700 hover:bg-orange-500 hover:font-semibold hover:text-white'
                            onClick={(e) => { handleShowJsonViewerModal(e, element) }}
                        >
                            Tra cứu bản tin
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));
    return (
        <div className='relative flex flex-col w-full gap-2'>
            <div id="lookup-params" className='flex w-full justify-start items-end  gap-1'>
                <TextInput
                    label="Số tham chiếu"
                    placeholder="F63"
                    value={transRef}
                    onChange={handleChangeTransRef}
                />
                <Button variant="filled" className="hover:bg-teal-600" onClick={() => { handleSearch() }}>Tìm kiếm</Button>
            </div>
            <div id="paging" className='flex w-full  gap-1 items-end justify-between'>
                <Select
                    label="Số dòng/ trang"
                    data={rowsPerPage}
                    value={pagingParams.pageSize}
                    searchable
                    nothingFoundMessage="Không tìm thấy ..."
                    maxDropdownHeight={200}
                    onChange={handleChangeRowNum}
                />
                <Pagination.Root
                    total={pagingParams.totalPages}
                    value={pagingParams.pageNo}
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
                            <Table.Th>Số tiền đã hoàn trả</Table.Th>
                            <Table.Th>TTGD tại Napas</Table.Th>
                            <Table.Th>Ngân hàng thụ hưởng</Table.Th>
                            <Table.Th>Thời gian giao dịch</Table.Th>
                            <Table.Th></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{tblRows}</Table.Tbody>
                </Table>
            </div>
        </div>
    )
}

export default InvestigateMessage