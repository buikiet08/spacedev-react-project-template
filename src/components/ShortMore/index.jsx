import React, { useState } from 'react'
import Button from '../Button'
import { ShortMoreStyle } from './style'

function ShortMore({children,className, ...props}) {
    const [isShorted,setIsShorted] = useState(true)
  return (
    <ShortMoreStyle className={className}>
        <div {...props} style={{height: isShorted ? 300 : 'auto'}} className='content'>
            {children}
        </div>
        <div className='read-more'>
            <Button onClick={() => setIsShorted(!isShorted)} className='btn-xs min-w-[300px]'>{isShorted ? 'Xem thêm' : 'Thu gọn'}</Button>
        </div>
    </ShortMoreStyle>
  )
}

export default ShortMore