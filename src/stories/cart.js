import { cartService } from "@/services/cart";
import { getToken ,handleError, storePreCheckoutResponse, storePreCheckoutData, storeCart, storeAddressSelect } from "@/utils";
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { takeLatest,call,put, delay, select} from 'redux-saga/effects'
import { loginSuccessAction, logoutAction } from "./auth";


// tạo action = redux toolkit
export const addCartItemAction = createAction('cart/addCartItem')
export const removeCartItemAction = createAction('cart/removeCartItem')
export const toggleCartItemAction = createAction('cart/selectCartItem')

export const updateItemQuantitySuccessAction = createAction('cart/updateItemQuantitySuccess')

export const addPromotionCodeAction = createAction('cart/addPromotionCode')
export const removePromotionCodeAction = createAction('cart/removePromotionCode')
export const getCartAction = createAction('cart/getCart')

// export const addCartItemAction = createAsyncThunk('cart/addCartItem', async (data, thunApi) => {
//     try {
//         await cartService.addItem(data.productId, data.quantity)
//         thunApi.dispatch(getCartAction())
//         // đặt điều kiện khi tăng sp trong giỏ hàng sẽ k hiện popover
//         if(data.showPopover) {
//             thunApi.dispatch(cartActions.toggleCartOver(true))

//             window.scroll({
//                 top: 0,
//                 behavior:'smooth'
//             })
//         }
//     } catch (error) {
//         throw error.response.data
//     }
// })

// export const getCartAction = createAsyncThunk('cart/getCart', async (_, thunApi) => {
//     try {
//         if(getToken()) {
//             const cart = await cartService.getCart()
//             thunApi.dispatch(cartActions.setCart(cart.data))
//             return cart
//         }
//     } catch (error) {
        
//     }
// })


export const {reducer: cartReducer, actions: cartActions} = createSlice({
    name:'cart',
    initialState: {
        cart: storeCart.get(),
        openCartOver:false,
        prevCheckoutData: storePreCheckoutData.get() || {
            promotionCode:[],
            listItems:[],
            shippingMethod:'mien-phi'
        },
        prevCheckoutResponse:storePreCheckoutResponse.get() || {},
        preCheckoutLoading:false,
        promotionLoading:false,
        loading:{
            // 4324324:true
        }
    },
    reducers: {
        clearCart(state) {
            return {
                ...state,
                openCartOver:false,
                prevCheckoutData: {
                    promotionCode:[],
                    listItems:[],
                    shippingMethod:'mien-phi'
                },
                prevCheckoutResponse:{},
                preCheckoutLoading:false,
                promotionLoading:false,
                loading:{
                    // 4324324:true
                }
            }
        },
        setCart(state,action) {
            state.cart = action.payload
        },
        toggleCartOver(state,action) {
            state.openCartOver = action.payload
        },
        loadingCart(state,action) {
            state.loading[action.payload.productId] = action.payload.loading
        },
        setPrevCheckoutData(state,action) {
            state.prevCheckoutData = action.payload
        },
        setPrevCheckoutResponse(state,action) {
            state.prevCheckoutResponse = action.payload
        },
        setShippingMethod(state,action) {
            state.prevCheckoutData.shippingMethod = action.payload
        },
        togglePreCheckoutLoading(state,action) {
            state.preCheckoutLoading = action.payload
        },
        // promotion
        toggleAddPromotion(state,action) {
            if(action.payload) {
                state.prevCheckoutData.promotionCode = [action.payload]
            } else {
                state.prevCheckoutData.promotionCode = []
            }
        },
        togglePromotionLoading(state,action) {
            state.promotionLoading = action.payload
        }
    }
})
// thêm sp = redux saga

function * fetchCart (action) {
    try {
        // sử dụng delay: khi user click liên tục thì sao 300ms thì mới thực hiện call dl phía dưới
        //  nếu trong quá trình đó có action khác tham gia thì sẽ hủy action cũ
        yield delay(300)
        // xóa sp khi giảm sp xuống = 0
        if(action.payload.quantity >= 1) {
            yield call(cartService.addItem, action.payload.productId, action.payload.quantity)
            // thunApi.dispatch(getCartAction())
            // put === dispatch
            yield put(getCartAction())
            // đặt điều kiện khi tăng sp trong giỏ hàng sẽ k hiện popover
            if(action.payload.showPopover) {
                yield put(cartActions.toggleCartOver(true))
    
                window.scroll({
                    top: 0,
                    behavior:'smooth'
                })
            }
        } else {
            yield put(removeCartItemAction(action.payload.productId))
        }
        // khi thực hiện fetchCart xong thì put sự kiện update
        yield put(updateItemQuantitySuccessAction(action.payload.productId))
    } catch (error) {
        // throw error.response.data
        console.error(error)
    }
}
function * fetchRemoveCart (action) {
    try {
        yield put(cartActions.loadingCart({productId:action.payload, loading:true}))
        yield call(cartService.removeItem, action.payload)
        yield put(getCartAction())
        yield put(cartActions.loadingCart({productId:action.payload, loading:false}))
        // khi thực hiện fetchCart xong thì put sự kiện update
        yield put(updateItemQuantitySuccessAction(action.payload))
    } catch (error) {
        console.error(error)
    }
}

function* fetchSelectCart(action){
    try {
        let {cart: {prevCheckoutData}} = yield select()
        let { listItems } = prevCheckoutData
        listItems = [...listItems]
        const {
            productId,
            checked
        } = action.payload

        if(checked) {
            listItems.push(productId)
        } else {
            listItems = listItems.filter(e => e !== productId)
        }
        yield put(cartActions.setPrevCheckoutData({
            ...prevCheckoutData,
            listItems
        }))
    } catch (error) {
        handleError(error)
    }
}
// check sp trong cart
function* fetchPrevCheckout(action) {
    console.log(action)
    try {
        let {cart: {prevCheckoutData}} = yield select()
        // ktra nêu các sp trong list item mà k dc check thì k dc thực hiện login tiesp theo
        if(action.type === updateItemQuantitySuccessAction.toString()) {
            let productId = action.payload
            if(!prevCheckoutData.listItems.find(e => e === productId)) return
        }
        yield put(cartActions.togglePreCheckoutLoading(true))
        const res = yield call(cartService.preCheckout, prevCheckoutData)
        yield put(cartActions.setPrevCheckoutResponse(res?.data))

        yield put(cartActions.togglePreCheckoutLoading(false))
        storePreCheckoutData.set(prevCheckoutData)
        storePreCheckoutResponse.set(res?.data)
    } catch (error) {
        handleError(error)
    }
}

function* fetchAddPromotion (action) {
    try {
        yield put(cartActions.togglePromotionLoading(true))
        yield call(cartService.getPromotion, action.payload.data)
        yield put(cartActions.toggleAddPromotion(action.payload.data))
        action?.payload?.onSuccess?.()
    } catch (error) {
        action?.payload?.onError?.(error)
    } finally {
        yield put(cartActions.togglePromotionLoading(false))
    }
}

function* removePromotion(action) {
    yield put(cartActions.toggleAddPromotion())
    action?.payload?.onSuccess?.()
}
function* fethGetCart() {
    try {
        if(getToken()) {
            const cart = yield call(cartService.getCart)
            yield put(cartActions.setCart(cart.data))
            return cart
        }
    } catch (error) {
        
    }
}

function * fethClearCart (action) {
    yield put(cartActions.setCart(null))
    yield put(cartActions.clearCart())
    storeAddressSelect.clear()
    storePreCheckoutData.clear()
    storePreCheckoutResponse.clear()
}

export function * cartSaga () {
    // 1:lấy sự kiện - 2:thực hiện sự kiện
    // yield takeLatest('/cart/getCart/pending', getCart)
    yield takeLatest(addCartItemAction, fetchCart)
    yield takeLatest([getCartAction, loginSuccessAction, cartActions.clearCart], fethGetCart)
    yield takeLatest(removeCartItemAction, fetchRemoveCart)
    yield takeLatest(toggleCartItemAction, fetchSelectCart)
    // khi check sp thì mới gọi api checkOut, thao tác sp đã check thì sẽ gojiapi lại, các sp k check thì sẽ k dc gọi
    // sự kiện updateItemQuantitySuccessAction dc gọi cho các sự kiện liên quan 
    yield takeLatest([cartActions.setPrevCheckoutData, updateItemQuantitySuccessAction,cartActions.setShippingMethod, cartActions.toggleAddPromotion], fetchPrevCheckout)

    // promotion
    yield takeLatest(addPromotionCodeAction, fetchAddPromotion)
    yield takeLatest(removePromotionCodeAction, removePromotion)


    yield takeLatest(logoutAction, fethClearCart)
}