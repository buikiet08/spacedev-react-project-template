import { useRef, useState } from "react"

export const useDebounce = (defaultValue, timing = 300) => {
    const timeRef = useRef()
    const [value,_setValue] = useState(defaultValue)

    const setValue = (value) => {
        if(timeRef.current) {
            clearTimeout(timeRef.current)
        }

        timeRef.current = setTimeout(() => {
            _setValue(value)
        }, timing)
    }
    return [value,setValue]
}