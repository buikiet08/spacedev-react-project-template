import React from 'react'
import { LoadingOutlined} from '@ant-design/icons'

function Button({children,loading, ...props}) {
    return (
        <button className={`btn btn-sm btn-dark flex items-center ${loading && 'cursor-not-allowed'}`} {...props}>
            {loading && <LoadingOutlined className='mr-2' />}
            {children}
        </button>
    )
}

export default Button