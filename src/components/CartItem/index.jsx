import { useCart } from "@/hooks/useCart"
import { addCartItemAction, removeCartItemAction, toggleCartItemAction } from "@/stories/cart"
import { cn, currency } from "@/utils"
import { Popconfirm, Spin } from "antd"
import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import CheckBox from "../CheckBox"

export const CartItem = ({alowSelect,productId, product, quantity,hiddenAction,footer,...props }) => {
    const dispatch = useDispatch()
    const inputRef = useRef(null)
    const {loading, prevCheckoutData: {listItems}} = useCart()
    const [_quantity,setQuantity] = useState(quantity)
    const [openPopComfirm,setOpenPopComfirm] = useState(false)
    const [openPopComfirmQuantity,setOpenPopComfirmQuantity] = useState(false)

    const _loading = loading[productId] || false
    // kiểm tra khi quantiy thay đổi thì cập nhật value input
    useEffect(() => {
        // if(parseInt(inputRef.current.value) != quantity) {
        //     inputRef.current.value = quantity
        // }
        if(_quantity !== quantity) {
            setQuantity(quantity);
        }
    }, [quantity])
    const onDecrement = () => {
        setQuantity(_quantity - 1)
        // inputRef.current.value--
        dispatch(addCartItemAction({
            productId,
            quantity:_quantity - 1
        }))
    }

    const onIncrement = () => {
        setQuantity(_quantity + 1)
        // inputRef.current.value++
        dispatch(addCartItemAction({
            productId,
            quantity:_quantity + 1
        }))
    }
    const onUpdateQuantity = (val) => {
        dispatch(addCartItemAction({
            productId,
            quantity:val
        }))
    }
    const onCheckItem = (checked) => {
        console.log(checked)
        dispatch(toggleCartItemAction({
            productId,
            checked
        }))
    }
    // xóa sp
    const onRemoveItem = () => {
        dispatch(removeCartItemAction(productId))
    }

    const checked = listItems?.find(e => e === productId)
    return (
        <Spin spinning={_loading}>
        <li className={cn("list-group-item", props.className)}>
            <div className="row align-items-center">
                {
                    alowSelect && <CheckBox checked={checked} onChange={onCheckItem} />
                }
                <div className="w-[120px]">
                    {/* Image */}
                    <a href="./product.html">
                        <img className="img-fluid" src={product.thumbnail_url} alt={product.name} />
                    </a>
                </div>
                <div className="flex-1 px-2">
                    {/* Title */}
                    <p className="font-size-sm mb-6">
                        <a className="text-body" href="./product.html">{product.name}</a> <br />
                        <span className="card-product-price">
                            {
                                product.real_price < product.price ? <>
                                    <span className="sale text-primary">{currency(product.real_price)}</span>
                                    <span className="text-muted line-through ml-1 inline-block">{currency(product.price)}</span>
                                </> : <span className="text-muted line-through ml-1 inline-block">{currency(product.real_price)}</span>
                            }
                        </span>
                    </p>
                    {/*Footer */}
                    {
                        !hiddenAction &&
                        <div className="d-flex align-items-center">
                            {/* Select */}
                            <div className="btn-group btn-quantity">
                                <Popconfirm
                                open={openPopComfirm}
                                onOpenChange={visible => setOpenPopComfirm(visible)}
                                disabled={_quantity > 1} 
                                placement="bottomRight" 
                                title="Thông báo" 
                                description='Bạn chắc chắn muốn xóa sản phẩm này' 
                                okText="Xóa" showCancel={false} 
                                onConfirm={() => {
                                    setOpenPopComfirm(false)
                                    onRemoveItem()
                                }}>
                                    <button onClick={_quantity > 1 ? onDecrement : undefined} className="btn">-</button>
                                </Popconfirm>
                                <input 
                                    value={_quantity} 
                                    onChange={ev => setQuantity(ev.target.value)} 
                                    onBlur={ev => {
                                        let val = parseInt(ev.target.value)
                                        if(!val) {
                                            val = 1
                                            setQuantity(val)
                                        }
                                        // neu value != 1 thi moi thuc hien
                                        if(val !== quantity) {
                                            onUpdateQuantity(val)
                                        }
                                    }}
                                />
                                <button onClick={onIncrement} className="btn">+</button>
                            </div>
                            {/* Remove */}
                            <Popconfirm 
                            open={openPopComfirmQuantity}
                            onOpenChange={visible => setOpenPopComfirmQuantity(visible)}
                            placement="bottomRight" 
                            title="Thông báo" 
                            description='Bạn chắc chắn muốn xóa sản phẩm này' 
                            okText="Xóa" 
                            showCancel={false} 
                            onConfirm={() => {
                                setOpenPopComfirmQuantity(false)
                                onRemoveItem()
                            }}>
                                <a onClick={ev => ev.preventDefault()} className="font-size-xs text-gray-400 ml-auto" href="#!">
                                    <i className="fe fe-x" /> Xóa
                                </a>
                            </Popconfirm>
                        </div>
                    }
                    {footer}
                </div>
            </div>
        </li>
        </Spin>
    )
}