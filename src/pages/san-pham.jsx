import { Breadcrumb } from '@/components/Breadcrumb'
import Paginate from '@/components/Paginate/Paginate'
import {ProductCart, LoadingProductCart } from '@/components/ProductCart'
import { Skeleton } from '@/components/Skeleton'
import { PATH } from '@/config/path'
import { useCategory } from '@/hooks/useCategories'
import { useCurrentPage } from '@/hooks/useCurrentPage'
import { useQuery } from '@/hooks/useQuery'
import { productService } from '@/services/product'
import { cn, sluify } from '@/utils'
import queryString from 'query-string'
import React from 'react'
import { generatePath, Link, useParams, useSearchParams } from 'react-router-dom'

import { Pagination} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

function ProductPage() {
    const { id } = useParams()
    const currentPage = useCurrentPage()
    const [search,setSearch] = useSearchParams()
    const searchProduct = search.get('search')
    // lọc sp
    const sort = search.get('sort') || 'newest'

    const qs = queryString.stringify({
        page: currentPage,
        fields : `name,real_price,price,categories,slug,id,images,discount_rate,review_count,rating_average`,
        categories: id,
        name : searchProduct,
        sort
    })
    const {data,loading} = useQuery({
        queryKey : [qs],
        keepPrivousData : true,
        queryFn: ({signal}) => productService.getProduct(`?${qs}`, signal)
        // dependencyList : [currentPage]
    })

    const {data:dataCategories,loading:loadingCategories} = useQuery({
        queryFn: () => productService.getCategories()
    })
    // id lấy về thường có dạng string
    const category = useCategory(parseInt(id))
    return (
        <section className="py-11">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-4 col-lg-3">
                        {/* Filters */}
                        <form className="mb-10 mb-md-0">
                            <ul className="nav nav-vertical" id="filterNav">
                                <li className="nav-item">
                                    {/* Toggle */}
                                    <a className="nav-link font-size-lg text-reset border-bottom mb-6" href="#categoryCollapse">
                                        Category
                                    </a>
                                    {/* Collapse */}
                                    <div>
                                        <div className="form-group">
                                            <ul className="list-styled mb-0" id="productsNav">
                                                <li className="list-styled-item">
                                                    <Link className={cn('list-styled-link', {'font-bold' : !id})} to={PATH.Product}>
                                                        Tất cả sản phẩm
                                                    </Link>
                                                </li>
                                                
                                                {
                                                    loadingCategories ? 
                                                    Array.from(Array(10)).map((_,i) => (
                                                        <li key={i} className="list-styled-item">
                                                            {/* Toggle */}
                                                            <a className="list-styled-link">
                                                            <Skeleton height={24} />
                                                            </a>
                                                        </li>
                                                    )) :
                                                    dataCategories?.data?.map(e => (
                                                        <li key={e.id} className="list-styled-item">
                                                            {/* Toggle */}
                                                            <Link className={cn('list-styled-link', {'font-bold': e.id == id})} to={generatePath(PATH.Category, {slug : sluify(e.title), id:e.id})}>
                                                                {e.title}
                                                            </Link>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li className="nav-item">
                                    {/* Toggle */}
                                    <a className="nav-link font-size-lg text-reset border-bottom mb-6" href="#seasonCollapse">
                                        Rating
                                    </a>
                                    {/* Collapse */}
                                    <div>
                                        <div className="form-group form-group-overflow mb-6" id="seasonGroup">
                                            <div className="custom-control custom-radio mb-3">
                                                <input className="custom-control-input" type="radio" defaultChecked />
                                                <label className="custom-control-label flex items-center" htmlFor="seasonOne">
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    <span className="text-small inline-block ml-2">from 5 star</span>
                                                </label>
                                            </div>
                                            <div className="custom-control custom-radio mb-3">
                                                <input className="custom-control-input" id="seasonTwo" type="radio" />
                                                <label className="custom-control-label flex items-center" htmlFor="seasonOne">
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={14} height={14} viewBox="0 0 12 12" className="star-icon"><g fill="none" fillRule="evenodd"><path fill="#b8b8b8" transform="matrix(-1 0 0 1 11 1)" d="M5 0v8.476L1.91 10l.424-3.562L0 3.821l3.353-.678L5 0z" /><path fill="#b8b8b8" transform="translate(1 1)" d="M5 0v8.476L1.91 10l.424-3.562L0 3.821l3.353-.678L5 0z" /></g></svg>
                                                    <span className="text-small inline-block ml-2">from 4 star</span>
                                                </label>
                                            </div>
                                            <div className="custom-control custom-radio">
                                                <input className="custom-control-input" id="seasonThree" type="radio" />
                                                <label className="custom-control-label flex items-center" htmlFor="seasonOne">
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={14} height={14} viewBox="0 0 12 12" className="star-icon"><g fill="none" fillRule="evenodd"><path fill="#b8b8b8" transform="matrix(-1 0 0 1 11 1)" d="M5 0v8.476L1.91 10l.424-3.562L0 3.821l3.353-.678L5 0z" /><path fill="#b8b8b8" transform="translate(1 1)" d="M5 0v8.476L1.91 10l.424-3.562L0 3.821l3.353-.678L5 0z" /></g></svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={14} height={14} viewBox="0 0 12 12" className="star-icon"><g fill="none" fillRule="evenodd"><path fill="#b8b8b8" transform="matrix(-1 0 0 1 11 1)" d="M5 0v8.476L1.91 10l.424-3.562L0 3.821l3.353-.678L5 0z" /><path fill="#b8b8b8" transform="translate(1 1)" d="M5 0v8.476L1.91 10l.424-3.562L0 3.821l3.353-.678L5 0z" /></g></svg>
                                                    <span className="text-small inline-block ml-2">from 3 star</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="nav-item">
                                    {/* Toggle */}
                                    <a className="nav-link font-size-lg text-reset border-bottom mb-6" data-toggle="collapse" href="#priceCollapse">
                                        Price
                                    </a>
                                    {/* Collapse */}
                                    <div>
                                        {/* Range */}
                                        <div className="d-flex align-items-center">
                                            {/* Input */}
                                            <input type="number" className="form-control form-control-xs" placeholder="$10.00" min={10} />
                                            {/* Divider */}
                                            <div className="text-gray-350 mx-2">‒</div>
                                            {/* Input */}
                                            <input type="number" className="form-control form-control-xs" placeholder="$350.00" max={350} />
                                        </div>
                                        <button className="btn btn-outline-dark btn-block mt-5">Apply</button>
                                    </div>
                                </li>
                            </ul>
                        </form>
                    </div>
                    <div className="col-12 col-md-8 col-lg-9">
                        {/* Slider */}
                        <Swiper
                        // spaceBetween={50}
                        slidesPerView={1}
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        autoplay={true}
                        onSlideChange={() => console.log('slide change')}
                        // onSwiper={(swiper) => console.log(swiper)}
                        >
                            <SwiperSlide>
                                <div className="w-100">
                                    <div className="card bg-h-100 bg-left" style={{ backgroundImage: 'url(/img/covers/cover-24.jpg)' }}>
                                        <div className="row" style={{ minHeight: 400 }}>
                                            <div className="col-12 col-md-10 col-lg-8 col-xl-6 align-self-center">
                                                <div className="card-body px-md-10 py-11">
                                                    <h4>
                                                        2019 Summer Collection
                                                    </h4>
                                                    <a className="btn btn-link px-0 text-body" href="shop.html">
                                                        View Collection <i className="fe fe-arrow-right ml-2" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-2 col-lg-4 col-xl-6 d-none d-md-block bg-cover" style={{ backgroundImage: 'url(/img/covers/cover-16.jpg)' }} />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="w-100">
                                    <div className="card bg-cover" style={{ backgroundImage: 'url(/img/covers/cover-29.jpg)' }}>
                                        <div className="row align-items-center" style={{ minHeight: 400 }}>
                                            <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                                                <div className="card-body px-md-10 py-11">
                                                    <h4 className="mb-5">Get -50% from Summer Collection</h4>
                                                    <p className="mb-7">
                                                        Appear, dry there darkness they're seas. <br />
                                                        <strong className="text-primary">Use code 4GF5SD</strong>
                                                    </p>
                                                    <a className="btn btn-outline-dark" href="shop.html">
                                                        Shop Now <i className="fe fe-arrow-right ml-2" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="w-100">
                                    <div className="card bg-cover" style={{ backgroundImage: 'url(/img/covers/cover-30.jpg)' }}>
                                        <div className="row align-items-center" style={{ minHeight: 400 }}>
                                            <div className="col-12">
                                                <div className="card-body px-md-10 py-11 text-center text-white">
                                                    <p className="text-uppercase">Enjoy an extra</p>
                                                    <h1 className="display-4 text-uppercase">50% off</h1>
                                                    <a className="link-underline text-reset" href="shop.html">Shop Collection</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                        {/* Header */}
                        <div className="row align-items-center mb-7 pt-4">
                            <div className="col-12 col-md">
                                {/* Heading */}
                                <h3 className="mb-1">{category ? category?.title : 'Tất cả sản phẩm'}</h3>
                                {/* Breadcrumb */}
                                <Breadcrumb>
                                    <Breadcrumb.Title to={PATH.Home}>Home</Breadcrumb.Title>
                                    <Breadcrumb.Title>{category ? category?.title : 'Tất cả sản phẩm'}</Breadcrumb.Title>
                                </Breadcrumb>
                                {/* <ol className="breadcrumb mb-md-0 font-size-xs text-gray-400">
                                    <li className="breadcrumb-item">
                                        <a className="text-gray-400" href="index.html">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        Women's Clothing
                                    </li>
                                </ol> */}
                            </div>
                            <div className="col-12 col-md-auto flex gap-1 items-center whitespace-nowrap">
                                {/* Select */}
                                Sắp xếp theo:
                                <select value={sort} onChange={ev => setSearch(`sort=${ev.target.value}`)} className="custom-select custom-select-xs">
                                    <option value='newest'>Mới nhất</option>
                                    <option value='real_price.desc'>Giá giảm dần</option>
                                    <option value='real_price.asc'>Giá tăng dần</option>
                                    <option value='discount_price.desc'>Giảm giá nhiều nhất</option>
                                    <option value='rating_average.desc'>Đánh giá cao nhất</option>
                                    <option value='top_sell'>Mua nhiều nhất</option>
                                </select>
                            </div>
                        </div>
                        {
                            searchProduct && <h4 className="mb-5 text-2xl">Kết quả tìm kiếm cho `{searchProduct}`</h4>
                        }
                        {/* Products */}
                        <div className="row">
                            {
                                loading ? Array.from(Array(15)).map((_,i) => <LoadingProductCart key={i} />) :
                                data?.data?.map(e => <ProductCart showWishList key={e.id} {...e} />)
                            }
                        </div>
                        {/* Pagination */}
                        <Paginate totalPage={data?.paginate?.totalPage} />
                    </div>
                </div>
            </div>
        </section>

    )
}

export default ProductPage