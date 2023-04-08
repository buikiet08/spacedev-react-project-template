import { PATH } from "@/config/path"
import ProfileLayout from "@/layouts/ProfileLayout"
import Profile from "@/pages/ca-nhan"
import Order from "@/pages/ca-nhan/don-hang"
import OrderDetail from "@/pages/ca-nhan/don-hang/[id]"
import Wishlist from "@/pages/ca-nhan/san-pham-yeu-thich"
import AddressPage from "@/pages/ca-nhan/so-dia-chi"
import AddAddress from "@/pages/ca-nhan/so-dia-chi/them-dia-chi"
import PaymentPage from "@/pages/ca-nhan/so-thanh-toan"
import AddPayment from "@/pages/ca-nhan/so-thanh-toan/them-so-thanh-toan"

export const profile = [
    {
        element:<ProfileLayout />,
        children: [
            {
                element: <Profile />,
                index:true,
            },
            {
                element:<Order />,
                path:PATH.Profile.Order
            },
            {
                element:<OrderDetail />,
                path:PATH.Profile.OrderDetail
            },
            {
                element:<AddressPage />,
                path:PATH.Profile.Address
            },
            {
                element:<AddAddress />,
                path:PATH.Profile.NewAddress
            },
            {
                element:<AddAddress />,
                path:PATH.Profile.EditAddress
            },
            {
                element:<Wishlist />,
                path:PATH.Profile.Wishlist
            },
            {
                element:<PaymentPage />,
                path:PATH.Profile.Payment
            },
            {
                element:<AddPayment />,
                path:PATH.Profile.NewPayment
            },
            {
                element:<AddPayment />,
                path:PATH.Profile.EditPayment
            }
        ]
    }
]