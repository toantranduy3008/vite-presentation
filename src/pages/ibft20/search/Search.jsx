import { DateTimePicker } from '@mantine/dates'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { get } from '../../../services/Utilities'
import { Button, Group, Pagination, Select, Table, TextInput } from '@mantine/core'
const Search = () => {
    const currentDate = new Date()
    const [initData, setInitData] = useState({
        startDate: new Date(currentDate.setHours(0, 0, 0, 0)),
        endDate: new Date(currentDate.setHours(23, 59, 59, 0)),
        traceNo: '',
        transRef: '',
        page: '1',
        size: '10',
        totalPages: 1
    })

    const [tableData, setTableData] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState([
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '30', label: '30' },
        { value: '50', label: '50' }
    ])

    useEffect(() => {
        // const paging = {
        //     page: 1,
        //     size: 10,
        //     sort: 'id,desc'
        // }


        // const currentDate = new Date()
        // let startDate = dayjs().subtract(7, 'day').format('YYYY-MM-DDTHH:mm:ss.[000Z]')
        // let endDate = dayjs(currentDate).format('YYYY-MM-DDTHH:mm:ss.[000Z]')

        // const filtersInput = {
        //     beginDate: startDate,
        //     endDate: endDate,
        //     traceNo: '',
        //     transRef: ''
        // }
        // get(`/1st/bankdemo/api/payment/listTrans`, paging, filtersInput).then(
        //     (res) => {
        //         const { data } = res
        //         const { content, totalPages } = data
        //         // setTotalPage(totalPages)
        //         // setData(content)
        //     }
        // ).catch(
        //     (e) => { throw new Error(e) }
        // ).finally(
        //     // setLoading(false)
        // )
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
        setInitData({
            ...initData,
            size: value
        })

        //call api
    }

    const handleChangePage = (value) => {
        setInitData({ ...initData, page: value.toString() })
        handleSearch({ ...initData, page: value })
    }

    const handleSearch = async (requestBody = null) => {
        console.log('requestBody', typeof (requestBody), requestBody)
        //call api
        const paging = {
            page: requestBody ? requestBody.page : initData.page,
            size: requestBody ? requestBody.size : initData.size,
            sort: 'id,desc'
        }

        const filtersInput = {
            beginDate: dayjs(requestBody ? requestBody.startDate : initData.startDate).format('YYYY-MM-DDTHH:mm:ss.[000Z]'),
            endDate: dayjs(requestBody ? requestBody.endDate : initData.endDate).format('YYYY-MM-DDTHH:mm:ss.[000Z]'),
            traceNo: requestBody ? requestBody.traceNo : initData.traceNo,
            transRef: requestBody ? requestBody.transRef : initData.transRef
        }
        get(`/1st/bankdemo/api/payment/listTrans`, paging, filtersInput).then(
            (res) => {
                // const { data } = res
                const { content, totalPages } = res.data
                setInitData({
                    ...initData,
                    totalPages: totalPages
                })

                setTableData(content)
                // setTotalPage(totalPages)
                // setData(content)
            }
        ).catch(
            (e) => { throw new Error(e) }
        ).finally(
            // setLoading(false)
        )
    }

    const tblRows = tableData.map((element, index) => (
        <Table.Tr key={element.transRef}>
            <Table.Td>{(initData.page - 1) * initData.size + index}</Table.Td>
            <Table.Td>{element.traceNo}</Table.Td>
            <Table.Td>{element.transRef}</Table.Td>
            <Table.Td>{element.respcode}</Table.Td>
            <Table.Td>{element.benId}</Table.Td>
            <Table.Td>{element.transDate}</Table.Td>
        </Table.Tr>
    ));
    return (
        <div className='relative flex flex-col w-full gap-2'>
            <div id="search" className='flex w-full justify-start items-end bg-red-500 gap-1'>
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
                    // classNames={{
                    //     input: classes.input,
                    //     wrapper: classes.wrapper
                    // }}
                    onChange={handleChangeTraceNo}
                />
                <TextInput
                    label="Số tham chiếu"
                    placeholder="F63"
                    value={initData.transRef}
                    onChange={handleChangeTransRef}
                // classNames={{
                //     input: classes.input,
                //     wrapper: classes.wrapper
                // }}
                />
                <Button variant="filled" className="hover:bg-teal-600" onClick={() => { handleSearch() }}>Tìm kiếm</Button>
                <button type="button" onClick={handleSearch}>test</button>
            </div>
            <div id="paging" className='flex w-full bg-teal-500 gap-1 items-end justify-between'>
                <Select
                    label="Số dòng/ trang"
                    data={rowsPerPage}
                    value={initData.size}
                    searchable
                    nothingFoundMessage="Không tìm thấy ..."
                    // className="w-1/2 md:w-full"
                    maxDropdownHeight={200}
                    onChange={handleChangeRowNum}
                />
                <Pagination.Root total={initData.totalPages} siblings={1} boundaries={1} onChange={handleChangePage}>
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
            <div id="result" className='flex w-full h-full bg-white'>
                {/* <Table.ScrollContainer minWidth={300}> */}
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
                {/* </Table.ScrollContainer> */}
            </div>
        </div>
    )
}

export default Search