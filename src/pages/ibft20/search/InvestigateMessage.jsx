import { ActionIcon, Button, CopyButton, Group, LoadingOverlay, Pagination, Select, Table, TextInput, Tooltip } from '@mantine/core'
import { useEffect, useState } from 'react'
import { SearchAPI } from '../../../apis/SearchAPI'
import NotificationServices from '../../../services/notificationServices/NotificationServices'
import { IconCheck, IconEye, IconSquareRoundedArrowLeft, IconSquareRoundedArrowRight } from '@tabler/icons-react'
import JsonViewerModal from './JsonViewerModal'
import dayjs from 'dayjs'
import { listRowsPerPage, listMessageIdentifier } from '../../../configs/GlobalConfig'
import { DateTimePicker } from '@mantine/dates'
import { getUrl, maskRefCode } from '../../../services/Utilities'
import { BankAPI } from '../../../apis/BankAPI'

const InvestigateMessage = () => {
    const [loading, setLoading] = useState(false)
    const { protocol, hostName } = getUrl()
    const currentDate = new Date()
    const previousDay = new Date(dayjs().subtract(1, 'd'))
    const [lookupParams, setLookupParams] = useState({
        startDate: new Date(currentDate.setHours(0, 0, 0, 0)),
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
    const [pagingDataDescription, setPagingDataDescription] = useState('Từ 0 đến 0/ 0 kết quả')
    const [messageIdentifier, setMessageIdentifier] = useState("")
    const [listBank, setListBank] = useState([])
    useEffect(() => {
        BankAPI.getAll()
            .then(res => {
                setListBank(res.listBank)
            })
            .then(() => {
                handleSearch()
            })
            .catch(() => {
                setListBank([])
                NotificationServices.error('Không thể lấy danh sách ngân hàng.')
            })
            .finally(() => {

            })
    }, [])
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
    const handleChangeMessageIdentifier = (value) => {
        setMessageIdentifier(value)
    }
    const handleChangePage = (value) => {
        setPagingParams({ ...pagingParams, pageNo: value })
        const requestBody = {
            page: value,
            size: pagingParams.pageSize,
            transRef: lookupParams.transRef,
            endDate: lookupParams.endDate,
            startDate: lookupParams.startDate,
            messageIdentifier: messageIdentifier
        }

        handleSearch(requestBody)
    }
    const handleShowJsonModal = data => {
        setJsonData({
            request: data.rawJson ? JSON.parse(data?.rawJson) : "",
            response: data.relatedLog ? JSON.parse(data.relatedLog?.rawJson) : ""
        })
        setShowJsonModal(true)
    }
    const handleSearch = async (requestBody = null) => {
        setPagingParams({ ...pagingParams, pageNo: 1 })
        setLoading(true)
        const pagingQuery = {
            page: requestBody ? parseInt(requestBody.page, 10) - 1 : 0,
            size: requestBody ? requestBody.size : pagingParams.pageSize
        }
        const filtersInput = {
            transactionReference: requestBody ? requestBody.transRef : lookupParams.transRef,
            sentBefore: dayjs(requestBody ? requestBody.endDate : lookupParams.endDate).format('YYYY-MM-DDTHH:mm:ss'),
            sentAfter: dayjs(requestBody ? requestBody.startDate : lookupParams.startDate).format('YYYY-MM-DDTHH:mm:ss'),
            messageIdentifier: requestBody ? requestBody.messageIdentifier : messageIdentifier
        }

        SearchAPI.investigateMessage(`/bankdemo/api/payment/isoMessageHistory`, pagingQuery, filtersInput)
            .then(
                (response) => {
                    const { content, totalPages, number, numberOfElements, totalElements } = response
                    setInvestData(content)
                    if (content.length === 0) {
                        setPagingDataDescription(`Từ 0 đến 0 / 0 kết quả`)
                        NotificationServices.info('Không tìm thấy bản tin.')
                        return;
                    }

                    setPagingDataDescription(`Từ ${pagingQuery.size * number + 1} đến ${pagingQuery.size * number + numberOfElements} / ${totalElements} kết quả`)
                    setPagingParams({
                        ...pagingParams,
                        pageNo: number + 1,
                        totalPages: totalPages
                    })
                }
            ).catch(
                () => {
                    setInvestData([])
                    setPagingDataDescription(`Từ 0 đến 0 / 0 kết quả`)
                    NotificationServices.error('Không thể tìm kiếm bản tin.')
                }
            ).finally(
                () => { setLoading(false) }
            )
    }
    const tblRows = investData.map((element, index) => (
        <Table.Tr
            key={`${index}_${element.senderReference}`}
            className='hover:cursor-pointer'
        >
            <Table.Td>
                {(pagingParams.pageNo - 1) * pagingParams.pageSize + index + 1}
            </Table.Td>
            {protocol === 'https' || hostName === 'localhost' ?
                <>
                    <Table.Td className=''>
                        <CopyButton value={JSON.stringify(JSON.parse(element.rawJson), null, 2)} timeout={1000}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? 'Copied' : 'Copy bản tin request'} position="top">
                                    <ActionIcon variant="transparent" onClick={copy}>
                                        {copied ? (
                                            <IconCheck />
                                        ) : (
                                            <IconSquareRoundedArrowRight className="w-6 h-6 text-slate-700 hover:text-indigo-700 hover:scale-125 transition ease-linear duration-150" />
                                        )}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </Table.Td>
                    <Table.Td className=''>
                        <CopyButton value={element.relatedLog ? JSON.stringify(JSON.parse(element.relatedLog?.rawJson), null, 2) : ""} timeout={1000}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? 'Copied' : 'Copy bản tin response'} position="top">
                                    <ActionIcon variant="transparent" onClick={copy}>
                                        {copied ? (
                                            <IconCheck />
                                        ) : (
                                            <IconSquareRoundedArrowLeft className="w-6 h-6 text-slate-700 hover:text-indigo-700 hover:scale-125 transition ease-linear duration-150" />
                                        )}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </Table.Td>
                </>
                : null
            }
            <Table.Td>
                <Tooltip label="Chi tiết">
                    <IconEye
                        className="w-6 h-6 text-slate-700 hover:text-indigo-700 hover:scale-125 transition ease-linear duration-150"
                        onClick={() => { handleShowJsonModal(element) }}
                    />
                </Tooltip>
            </Table.Td>
            <Table.Td>
                {dayjs(element.senderDateTime).format('DD/MM/YYYY HH:mm:ss')}
            </Table.Td>
            <Table.Td>
                {element.senderId == '970411' ? 'Napas' : listBank.length > 0 ? listBank.find(b => b.id == element.senderId)?.name : ""}
            </Table.Td>
            <Table.Td>
                {element.receiverId === '990401' ? 'Napas' : listBank.length > 0 ? listBank.find(b => b.id == element.receiverId)?.name : ""}
            </Table.Td>
            <Table.Td className='capitalize'>
                {element.messageIdentifier}
            </Table.Td>
            <Table.Td>
                {element.direction}
            </Table.Td>
            <Table.Td>
                {element.senderReference}
            </Table.Td>
            <Table.Td>
                {maskRefCode(element.transactionReference)}
            </Table.Td>
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
                <Select
                    label="Loại thông điệp"
                    data={listMessageIdentifier}
                    value={messageIdentifier}
                    searchable
                    nothingFoundMessage="Không tìm thấy ..."
                    className="w-fit"
                    maxDropdownHeight={300}
                    onChange={handleChangeMessageIdentifier}
                    allowDeselect={false}
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
                <div className='flex gap-4 '>
                    <p className='flex p-0 m-0 italic text-indigo-400 font-semibold justify-end items-end'>{pagingDataDescription}</p>
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

            </div>
            <div id="result" className='relative flex w-full h-full bg-white'>
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                {/* <Table.ScrollContainer maw={'100%'} className='w-full'> */}
                <Table
                    highlightOnHover
                    stickyHeader
                    stickyHeaderOffset={60}
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Stt</Table.Th>
                            {protocol === 'https' || hostName === 'localhost' ?
                                <>
                                    <Table.Th></Table.Th>
                                    <Table.Th></Table.Th>
                                </>
                                :
                                null
                            }
                            <Table.Th></Table.Th>
                            <Table.Th>Thời gian</Table.Th>
                            <Table.Th>Bên gửi</Table.Th>
                            <Table.Th>Bên nhận</Table.Th>
                            <Table.Th>Loại</Table.Th>
                            <Table.Th>Chiều</Table.Th>
                            <Table.Th>Sender Reference</Table.Th>
                            <Table.Th>Mã tham chiếu</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{tblRows}</Table.Tbody>
                </Table>
                {/* </Table.ScrollContainer> */}
            </div>
            <JsonViewerModal data={jsonData} onClose={setShowJsonModal} opened={showJsonModal} />
        </div>
    )
}

export default InvestigateMessage