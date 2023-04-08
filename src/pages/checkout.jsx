import { AddressCard } from '@/components/AddressCard'
import AddressDrawer from '@/components/AddressDrawer'
import Button from '@/components/Button'
import { CartItem } from '@/components/CartItem'
import Field from '@/components/Field'
import { PATH } from '@/config/path'
import { useCart } from '@/hooks/useCart'
import { useForm } from '@/hooks/useForm'
import { useQuery } from '@/hooks/useQuery'
import { cartService } from '@/services/cart'
import { userService } from '@/services/user'
import { cartActions } from '@/stories/cart'
import { currency, handleError, regexp, required, storeAddressSelect, storeCart, storePreCheckoutData, storePreCheckoutResponse } from '@/utils'
import { Radio, Spin } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'


const rules = {
    fullName: [required()],
    email: [required(), regexp('email')],
    phone: [required(), regexp('phone')],
    province: [required()],
    district: [required()],
    address: [required()],
}
function Checkout() {
    const { prevCheckoutResponse,preCheckoutLoading,prevCheckoutData } = useCart()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const paymentRef = useRef('money')
    const noteRef = useRef('')
    const [openAddressDrawer, setOpenAddressDrawer] = useState(false)
    const [address, setAddress] = useState(() => storeAddressSelect.get())
    console.log(address)
    const {loading: addressDefaultLoading } = useQuery({
        enabled:!address,
        queryFn: () => userService.getAddress('?default=true'),
        onSuccess: (res) => {
            if (res?.data?.[0]) {
                setAddress(res?.data?.[0])
            }
        }
    })
    const {data:shippingMethod, loading:shippingMethodLoading} = useQuery({
        queryFn:() => cartService.shippingMethod()
    })
    const {loading:loadingCheckout, refetch: checkoutService} = useQuery({
        queryFn:({params}) => cartService.checkout(...params)
    })
    const form = useForm(rules)
    useEffect(() => {
        if (!prevCheckoutResponse?.listItems) {
            navigate(PATH.ViewCart)
        }
    }, [])
    // const address = addressDefault?.data?.[0]
    const { listItems } = prevCheckoutResponse

    const onSubmit = async () => {
        let _address = address
        if(!address) {
            if(form.validate()) {
                _address = form.values
            }else{
                return
            }
       }
       const res = await checkoutService({
            shipping:{
                shippingMethod:prevCheckoutResponse?.shipping?.shippingMethod,
                ..._address
            },
            listItems: prevCheckoutData?.listItems,
            promotionCode: prevCheckoutData?.promotionCode,
            payment:{
                paymentMethod: paymentRef.current
            },
            note:noteRef.current
       })
        dispatch(cartActions.clearCart())
        //    tự tạo địa chỉ cho user khi chưa có địa chỉ
        if(!address) {
            userService.addAddress(_address);
        }

        navigate(PATH.OrderComplete, {state: res.data})
        if(res.data) {
            storeAddressSelect.clear()
            storePreCheckoutData.clear()
            storePreCheckoutResponse.clear()
            // dispatch(cartActions.setCart(null))
            // dispatch(cartActions.clearCart())
            
        }

    }
    const { promotion } = prevCheckoutResponse
    return (
        <>
            <AddressDrawer onSelect={e => {
                storeAddressSelect.set(e)
                setAddress(e)
            }} open={openAddressDrawer} onClose={() => setOpenAddressDrawer(false)} />
            <div>
                <section className="pt-7 pb-12">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 text-center">
                                {/* Heading */}
                                <h3 className="mb-4">Checkout</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-7">
                                <div className="max-w-[300px] mb-5">
                                    <Link to={PATH.ViewCart} className="btn btn-outline-dark btn-xs w-full">Quay trở lại giỏ hàng</Link>
                                </div>
                                {/* Form */}
                                {/* Heading */}
                                <h6 className="mb-7">Shipping Details</h6>
                                {
                                    addressDefaultLoading ? <div className="row"><AddressCard loading /></div> :
                                        address ?
                                            <div className="row">
                                                <AddressCard className="border bg-white" action={
                                                    <div onClick={() => setOpenAddressDrawer(true)} class="btn btn-outline-dark btn-xs absolute top-5 right-5" data-toggle="modal" href="#modalCheckoutAddress">
                                                        Thay đổi địa chỉ khác
                                                    </div>
                                                } {...address} />
                                            </div> :
                                            <div className="row">
                                                <div className="col-12">
                                                    <Field
                                                        label='Full Name *'
                                                        placeholder='Full Name *'
                                                        {...form.register('fullName')}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <Field
                                                        label='Phone Number*'
                                                        placeholder='Phone Number*'
                                                        {...form.register('phone')}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <Field
                                                        label='Email Address *'
                                                        placeholder='Email Address *'
                                                        {...form.register('email')}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <Field
                                                        label='District *'
                                                        placeholder='District *'
                                                        {...form.register('district')}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <Field
                                                        label='Province / City *'
                                                        placeholder='Province / City *'
                                                        {...form.register('province')}
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <Field
                                                        label='Address *'
                                                        placeholder='Address *'
                                                        {...form.register('address')}
                                                    />
                                                </div>
                                            </div>
                                }
                                {/* Heading */}
                                <h6 className="mb-7">Shipping Method</h6>
                                {/* Shipping details */}
                                <div className="table-responsive mb-6">
                                    <Spin spinning={shippingMethodLoading}>
                                    <Radio.Group onChange={vl => dispatch(cartActions.setShippingMethod(vl.target.value))} defaultValue={prevCheckoutResponse?.shipping?.shippingMethod}>
                                        <table className="table table-bordered table-sm table-hover mb-0">
                                            <tbody>
                                                {
                                                    shippingMethod?.data?.map(e => (
                                                        <tr key={e?.id}>
                                                            <td className='whitespace-nowrap'>
                                                                <Radio value={e.code}>{e.title}</Radio>
                                                            </td>
                                                            <td>{e.description}</td>
                                                            <td>{currency(e.price)}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </Radio.Group>
                                    </Spin>
                                </div>
                                {/* Heading */}
                                <h6 className="mb-7">Payment</h6>
                                {/* List group */}
                                <div className="list-group list-group-sm mb-7">
                                    <Radio.Group onChange={vl => paymentRef.current = vl} defaultValue='money'>
                                        <div className="list-group-item">
                                            {/* Radio */}
                                            <div className="custom-control custom-radio">
                                                <Radio value="card">
                                                    Credit Card <img className="ml-2" src="/img/brands/color/cards.svg" alt="..." />
                                                </Radio>
                                            </div>
                                        </div>
                                        <div className="list-group-item">
                                            {/* Radio */}
                                            <div className="custom-control custom-radio">
                                                <Radio value="money">
                                                    Trả tiền khi nhận hàng
                                                </Radio>
                                            </div>
                                        </div>
                                    </Radio.Group>
                                </div>
                                {/* Notes */}
                                <textarea onChange={ev => noteRef.current = ev.target.value} className="form-control form-control-sm mb-9 mb-md-0 font-size-xs" rows={5} placeholder="Order Notes (optional)" defaultValue={""} />
                            </div>
                            <div className="col-12 col-md-5 col-lg-4 offset-lg-1">
                                {/* Heading */}
                                <h6 className="mb-7">Order Items (3)</h6>
                                {/* Divider */}
                                <hr className="mt-7 mb-0" />
                                {/* List group */}
                                <div className="product-card">
                                    <div className="card-body">
                                        <ul className="list-group list-group-lg list-group-flush">
                                            {
                                                listItems?.map(e => <CartItem className="px-0" hiddenAction key={e.id} {...e} footer={<>x{e.quantity} = {e.price} <u>vnđ</u></>} />)
                                            }

                                            {/*<li className="list-group-item px-0">
                                                <div className="row align-items-center">
                                                    <div className="col-4">
                                                        <a href="./product.html">
                                                            <img className="img-fluid" src="./img/products/product-10.jpg" alt="..." />
                                                        </a>
                                                    </div>
                                                    <div className="col-8">
                                                        <p className="font-size-sm mb-6">
                                                            <a className="text-body" href="./product.html">Suede cross body Bag</a> <br />
                                                            <span className="card-product-price">
                                                                <span className="sale text-primary">45,000</span>
                                                                <span className="text-muted line-through ml-1 inline-block">60,000</span>
                                                            </span> <br />
                                                            x 3 = 135,000 <u>vnđ</u>
                                                        </p>
                                                    </div>
                                                </div>
                                            </li> */}
                                        </ul>
                                    </div>
                                </div>
                                {/* Card */}
                                <div className="product-card card mb-9 bg-light">
                                    <Spin spinning={preCheckoutLoading}>
                                        <div className="card-body">
                                            <ul className="list-group list-group-sm list-group-flush-y list-group-flush-x">
                                                <li className="list-group-item d-flex">
                                                    <span>Subtotal</span> <span className="ml-auto font-size-sm">{currency(prevCheckoutResponse?.subTotal)}</span>
                                                </li>
                                                <li className="list-group-item d-flex">
                                                    <span>Promotion</span> <span className="ml-auto font-size-sm">{promotion?.discount > 0 ? '-' : undefined}{currency(promotion?.discount)}</span>
                                                </li>
                                                <li className="list-group-item d-flex">
                                                    <span>Shipping</span> <span className="ml-auto font-size-sm">{currency(prevCheckoutResponse?.shipping?.shippingPrice)}</span>
                                                </li>
                                                <li className="list-group-item d-flex">
                                                    <span>Tax</span> <span className="ml-auto font-size-sm">{currency(prevCheckoutResponse?.tax)}</span>
                                                </li>
                                                <li className="list-group-item d-flex font-size-lg font-weight-bold">
                                                    <span>Total</span> <span className="ml-auto font-size-sm">{currency(prevCheckoutResponse?.total)}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </Spin>
                                </div>
                                {/* Disclaimer */}
                                <p className="mb-7 font-size-xs text-gray-500">
                                    Your personal data will be used to process your order, support
                                    your experience throughout this website, and for other purposes
                                    described in our privacy policy.
                                </p>
                                {/* Button */}
                                <Button loading={loadingCheckout} onClick={onSubmit} className="btn btn-block btn-dark">
                                    Place Order
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                {/* FEATURES */}
                <section className="bg-light py-9">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-3">
                                {/* Item */}
                                <div className="d-flex mb-6 mb-lg-0">
                                    {/* Icon */}
                                    <i className="fe fe-truck font-size-lg text-primary" />
                                    {/* Body */}
                                    <div className="ml-6">
                                        {/* Heading */}
                                        <h6 className="heading-xxs mb-1">
                                            Free shipping
                                        </h6>
                                        {/* Text */}
                                        <p className="mb-0 font-size-sm text-muted">
                                            From all orders over $100
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                {/* Item */}
                                <div className="d-flex mb-6 mb-lg-0">
                                    {/* Icon */}
                                    <i className="fe fe-repeat font-size-lg text-primary" />
                                    {/* Body */}
                                    <div className="ml-6">
                                        {/* Heading */}
                                        <h6 className="mb-1 heading-xxs">
                                            Free returns
                                        </h6>
                                        {/* Text */}
                                        <p className="mb-0 font-size-sm text-muted">
                                            Return money within 30 days
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                {/* Item */}
                                <div className="d-flex mb-6 mb-md-0">
                                    {/* Icon */}
                                    <i className="fe fe-lock font-size-lg text-primary" />
                                    {/* Body */}
                                    <div className="ml-6">
                                        {/* Heading */}
                                        <h6 className="mb-1 heading-xxs">
                                            Secure shopping
                                        </h6>
                                        {/* Text */}
                                        <p className="mb-0 font-size-sm text-muted">
                                            You're in safe hands
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                {/* Item */}
                                <div className="d-flex">
                                    {/* Icon */}
                                    <i className="fe fe-tag font-size-lg text-primary" />
                                    {/* Body */}
                                    <div className="ml-6">
                                        {/* Heading */}
                                        <h6 className="mb-1 heading-xxs">
                                            Over 10,000 Styles
                                        </h6>
                                        {/* Text */}
                                        <p className="mb-0 font-size-sm text-muted">
                                            We have everything you need
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </>
    )
}

export default Checkout