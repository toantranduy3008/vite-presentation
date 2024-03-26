import { ActionIcon, Button, CopyButton, Group, LoadingOverlay, Pagination, Select, Table, TextInput, Tooltip } from '@mantine/core'
import { useEffect, useState } from 'react'
import { SearchAPI } from '../../../apis/SearchAPI'
import NotificationServices from '../../../services/notificationServices/NotificationServices'
import { IconCheck, IconCopy, IconEye } from '@tabler/icons-react'
import JsonViewerModal from './JsonViewerModal'
import dayjs from 'dayjs'
import { listRowsPerPage } from '../../../configs/GlobalConfig'
import { DateTimePicker } from '@mantine/dates'
const InvestigateMessage = () => {
    const [loading, setLoading] = useState(false)
    // const [transRef, setTransRef] = useState('')
    const currentDate = new Date()
    const previousWeek = new Date(dayjs().subtract(1, 'w'))
    const [lookupParams, setLookupParams] = useState({
        startDate: new Date(previousWeek.setHours(0, 0, 0, 0)),
        endDate: new Date(currentDate.setHours(23, 59, 59, 0)),
        traceNo: '',
        transRef: ''
    })
    const [investData, setInvestData] = useState([])
    const [pagingParams, setPagingParams] = useState({
        pageNo: 1,
        pageSize: '30',
        totalPages: 1
    })
    const [rowsPerPage] = useState(listRowsPerPage)
    const [showJsonModal, setShowJsonModal] = useState(false)
    const [jsonData, setJsonData] = useState('')
    useEffect(() => { handleSearch() }, [])
    const handleChangeTransRef = (e) => {
        setLookupParams({ ...lookupParams, transRef: e.target.value })
    }
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
            transRef: lookupParams.transRef
        }
        handleSearch(requestBody)
    }
    const handleShowJsonModal = data => {
        setShowJsonModal(true)
        setJsonData(JSON.parse(data.rawJson))
    }
    const handleSearch = async (requestBody = null) => {
        setPagingParams({ ...pagingParams, pageNo: 1 })
        setLoading(true)
        const pagingQuery = {
            page: requestBody ? parseInt(requestBody.page, 10) - 1 : 0,
            size: requestBody ? requestBody.size : pagingParams.pageSize
        }
        const filtersInput = {
            transRef: requestBody ? requestBody.transRef : lookupParams.transRef,
            sentBefore: dayjs(requestBody ? requestBody.endDate : lookupParams.endDate).format('YYYY-MM-DDTHH:mm:ss'),
            sentAfter: dayjs(requestBody ? requestBody.startDate : lookupParams.startDate).format('YYYY-MM-DDTHH:mm:ss'),
        }

        SearchAPI.investigateMessage(`/bankdemo/api/payment/isoMessageHistory`, pagingQuery, filtersInput)
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
                {(pagingParams.pageNo - 1) * pagingParams.pageSize + index + 1}
            </Table.Td>
            <Table.Td className=''>
                <CopyButton value={JSON.stringify(JSON.parse(element.rawJson), null, 2)} timeout={1000}>
                    {({ copied, copy }) => (
                        <Tooltip label={copied ? 'Copied' : 'Copy'} position="top">
                            <ActionIcon variant="transparent" onClick={copy}>
                                {copied ? (
                                    <IconCheck />
                                ) : (
                                    <IconCopy className="w-6 h-6 text-slate-700 hover:text-indigo-700 hover:scale-125 transition ease-linear duration-150" />
                                )}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
            </Table.Td>
            <Table.Td>
                <Tooltip label="Chi tiết">
                    <IconEye
                        className="w-6 h-6 text-slate-700 hover:text-indigo-700 hover:scale-125 transition ease-linear duration-150"
                        onClick={() => { handleShowJsonModal(element) }}
                    />
                </Tooltip>
            </Table.Td>
            <Table.Td>
                {dayjs(element.senderDateTime).format('DD/MM/YYYY HH:mm')}
            </Table.Td>
            <Table.Td className='capitalize'>
                {element.messageIdentifier}
            </Table.Td>
            <Table.Td>
                {element.direction}
            </Table.Td>
            <Table.Td>
                {element.relatedLog}
            </Table.Td>
            <Table.Td>
                {element.senderReference}
            </Table.Td>
            {/* <Table.Td>
                {JSON.stringify(JSON.parse(element.rawJson))}
            </Table.Td> */}
        </Table.Tr>
    ));
    return (
        <div className='relative flex flex-col w-full gap-2'>
            <div id="lookup-params" className='flex w-full justify-start items-end  gap-1'>
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
                <Table.ScrollContainer maw={'100%'} className='w-full'>
                    <Table
                        highlightOnHover
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Stt</Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th>Thời gian</Table.Th>
                                <Table.Th>Loại</Table.Th>
                                <Table.Th>Chiều</Table.Th>
                                <Table.Th>HTTP Response</Table.Th>
                                <Table.Th>Sender Reference</Table.Th>
                                {/* <Table.Th>Bản tin</Table.Th> */}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{tblRows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </div>
            <JsonViewerModal data={jsonData} onClose={setShowJsonModal} opened={showJsonModal} />
        </div>
    )
}

export default InvestigateMessage