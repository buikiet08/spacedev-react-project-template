import { useQuery } from '@/hooks/useQuery'
import { productService } from '@/services/product'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ListProductCart } from '../ProductCart'

function ListProduct({query,link}) {
    const {data,loading} = useQuery({
        queryFn: () => productService.getProduct(query)
    })
  return (
    <>
        <div className='row'>
            <ListProductCart
                loading={loading} 
                data={data?.data}
                loadingCount={8}
                className='col-xl-3'
            />
        </div>
        <div className="row">
            <div className="col-12">
                {/* Link  */}
                <div className="mt-7 text-center">
                <Link className="link-underline" to={link}>Discover more</Link>
                </div>
            </div>
        </div>
    </>
  )
}

export default ListProduct