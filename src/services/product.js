import { PRODUCT_API } from "@/config/api"
import { http } from "@/utils/http"

export const productService = {
    getProduct (query = '', signal) {
        return http.get(`${PRODUCT_API}${query}`, {signal})
    },
    getProductDetail (id) {
        return http.get(`${PRODUCT_API}/${id}`)
    },
    getCategories () {
        return http.get(`${PRODUCT_API}/categories`)
    },
    getWishList(query = '') {
        return http.get(`${PRODUCT_API}/wishlist${query}`, )
    },
    addWishList(productId) {
        return http.post(`${PRODUCT_API}/wishlist/${productId}`, )
    },
    removeWishList(productId) {
        return http.delete(`${PRODUCT_API}/wishlist/${productId}`, )
    }
}