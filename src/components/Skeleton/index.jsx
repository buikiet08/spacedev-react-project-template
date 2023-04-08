import { cn } from "@/utils"
import { StyleSkeleton } from "./style"

export const Skeleton = ({shape,width,height,children, ...props}) => {
    return <StyleSkeleton className={cn(shape, props.className)} {...props} style={{width,height}}>{children}</StyleSkeleton>
}