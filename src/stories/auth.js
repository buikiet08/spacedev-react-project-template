import { getUser } from "@/utils/token"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"



export const loginThunkAction = createAsyncThunk('auth/login', async (data, thunkApi) => {
    try {
        const res = await authService.login(data)
        setToken(res.data)
        const user = await userService.getProfile()
        setUser(user.data)
        // thunkApi.dispatch(authActions.setUser(user.data))
        thunkApi.fulfillWithValue(user.data)
        // dispatch({ type: SET_USER_ACTION, payload: user.data })
        return user.data
    } catch (err) {
        thunkApi.rejectWithValue(err.response.data)
        throw err?.response.data
    }
})


export const { reducer: authReducer, actions: authActions } = createSlice({
    initialState: () => ({
        user: getUser(),
        status: 'idle'
    }),
    name: 'auth',
    reducers: {
        logout: (state) => {
            state.user = null
        },
        setUser: (state, action) => {
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginThunkAction.pending, (state) => {
            state.status = 'pending'
        })
        builder.addCase(loginThunkAction.fulfilled, (state, action) => {
            state.user = action.payload
            state.status = 'success'
        })
        builder.addCase(loginThunkAction.rejected, (state) => {
            state.status = 'error'
        })
    }
})