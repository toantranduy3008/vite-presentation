/* eslint-disable react/prop-types */
import { JsonInput, LoadingOverlay, Modal, Tabs } from '@mantine/core'
import { useEffect, useState } from 'react'
const JsonViewerModal = ({ data, opened, onClose }) => {
    const [loading, setLoading] = useState(false)
    const rawValue = {
        "header": {
            "operation": "inquiry",
            "senderReference": "46517eb8-6d76-43c7-ac85-32cd1b3095b3",
            "timeStamp": "2024-03-11T16:48:09.435+07:00",
            "senderId": "970428",
            "receiverId": "970406",
            "signature": "8H3EUldzrmkpwBaW+mAVhiXQlnH9VyZ7lzF91TZy4F+CgJOPve74fZiRwqR62ktZzzMxdKrEFthyqfphNbaPTw==d"
        },
        "payload": {
            "msgType": "0200",
            "processingCode": "432020",
            "transactionAmount": "000000000000",
            "transDateTime": "0311094809",
            "systemTrace": "358980",
            "localTime": "044809",
            "localDate": "0311",
            "pointOfServiceEntryModeCode": "000",
            "pointOfServiceConditionCode": "00",
            "sendingMember": "970428",
            "referenceNumber": "407109358980",
            "cardAcceptorTerminalId": "00014749",
            "cardAcceptorIdentificationCode": "000000099999999",
            "cardAcceptorNameLocation": "HA NOI       LY THUONG KIET        NAPAS",
            "additionalDataPrivate": {
                "senderName": "Nguyen van napas",
                "senderAddress": "HA NOI - VIET NAM"
            },
            "transactionCurrencyCode": "704",
            "userDefined": "04",
            "serviceCode": "IF_INQ",
            "receivingMember": "970406",
            "senderAcc": "9999777",
            "receiverAcc": "123456",
            "contentTransfers": "NAPAS INQ",
            "PAN": "9999777"
        }
    }

    const tabsList = [
        {
            value: 'inquiry',
            label: 'Vấn tin'
        },
        {
            value: 'deposit',
            label: 'Chuyển khoản'
        },
        {
            value: 'return',
            label: 'Hoàn trả'
        }
    ]
    const jsonValue = JSON.stringify(rawValue, null, 2)
    const [value, setValue] = useState(jsonValue)
    const [requestValue, setRequestValue] = useState('')
    const [responseValue, setResponseValue] = useState('')
    const [selectedTab, setSelectedTab] = useState('inquiry')
    const handleChangeTab = (value) => {
        setSelectedTab(value)
    }

    useEffect(() => {
        //call api
    }, [selectedTab])
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            size={"100%"}
            className='flex flex-col'
        >

            <div className='relative flex w-full h-full gap-1'>
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Tabs
                    defaultValue={selectedTab}
                    value={selectedTab}
                    onChange={handleChangeTab}
                    orientation="vertical"
                    className='w-full flex gap-2'
                >
                    <Tabs.List>
                        {
                            tabsList.map(item =>
                                <Tabs.Tab
                                    key={item.value}
                                    value={item.value}
                                    className={`${selectedTab === item.value ? 'bg-indigo-400 text-white' : 'bg-none text-slate-800'} font-semibold hover:text-white hover:bg-orange-400 `}
                                >
                                    {item.label}
                                </Tabs.Tab>
                            )
                        }
                    </Tabs.List>

                    {
                        tabsList.map(item =>
                            <Tabs.Panel
                                key={item.value}
                                value={item.value}
                                className='relative flex w-full h-full gap-2'
                            >
                                <div className='relative flex flex-col flex-1 w-full h-full gap-2'>
                                    <p className='m-0 p-0 font-semibold text-slate-800 italic'>Bản tin request {data.seqNo}</p>
                                    <JsonInput
                                        formatOnBlur
                                        autosize
                                        minRows={4}
                                        className='w-full h-full'
                                        value={requestValue}
                                        readOnly
                                    />
                                </div>
                                <div className='relative flex flex-col flex-1 w-full h-full gap-2'>
                                    <p className='m-0 p-0 font-semibold text-slate-800 italic'>Bản tin response</p>
                                    <JsonInput
                                        formatOnBlur
                                        autosize
                                        minRows={4}
                                        className='w-full h-full '
                                        value={value}
                                        readOnly
                                    />
                                </div>
                            </Tabs.Panel>
                        )
                    }
                </Tabs>
            </div>
        </Modal>
    )
}

export default JsonViewerModal