import Paginate from '@/components/Paginate/Paginate'
import { Portal } from '@/components/Portal'
import { LoadingProductCart, ProductCart } from '@/components/ProductCart'
import { PROFILE_TITLE_ID } from '@/config'
import { useQuery } from '@/hooks/useQuery'
import { useSearch } from '@/hooks/useSearch'
import { productService } from '@/services/product'
import queryString from 'query-string'
import React from 'react'

function Wishlist() {
    const [search] = useSearch({
        page:1
    })
    const qs = queryString.stringify({
        page:search.page
    })
    // page này k sd keepPrivousData
    const {data,loading, refetch: fetchWishlist, clearKeepPrivousData} = useQuery({
        queryKey: [qs],
        keepPrivousData:true,
        queryFn: () => productService.getWishList(`?${qs}`)
    })
    return (
        <>
            {/* Products */}
            <Portal selector={PROFILE_TITLE_ID}>Sản phẩm yêu thích</Portal>
            {/* Products */}
            <div className="row">
                {
                    loading ? Array.from(Array(15)).map((_, i) => <LoadingProductCart key={i} />) :
                        data?.data?.map(e => <ProductCart onRemoveWishSuccess={() => {
                            clearKeepPrivousData()
                            fetchWishlist()
                        }} showRemoveWishist key={e.id} {...e} />)
                }
            </div>
            {/* Pagination */}
            <Paginate totalPage={data?.paginate?.totalPage} />
        </>
    )
}

export default Wishlist