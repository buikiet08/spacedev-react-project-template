import { AUTHEN_API, USER_API } from "@/config/api"
import { http } from "@/utils/http"

export const userService = {
    getProfile(){
        return http.get(`${USER_API}`)
    },
    updateProfile(data) {
        return http.patch(`${USER_API}`, data)
    },
    changePassword(data) {
        return http.post(`${USER_API}/change-password`, data)
    },
    resetPassword(data) {
        return http.post(`${USER_API}/reset-password`, data)
    },
    changePasswordByCode(data) {
        return http.post(`${USER_API}/change-password-by-code`, data)
    },
    

    getAddress(query = '') {
        return http.get(`${USER_API}/address${query}`)
    },
    getAddressDetail(id) {
        return http.get(`${USER_API}/address/${id}`)
    },
    addAddress(data) {
        return http.post(`${USER_API}/address`, data)
    },
    editAddress(id,data) {
        return http.patch(`${USER_API}/address/${id}`, data)
    },
    deleteAddress(id) {
        return http.delete(`${USER_API}/address/${id}`)
    },
    deleteAddressAll() {
        return http.delete(`${USER_API}/address/delete-all`)
    },

    getPayment(query = '') {
        return http.get(`${USER_API}/payment${query}`)
    },
    getPaymentDetail(id) {
        return http.get(`${USER_API}/payment/${id}`)
    },
    addPayment(data) {
        return http.post(`${USER_API}/payment`, data)
    },
    editPayment(id,data) {
        return http.patch(`${USER_API}/payment/${id}`, data)
    },
    deletePayment(id) {
        return http.delete(`${USER_API}/payment/${id}`)
    }
}