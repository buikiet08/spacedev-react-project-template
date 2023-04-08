import { useDebounce } from '@/hooks/useDebounce'
import { useQuery } from '@/hooks/useQuery'
import { productService } from '@/services/product'
import { currency, sluify } from '@/utils'
import { Drawer } from 'antd'
import React, { useState } from 'react'
import { Skeleton } from '../Skeleton'
import queryString from 'query-string'
import { PATH } from '@/config/path'
import { generatePath, Link } from 'react-router-dom'
import { useCategories, useCategory } from '@/hooks/useCategories'

export const SearchDrawer = ({ open, onClose }) => {
    const [value, setValue] = useDebounce('')
    const [cateId,setCateId] = useState(0)
    const {data:dataCategories} = useCategories()
    const category = useCategory(parseInt(cateId))
    const qsSearch = queryString.stringify({
        fields: `thumbnail_url,name,price,real_price&limit`,
        limit:5,
        name:value,
        categories: cateId || undefined,
    })
    const {data,loading,refetch: searchService} = useQuery({
        queryKey: [qsSearch],
        queryFn: ({signal}) => productService.getProduct(`?${qsSearch}`, signal),
        enabled: !!value,
    })
    
    
    const onSearch = async () => {
        if (value.trim()) {
            searchService()
        }
    }


    const qs = queryString.stringify({
        search: value,
        categories: cateId
    })

    const linkViewAll = (category ? generatePath(PATH.Category, {slug : sluify(category.title), id: category.id}) : PATH.Product) + `?${qs}`
    return (
        <Drawer width={470} open={open} onClose={onClose} headerStyle={{ display: 'none' }} bodyStyle={{ padding: 0 }}>
            <div className="modal-content">
                {/* Close */}
                <button onClick={onClose} type="button" className="close !outline-none" data-dismiss="modal" aria-label="Close">
                    <i className="fe fe-x" aria-hidden="true" />
                </button>
                {/* Header*/}
                <div className="modal-header line-height-fixed font-size-lg">
                    <strong className="mx-auto">Search Products</strong>
                </div>
                {/* Body: Form */}
                <div className="modal-body">
                    <div>
                        <div className="form-group">
                            <label className="sr-only" htmlFor="modalSearchCategories">Categories:</label>
                            <select className="custom-select" id="modalSearchCategories" onChange={ev => setCateId(ev.target.value)}>
                                <option value={0}>All Categories</option>
                                {
                                    dataCategories?.data?.map(e => (<option value={e.id} key={e.id}>{e.title}</option>))
                                }
                            </select>
                        </div>
                        <div className="input-group input-group-merge">
                            <input onChange={ev => setValue(ev.target.value)} className="form-control" type="search" placeholder="Search" />
                            <div className="input-group-append">
                                <button onClick={onSearch} className="btn btn-outline-border" type="submit">
                                    <i className="fe fe-search" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Body: Results (add `.d-none` to disable it) */}
                <div className="modal-body border-top font-size-sm">
                    {/* Heading */}
                    <p>Search Results:</p>
                    {/* Items */}
                    {
                        !loading && !data && (
                            <div className="modal-body border">
                                {/* Text */}
                                <p className="mb-3 font-size-sm text-center">
                                    Tìm sản phẩm bạn muốn tìm
                                </p>
                            </div>
                        )
                    }
                    {
                        loading ? Array.from(Array(5)).map((_,i) => (
                            <SearchItemLoading key={i} />
                        )) : data?.data?.length === 0 ? (
                            <div className="modal-body border">
                                {/* Text */}
                                <p className="mb-3 font-size-sm text-center">
                                    Không tìm thấy sản phẩm bạn muốn
                                </p>
                                <p className="mb-0 font-size-sm text-center">
                                    😞
                                </p>
                            </div>
                        ) :
                        data?.data?.map(e => <SearchItem key={e.id} {...e} />)
                    }
                    {/* Button */}
                    {data?.data?.length > 0 && (
                        <Link onClick={onClose} className="btn btn-link px-0 text-reset" to={linkViewAll}>
                            Tất cả sản phẩm <i className="fe fe-arrow-right ml-2" />
                        </Link>
                    )}
                </div>
                {/* Body: Empty (remove `.d-none` to disable it) */}
                
            </div>
        </Drawer>
    )
}

const SearchItem = ({name,price,real_price,thumbnail_url}) => {
    return (
        <div className="row align-items-center position-relative mb-5">
            <div className="col-4 col-md-3">
                {/* Image */}
                <img className="img-fluid" src={thumbnail_url} alt={name} />
            </div>
            <div className="col position-static">
                {/* Text */}
                <p className="mb-0 font-weight-bold">
                    <a className="stretched-link text-body line-clamp-2" href="./product.html">{name}</a> <br />
                </p><div className="card-product-price">
                    {
                        real_price < price ? 
                        <>
                            <span className="sale text-primary">{currency(real_price)}</span>
                            <span className="text-muted line-through ml-1 inline-block">{currency(price)}</span>
                        </> : <span className="text-muted inline-block">{currency(real_price)}</span>
                    }
                </div>
                <p />
            </div>
        </div>
    )
}

const SearchItemLoading = () => {
    return (
        <div className="row align-items-center position-relative mb-5">
            <div className="col-4 col-md-3">
                {/* Image */}
                <Skeleton height={86.81} />
            </div>
            <div className="col position-static">
                {/* Text */}
                <p className="mb-0 font-weight-bold">
                    <a className="stretched-link text-body" href="#"><Skeleton height={20} /></a><br/>
                </p>
                <div className="card-product-price">
                    <Skeleton height={43} width={150} />
                </div>
            </div>
        </div>
    )
}
