import { authService } from "@/services/auth";
import axios from "axios";
import { getToken, setToken } from "./token";


export const http = axios.create()

let refreshTokenPromise = null
http.interceptors.response.use((res) => {
    return res.data
}, async (error) => {

    try {
        if (error.response.status === 403 && error.response.data.error_code === "TOKEN_EXPIRED") {
            // refresh token
            if(refreshTokenPromise) {
                await refreshTokenPromise
            } else {
                console.log('refreshToken')
                const token = getToken()
                refreshTokenPromise = authService.refreshToken({
                    refreshToken: token.refreshToken
                })
                const res = await refreshTokenPromise
                setToken(res.data)
                refreshTokenPromise = null
            }

            return http(error.config)

            // gắn token vào localStorage

            // Thực thi lại api bị lỗi

        }
    } catch (err) {

    }
    throw error
})


http.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers['Authorization'] = `Bearer ${token.accessToken}`
    }
    return config
})