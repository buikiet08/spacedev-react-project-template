import { authService } from "@/services/auth"
import { userService } from "@/services/user"
import { handleError } from "@/utils"
import { clearToken, clearUser, getToken, getUser, setToken, setUser } from "@/utils/token"
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { call, put, takeLatest } from "redux-saga/effects"
import { cartActions, getCartAction } from "./cart"



export const loginThunkAction = createAction('auth/login')
export const logoutAction = createAction('auth/actionLogout')
export const loginByCodeThunkAction = createAction('auth/loginByCode')
export const setUserThunkAction = createAction('auth/setUserAction')
export const getUserThunkAction = createAction('auth/getUser')

export const loginSuccessAction = createAction('auth/loginSuccess')

// export const loginThunkAction = createAsyncThunk('auth/login', async (data, thunkApi) => {
//     try {
//         const res = await authService.login(data)
//         setToken(res.data)
//         const user = await userService.getProfile()
//         setUser(user.data)
//         // thunkApi.dispatch(authActions.setUser(user.data))
//         thunkApi.dispatch(getCartAction())
//         thunkApi.fulfillWithValue(user.data)
//         // dispatch({ type: SET_USER_ACTION, payload: user.data })
//         return user.data
//     } catch (err) {
//         thunkApi.rejectWithValue(err?.response?.data)
//         throw err?.response?.data
//     }
// })

// export const loginByCodeThunkAction = createAsyncThunk('auth/loginByCode', async (code, thunkApi) => {
//     try {
//         const res = await authService.loginByCode(code)
//         setToken(res.data)
//         const user = await userService.getProfile()
//         setUser(user.data)
//         // thunkApi.dispatch(authActions.setUser(user.data))
//         thunkApi.fulfillWithValue(user.data)
//         // dispatch({ type: SET_USER_ACTION, payload: user.data })
//         return user.data
//     } catch (err) {
//         thunkApi.rejectWithValue(err?.response?.data)
//         throw err?.response?.data
//     }
// })

// export const setUserThunkAction = createAsyncThunk('auth/setUser', (user, thunkApi) => {
//     setUser(user)
//     thunkApi.dispatch(authActions.setUser(user))

// })

// export const getUserThunkAction = createAsyncThunk('auth,getUser', async (_,thunkApi) => {
//     try {
//         if(getToken()) {
//             const res = await userService.getProfile()
//             setUser(res.data)
//             thunkApi.dispatch(authActions.setUser(res.data))
//         }
//     } catch (error) {
        
//     }
// })

// export const logoutThunkAction = createAsyncThunk('auth/logout', (_,thunkApi) => {
//     thunkApi.dispatch(authActions.logout())
//     thunkApi.dispatch(cartActions.setCart(null))
//     thunkApi,dispatch(cartActions.clearCart())
//     clearUser()
//     clearToken()
// })

export const { reducer: authReducer, actions: authActions } = createSlice({
    initialState: () => ({
        user: getUser(),
        status: 'idle',
        loginLoading: false
    }),
    name: 'auth',
    reducers: {
        logout: (state) => {
            state.user = null
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        toggleLoading: (state, action) => {
            state.loginLoading = action.payload
        }
    },
    // extraReducers: (builder) => {
    //     builder.addCase(loginThunkAction.pending, (state) => {
    //         state.loginLoading = true
    //         state.status = 'pending'
    //     })
    //     builder.addCase(loginThunkAction.fulfilled, (state, action) => {
    //         state.user = action.payload
    //         state.status = 'success'
    //         state.loginLoading = false

    //     })
    //     builder.addCase(loginThunkAction.rejected, (state) => {
    //         state.status = 'error'
    //         state.loginLoading = false

    //     })
    //     builder.addCase(loginByCodeThunkAction.fulfilled, (state, action) => {
    //         state.user = action.payload
    //     })
    // }
})


// ---------------------------
function * fethLogin (action) {
    // action.payload = form.values
    try {
        yield put(authActions.toggleLoading(true))
        const res = yield call(authService.login, action.payload)
        setToken(res.data)
        const user = yield call(userService.getProfile)
        setUser(user.data)
        // yield put(getCartAction())
        yield put(authActions.setUser(user.data))
        yield put(loginSuccessAction())
        // thunkApi.fulfillWithValue(user.data)
        // dispatch({ type: SET_USER_ACTION, payload: user.data })
        // return user.data
    } catch (err) {
        // thunkApi.rejectWithValue(err?.response?.data)
        // throw err?.response?.data
        handleError(err)
    } finally {
        yield put(authActions.toggleLoading(false))
    }
}

function * fethLogout (action) {
    try {
        yield put(authActions.logout())
        // yield put(cartActions.setCart(null))
        // yield put(cartActions.clearCart())
        clearUser()
        clearToken()
    } catch (error) {
        
    }
}

function * fethLoginByCode (action) {
    try {
        const res = yield call(authService.loginByCode, {code})
        setToken(res.data)
        const user = yield call(userService.getProfile)
        setUser(user.data)
        yield put(authActions.setUser(user.data))
        // thunkApi.fulfillWithValue(user.data)
        // dispatch({ type: SET_USER_ACTION, payload: user.data })
        // return user.data
    } catch (err) {
        // thunkApi.rejectWithValue(err?.response?.data)
        // throw err?.response?.data
        handleError(err)
    }
}

function * fethUser (action) {
    try {
        if(getToken()) {
            const res = yield call(userService.getProfile)
            setUser(res.data)
            yield put(authActions.setUser(res.data))
        }
    } catch (error) {
        
    }
}

function * fethSetUser (action) {
    setUser(action.payload)
    yield put(authActions.setUser(action.payload))
}
export function* authSaga() {
    yield takeLatest(loginThunkAction, fethLogin)
    yield takeLatest(logoutAction, fethLogout)
    yield takeLatest(loginByCodeThunkAction, fethLoginByCode)
    yield takeLatest(getUserThunkAction, fethUser)
    yield takeLatest(setUserThunkAction, fethSetUser)
}