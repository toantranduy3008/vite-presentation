/* eslint-disable react/prop-types */
import { Modal, CopyButton, Tooltip, ActionIcon, JsonInput } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import { getUrl } from '../../../services/Utilities'
import classes from './Modal.module.css'
const JsonViewerModal = ({ data, opened, onClose }) => {
    const { protocol, hostName } = getUrl()
    const requestDataString = JSON.stringify(data.request)
    const responseDataString = JSON.stringify(data.response)
    const requestDataJson = requestDataString ? JSON.parse(requestDataString) : ""
    const responseDataJson = responseDataString ? JSON.parse(responseDataString) : ""
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            closeOnClickOutside={true}
            size={"80%"}
            centered
            className='flex flex-col w-full h-ful'
        >
            <div className='relative flex w-full h-full gap-5'>
                <div id="request" className='flex flex-1 flex-col gap-2 max-w-[50%]  justify-start items-start'>
                    <div className='flex w-full justify-start items-center gap-2'>
                        <p className='flex w-fit m-0 italic text-indigo-400 font-semibold'>Bản tin request</p>
                        {protocol === 'https' || hostName === 'localhost' ?
                            <>
                                <CopyButton
                                    value={requestDataJson ? JSON.stringify(requestDataJson, null, 2) : "Không có bản tin request"}
                                    timeout={1000}>
                                    {({ copied, copy }) => (
                                        <Tooltip label={copied ? 'Copied' : 'Copy bản tin request'} position="top">
                                            <ActionIcon variant="transparent" onClick={copy}>
                                                {copied ? (
                                                    <IconCheck />
                                                ) : (
                                                    <IconCopy className="w-6 h-6 text-slate-500 hover:text-indigo-700 hover:scale-125 transition ease-linear duration-150" />
                                                )}
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </CopyButton>
                            </>
                            : null
                        }
                    </div>
                    <div className='flex w-full h-full justify-start items-start border border-dashed border-indigo-400 rounded-md'>
                        {requestDataJson ?
                            <JsonInput
                                validationError="Invalid JSON"
                                formatOnBlur
                                autosize
                                minRows={4}
                                value={JSON.stringify(requestDataJson, null, 2)}
                                className='w-full'
                                classNames={{
                                    input: classes.jsonViewerInput
                                }}
                                readOnly
                            />
                            :
                            <div className='flex w-full h-full p-1 px-2 text-sm'>Không có bản tin request</div>
                        }
                    </div>
                </div>
                <div id="response" className='flex flex-1 flex-col gap-2 justify-start  items-start'>
                    <div className='flex w-full justify-start items-center gap-2'>
                        <p className='flex w-fit m-0 italic text-indigo-400 font-semibold'>Bản tin response</p>
                        {protocol === 'https' || hostName === 'localhost' ?
                            <>
                                <CopyButton value={responseDataJson ? JSON.stringify(responseDataJson, null, 2) : "Không có bản tin response"} timeout={1000}>
                                    {({ copied, copy }) => (
                                        <Tooltip label={copied ? 'Copied' : 'Copy bản tin response'} position="top">
                                            <ActionIcon variant="transparent" onClick={copy}>
                                                {copied ? (
                                                    <IconCheck />
                                                ) : (
                                                    <IconCopy className="w-6 h-6 text-slate-500 hover:text-indigo-700 hover:scale-125 transition ease-linear duration-150" />
                                                )}
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </CopyButton>
                            </>
                            : null
                        }
                    </div>
                    <div className='flex w-full h-full justify-start items-start border border-dashed border-indigo-400 rounded-md'>
                        <div className='flex w-full h-full justify-start items-start'>
                            {/* <pre className='text-sm w-full'> */}
                            {responseDataJson ?
                                <JsonInput
                                    validationError="Invalid JSON"
                                    formatOnBlur
                                    autosize
                                    minRows={4}
                                    value={JSON.stringify(responseDataJson, null, 2)}
                                    className='w-full'
                                    classNames={{
                                        input: classes.jsonViewerInput
                                    }}
                                    readOnly
                                />
                                :
                                <div className='flex w-full h-full p-1 px-2 text-sm'>Không có bản tin response</div>
                            }
                            {/* </pre> */}
                        </div>
                    </div>
                </div>
            </div>
        </Modal >
    )
}

export default JsonViewerModal