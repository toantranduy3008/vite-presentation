/* eslint-disable react/prop-types */
import { Modal, CopyButton, Button } from '@mantine/core'

const JsonViewerModal = ({ data, opened, onClose }) => {

    const dataString = JSON.stringify(data)
    const dataJson = JSON.parse(dataString)
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            closeOnClickOutside={true}
            size={"45%"}
            centered
            className='flex flex-col w-full h-ful'
        >
            <div className='relative flex w-full h-full gap-2'>
                <div className='flex basis-4/5 items-center justify-start border border-indigo-100 border-solid rounded-md bg-slate-200'>
                    <pre className='text-sm'>{JSON.stringify(dataJson, null, 2)}</pre>
                </div>
                <CopyButton value={JSON.stringify(dataJson, null, 2)}>
                    {({ copied, copy }) => (
                        <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    )}
                </CopyButton>
            </div>
        </Modal >
    )
}

export default JsonViewerModal