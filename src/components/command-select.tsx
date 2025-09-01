import {ReactNode, useState } from "react";
import { ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react";
import {cn} from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
    CommandResponsiveDialog,

} from "@/components/ui/command";
import { boolean } from "drizzle-orm/gel-core";

interface Props{
    options: Array<{
        id: string;
        value: string;
        children: ReactNode;
    }>;
    onSelect: (value: string)=> void;
    onSearch?: (value: string)=> void;
    value: string;
    placeholder?: boolean;
    isSearchable?: boolean;
    className?: string;
};
export const CommandSelect =({
    options,
    onSelect,
    onSearch,
    value,
    placeholder,
    className,
}:Props)=>{
const [open, setOpen] = useState(false);
const selectedOption= options.find((option)=>option.value == value);
const handledOpenChange = (open: boolean) =>{
    onSearch?.("");
    setOpen(open);
}
return (
    <>
    <Button
    onClick={()=> setOpen(true)}
    type="button"
    variant="outline">
        <div>{selectedOption?.children ?? placeholder}
            </div>
            <ChevronsUpDownIcon/>
            </Button>
            <CommandResponsiveDialog
            shouldFilter={!onSearch}
            open={open}
            onOpenChange={handledOpenChange}
            >
                <CommandInput placeholder="Search..." onValueChange={onSearch}/>
                <CommandList>
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No options found
                        </span>
                    </CommandEmpty>
                    {options.map((option)=>(
                        <CommandItem
                        key={option.id}
                        onSelect={()=>{
                            onSelect(option.value)
                            setOpen(false);
                        }}>{option.children}</CommandItem>
                    ))}
                </CommandList>
                </CommandResponsiveDialog>
                </>
);
};