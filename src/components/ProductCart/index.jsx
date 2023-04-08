import { PATH } from '@/config/path'
import { useAction } from '@/hooks/useAction'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useCategory } from '@/hooks/useCategories'
import { productService } from '@/services/product'
import { addCartItemAction } from '@/stories/cart'
import { cn, handleError } from '@/utils'
import { currency } from '@/utils/currency'
import { delay } from '@/utils/delay'
import { withListLoading } from '@/utils/withListLoading'
import { message } from 'antd'
import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Rating } from '../Rating'
import { Skeleton } from '../Skeleton'

export const ProductCart = ({className,onRemoveWishSuccess,showRemoveWishist,showWishList,id,images,categories,name,price,real_price,slug,discount_rate,review_count,rating_average}) => {
    const dispatch = useDispatch()
    const {cart} = useCart()
    const img1 = images?.[0]?.thumbnail_url
    const img2 = images?.[1] ? images?.[1]?.thumbnail_url : img1
    const {user} = useAuth()
    const category = useCategory(categories)
    const navigate = useNavigate()
    const flagWishlistRef = useRef(false)
    const onAddWishList = async () => {
        // xử lý click một lần
        if(flagWishlistRef.current) return

        flagWishlistRef.current = true

        // -----------
        const key = `add-wishlist-${id}`
        if(!user) {
            message.error('Bạn vui lòng đăng nhập để sử dụng tính năng này')
        } else {
            try {
                message.loading({
                    key,
                    content:`Đang thêm sản phẩm '${name}' vào yêu thích`,
                    duration:0
                })
                await productService.addWishList(id)
                // await delay(500)
                message.success({
                    key,
                    content:`Đã thêm sản phẩm '${name}' vào yêu thích thành công`
                })
            } catch (error) {
                handleError(error, key)
            }
        }

        flagWishlistRef.current = false
    }

    // sd useAction
    const onRemoveWishList = useAction({
        service: () => productService.removeWishList(id),
        loadingMessage:`Đang xóa sản phẩm '${name}' khỏi yêu thích`,
        successMessage:`Đã xóa sản phẩm '${name}' khỏi yêu thích thành công`,
        onSuccess: onRemoveWishSuccess
    })
    // const onRemoveWishList = async () => {
    //     const key = `add-wishlist-${id}`
    //     try {
    //         message.loading({
    //             key,
    //             content:`Đang xóa sản phẩm '${name}' khỏi yêu thích`,
    //             duration:0
    //         })
    //         await productService.removeWishList(id)
    //         // await delay(500)
    //         message.success({
    //             key,
    //             content:`Đã xóa sản phẩm '${name}' khỏi yêu thích thành công`
    //         })
    //         onRemoveWishSuccess?.(id)
    //     } catch (error) {
    //         handleError(error, key)
    //     }
    // }
    const onAddItem = () => {
        if(user) {
            // kiểm tra nêu sp đã dc thêm vào giỏ thì update + 1 , ngược lại = 1
            const {listItems} = cart
            const product = listItems.find(e => e.productId === id)
            dispatch(addCartItemAction({
                productId:id,
                quantity:product ? product.quantity + 1 : 1,
                showPopover:true
            }))
        } else {
            navigate(PATH.Account)
        }
        
    }
    return (
        <div className={cn('col-6 col-md-4', className)}>
            {/* Card */}
            <div className="product-card card mb-7">
                {/* Badge */}
                {
                    discount_rate > 0 &&
                    <div className="card-sale badge badge-dark card-badge card-badge-left text-uppercase">
                        - {discount_rate} %
                    </div>
                }
                {/* Image */}
                <div className="card-img">
                    {/* Image */}
                    <Link className="card-img-hover" to={`/${slug}`}>
                        <img className="card-img-top card-img-back" src={img1} alt="..." />
                        <img className="card-img-top card-img-front" src={img2} alt="..." />
                    </Link>
                    {/* Actions */}
                    <div className="card-actions">
                        <span className="card-action">
                        </span>
                        <span className="card-action">
                            <button onClick={onAddItem} className="btn btn-xs btn-circle btn-white-primary" data-toggle="button">
                                <i className="fe fe-shopping-cart" />
                            </button>
                        </span>
                        {
                            showWishList &&
                            <span className="card-action">
                                <button onClick={onAddWishList} className="btn btn-xs btn-circle btn-white-primary" data-toggle="button">
                                    <i className="fe fe-heart" />
                                </button>
                            </span>
                        }
                        {
                            showRemoveWishist &&
                            <span className="card-action">
                                <button onClick={onRemoveWishList} className="btn btn-xs btn-circle btn-white-primary" data-toggle="button">
                                    <i className="fe fe-x" />
                                </button>
                            </span>
                        }
                    </div>
                </div>
                {/* Body */}
                <div className="card-body px-0">
                    {/* Category */}
                    <div className="card-product-category font-size-xs">
                        {category && <a className="text-muted" href="shop.html">{category?.title}</a>}
                    </div>
                    {/* Title */}
                    <div className="card-product-title font-weight-bold">
                        <a className="text-body card-product-name" href="product.html">
                            {name}
                        </a>
                    </div>
                    <div className="card-product-rating">
                        {
                            review_count > 0 &&
                            <>
                                {rating_average}
                                <Rating value={rating_average} />
                                ({review_count} review)
                            </>
                        }
                    </div>
                    {/* Price */}
                    <div className="card-product-price">
                        {
                            real_price < price ? <>
                                <span className="text-primary sale">{currency(real_price)}</span>
                                <span className="font-size-xs text-gray-350 text-decoration-line-through ml-1">{currency(price)}</span>
                            </> :
                            <span className="text-2xl flex h-full items-end leading-6">{currency(real_price)}</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


export const LoadingProductCart = ({className}) => {
    return (
        <div className={cn('col-6 col-md-4', className)}>
            {/* Card */}
            <div className="product-card card mb-7">
                {/* Badge */}
                {/* Image */}
                <div className="card-img">
                    {/* Image */}
                    <Skeleton height={300} />
                </div>
                {/* Body */}
                <div className="card-body px-0">
                    {/* Category */}
                    <div className="card-product-category font-size-xs">
                        <a className="text-muted" href="shop.html"> <Skeleton height={'100%'} width={150} /></a>
                    </div>
                    {/* Title */}
                    <div className="card-product-title font-weight-bold">
                        <a className="text-body card-product-name" href="product.html">
                        <Skeleton height={'100%'} />
                        </a>
                    </div>
                    <div className="card-product-rating">
                        <Skeleton height={'100%'} width={150} />
                    </div>
                    {/* Price */}
                    <div className="card-product-price">
                        <Skeleton height={'100%'} width={150} />
                    </div>
                </div>
            </div>
        </div>
    )
}


export const ListProductCart = withListLoading(ProductCart,LoadingProductCart)