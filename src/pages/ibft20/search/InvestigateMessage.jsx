import { Button, Group, LoadingOverlay, Pagination, Select, Table, TextInput, Tooltip } from '@mantine/core'
import { useState } from 'react'
import { SearchAPI } from '../../../apis/SearchAPI'
import NotificationServices from '../../../services/notificationServices/NotificationServices'
import { IconCopy, IconEye } from '@tabler/icons-react'
import { fake } from '../../fake'
const InvestigateMessage = () => {
    const [loading, setLoading] = useState(false)
    const [transRef, setTransRef] = useState('')
    const [investData, setInvestData] = useState(fake)
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
                {(pagingParams.pageNo - 1) * pagingParams.pageSize + index + 1}
            </Table.Td>
            <Table.Td className=''>
                <Tooltip label="Copy">
                    <IconCopy className="w-6 h-6 text-slate-700 hover:text-indigo-700 hover:scale-125 transition ease-linear duration-150" />
                </Tooltip>
            </Table.Td>
            <Table.Td>
                <IconEye className="w-6 h-6 text-slate-700 hover:text-white " />
            </Table.Td>
            <Table.Td>
                {JSON.stringify(element)}
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
                <Table.ScrollContainer maw={'100%'}>
                    <Table
                        highlightOnHover
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Stt</Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th>Bản tin</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{tblRows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </div>
        </div>
    )
}

export default InvestigateMessage