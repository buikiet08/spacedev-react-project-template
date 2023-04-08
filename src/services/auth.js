import { AUTHEN_API, USER_API } from "@/config/api"
import { http } from "@/utils/http"

export const authService = {
    register(data) {
        return http.post(`${USER_API}/register`, data)
    },
    login(form){
        return http.post(`${AUTHEN_API}/login`, form)
    },
    loginByCode(data) {
        return http.post(`${AUTHEN_API}/login-by-code`, data)
    },
    refreshToken(data){
        return http.post(`${AUTHEN_API}/refresh-token`, data)
    }
}