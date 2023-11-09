import { ActionIcon, Button, Divider, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates"
import { useState } from "react";
import classes from './Inquiry.module.css'
import { IconSearch } from "@tabler/icons-react";
const Inquiry = () => {
    const [date, setDate] = useState(new Date());
    const [refCode, setRefCode] = useState('')

    const handleChangeDate = (e) => {
        setDate(e)
    }

    const handleChangeRefCode = (e) => {
        setRefCode(e.target.value)
    }
    return (
        <div className="flex flex-col min-h-screen w-full items-center ">
            <div className="flex h-14 max-h-24 w-full max-w-xl bg-white items-center rounded-md p-2 gap-2">
                <DatePickerInput
                    valueFormat="DD/MM/YYYY"
                    value={date}
                    onChange={handleChangeDate}
                    size="sm"
                    fullWidth
                    classNames={{
                        input: classes.input,
                        wrapper: classes.wrapper,
                        root: classes.root
                    }}
                />
                <Divider variant="dashed" orientation="vertical" />
                <TextInput
                    placeholder="Mã giao dịch"
                    value={refCode}
                    onChange={handleChangeRefCode}
                    size="sm"
                    className="flex flex-1"
                    classNames={{
                        input: classes.input,
                        wrapper: classes.wrapper,
                        root: classes.root
                    }}
                />
                <ActionIcon
                    variant="default"
                    size="xl"
                    radius={"xl"}
                    className="border-none hover:bg-indigo-300 hover:text-white"
                >
                    <IconSearch stroke={1.5} />
                </ActionIcon>
            </div>
        </div>
    )
}

export default Inquiry