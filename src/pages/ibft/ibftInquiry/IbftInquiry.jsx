
import { Button, ScrollArea, Select, TextInput } from '@mantine/core';
import { getWithPaging } from '../../../services/DataServices';

import classes from './IbftInquiry.module.css'
const IbftInquiry = () => {
    const handleSearch = () => {
        getWithPaging()
    }
    return (
        <>
            <div className='flex flex-col md:flex-row gap-2 justify-center items-end px-2 py-1 border border-solid border-indigo-400'>
                <Select
                    label="Hệ thống"
                    placeholder="Pick value"
                    className='flex flex-col w-full'
                    data={['React', 'Angular', 'Vue', 'Svelte']}
                    searchable
                    classNames={{
                        input: classes.input,
                        wrapper: classes.wrapper
                    }}
                />
                <TextInput
                    label="Số lưu vết"
                    placeholder="Input placeholder"
                    className='flex flex-col w-full'
                    classNames={{
                        input: classes.input,
                        wrapper: classes.wrapper
                    }}
                />
                <TextInput
                    label="Số tham chiếu"
                    placeholder="Input placeholder"
                    className='flex flex-col w-full'
                    classNames={{
                        input: classes.input,
                        wrapper: classes.wrapper
                    }}
                />
                {/* <input type="text" name="" id="" /> */}
                <Button variant="filled" >Tìm kiếm</Button>
            </div>
            <div className='flex flex-col md:flex-row py-1 gap-10'>
                <div className="flex flex-1 flex-col">
                    <p>Request</p>
                    <ScrollArea offsetScrollbars scrollbarSize={10} scrollHideDelay={0} className='h-[450px] backdrop-blur-sm px-3 py-1 bg-slate-300'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis error, animi dolores repudiandae magni quia exercitationem nihil ab deserunt inventore! Explicabo magni vel odit tempora facilis id voluptate corrupti cupiditate!
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus reiciendis alias animi tenetur repellat iure enim exercitationem optio et dolore id nihil voluptates, delectus ab eius neque? Quidem, ratione laborum.
                    </ScrollArea>
                </div>
                <div className="flex flex-1 flex-col">
                    <p>Response</p>
                    <ScrollArea offsetScrollbars scrollbarSize={10} scrollHideDelay={0} className='h-[450px] backdrop-blur-sm px-3 py-1 bg-slate-300'>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta repudiandae quas optio provident explicabo cumque, quasi aliquid architecto maxime? Vitae, dolor cum nulla harum error repudiandae veniam qui quis soluta.
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis, dignissimos, rerum debitis, mollitia consequatur in explicabo nostrum quia hic ducimus commodi ad doloribus minima reiciendis illum impedit. Iste, exercitationem accusantium.
                    </ScrollArea>
                </div>
            </div>
        </>
    )
}

export default IbftInquiry