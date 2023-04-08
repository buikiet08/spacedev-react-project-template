import { cn } from "@/utils"
import { SelectStyle } from "./style"

export const Select = ({children,error,...props}) => {
    return (
        <SelectStyle {...props} onChange={ev => props?.onChange?.(ev.target.value)} className={cn('custom-select', {'border !border-[red] text-[red]': error})}>{children}</SelectStyle>
    )
}