import { PATH } from '@/config/path'
import { useCart } from '@/hooks/useCart'
import { currency } from '@/utils'
import { Drawer } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { CartItem } from '../CartItem'

export const CartDrawer = ({ open, onClose }) => {
    const { cart } = useCart()
    return (
        <Drawer width={470} open={open} onClose={onClose} headerStyle={{ display: 'none' }} bodyStyle={{ padding: 0 }}>
            <div>
                {
                    cart?.listItems?.length ?
                        (
                            <div className="modal-content">
                                {/* Close */}
                                <button onClick={onClose} type="button" className="close !outline-none" data-dismiss="modal" aria-label="Close">
                                    <i className="fe fe-x" aria-hidden="true" />
                                </button>
                                {/* Header*/}
                                <div className="modal-header line-height-fixed font-size-lg">
                                    <strong className="mx-auto">Your Cart (2)</strong>
                                </div>
                                {/* List group */}
                                <ul className="list-group list-group-lg list-group-flush">
                                    {
                                        cart?.listItems?.map(e => <CartItem key={e.productId} {...e} />)
                                    }
                                </ul>
                                {/* Footer */}
                                <div className="modal-footer line-height-fixed font-size-sm bg-light mt-auto">
                                    <strong>Subtotal</strong> <strong className="ml-auto">{currency(cart?.subTotal)}</strong>
                                </div>
                                {/* Buttons */}
                                <div className="modal-body">
                                    <Link onClick={onClose} className="btn btn-block btn-outline-dark" to={PATH.ViewCart}>View Cart</Link>
                                </div>
                            </div>

                        ) : (
                            <div className="modal-content">
                                {/* Close */}
                                <button type="button" className="close !outline-none" data-dismiss="modal" aria-label="Close">
                                    <i className="fe fe-x" aria-hidden="true" />
                                </button>
                                {/* Header*/}
                                <div className="modal-header line-height-fixed font-size-lg">
                                    <strong className="mx-auto">Your Cart (0)</strong>
                                </div>
                                {/* Body */}
                                <div className="modal-body flex-grow-0 my-auto">
                                    <div className="flex flex-col gap-4 items-center">
                                        <img width={150} src="/img/empty-cart.png" />
                                        <p className="mb-0">Không có sản phẩm nào trong giỏ hàng của bạn.</p>
                                        <Link to={PATH.Product} onClick={onClose} className="btn btn-dark min-w-[300px] text-center">Tiếp tục mua sắm</Link>
                                    </div>
                                </div>
                            </div>
                        )
                }
            </div>
        </Drawer>
    )
}
