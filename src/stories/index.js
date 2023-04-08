import { configureStore } from "@reduxjs/toolkit";
import { authReducer, authSaga, getUserThunkAction } from "./auth";
import { ENV } from "@/config";
import { cartReducer, cartSaga, getCartAction } from "./cart";
import createSagaMiddleware from 'redux-saga'
import { all } from "redux-saga/effects";


// khởi tạo redux saga
const sagaMiddleware = createSagaMiddleware()

function* rootSaga() {
    yield all([
        cartSaga(),
        authSaga()
    ])
}
export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer
    },
    devTools: ENV === 'development',
    middleware: (getDefaultMiddlware) => getDefaultMiddlware().concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

store.dispatch(getUserThunkAction())
store.dispatch(getCartAction())