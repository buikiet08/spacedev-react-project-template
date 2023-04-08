import { cn } from '@/utils'
import React, { useId } from 'react'
import { ErrorStyle, FieldStyle } from './style'

function Field({label,error,renderField,onChange,...props}) {
    const id = useId()

    const _onChange = (ev) => {
        onChange?.(ev.target.value)
    }
    return (
        <FieldStyle className={cn('form-group relative', {error})}>
            {label && <label className="sr-only" htmlFor={id}>
                {label}
            </label>}
            {
                renderField ? renderField({...props,label,error,onChange,id}) : <input onChange={_onChange} {...props} className="form-control form-control-sm" />
            }
            {error && <ErrorStyle>{error}</ErrorStyle>}
        </FieldStyle>
    )
}

export default Field