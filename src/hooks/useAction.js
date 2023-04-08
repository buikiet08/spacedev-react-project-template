import { handleError } from "@/utils"
import { message } from "antd"
import { useId, useRef } from "react"

export const useAction = ({
    service, 
    successMessage,
    loadingMessage,
    onSuccess,
    retry = true
}) => {
    const flagActionRef = useRef(false)
    const key = useId()
    const onAction = async (...args) => {
        if(flagActionRef.current) return

        flagActionRef.current = true
        try {
            if(loadingMessage) {
                message.loading({
                    key,
                    content:loadingMessage,
                    duration:0
                })
            }
            await service(...args)
            if(successMessage) {
                message.success({
                    key,
                    content:successMessage
                })
            } else{
                // trường hợp user k truyền successMessage thì dùng hàm destroy truyền key để loại bỏ các mess có key cùng nhau
                message.destroy(key)
            }
            // truyền ?.() để khi user k truyền thì k xảy ra lỗi
            onSuccess?.()
        } catch (error) {
            // truyền key vào handleError để trong trường hợp service gặp lỗi thì key sẽ giúp tắt message có key cung nhau
            handleError(error, key)
        }

        if(retry) {
            flagActionRef.current = false
        }
    }

    return onAction
}