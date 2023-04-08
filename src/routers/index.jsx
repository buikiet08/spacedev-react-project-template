import { AuthRoute } from "@/components/AuthRoute";
import { PrivateRoute } from "@/components/PrivateRoute";
import { PATH } from "@/config/path";
import { MainLayout } from "@/layouts/MainLayout";
import Checkout from "@/pages/checkout";
import Contact from "@/pages/contact";
import OrderComplete from "@/pages/dat-hang-thanh-cong";
import ViewCart from "@/pages/gio-hang";
import ResetPassword from "@/pages/resetPassword";
import ProductPage from "@/pages/san-pham";
import Account from "@/pages/tai-khoan";
import ProductPageDetail from "@/pages/[slug]";
import { lazy } from "react";
import { profile } from "./ca-nhan";
import About from "@/pages/about";
import Faq from "@/pages/faq";
import ShippingAndReturn from "@/pages/quy-dinh-giao-hang";
const Home = lazy(() => import('@/pages'))
const Page404 = lazy(() => import('@/pages/404'))

export const routers = [
    {
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                element: <ProductPage />,
                path:PATH.Product
            },
            {
                element: <ProductPage />,
                path:PATH.Category
            },
            {
                element: <ProductPageDetail />,
                path:PATH.ProductDetail
            },
            {
                element: <ViewCart />,
                path:PATH.ViewCart
            },
            {
                element: <Checkout />,
                path:PATH.Checkout
            },
            {
                element: <OrderComplete />,
                path:PATH.OrderComplete
            },
            {
                element: <Contact />,
                path:PATH.Contact
            },
            {
                element: <PrivateRoute redirect={PATH.Account} />,
                children:profile,
                path:PATH.Profile.index
            },
            {
                element: <About />,
                path:PATH.About,
            },
            {
                element: <ShippingAndReturn />,
                path:PATH.Return,
            },
            {
                element: <Faq />,
                path:PATH.Faq,
            },
            {
                element: <AuthRoute redirect={PATH.Profile.index} />,
                children: [
                    {
                        path:PATH.Account,
                        element: <Account />
                    },
                    {
                        element: <ResetPassword />,
                        path:PATH.ResetPassword
                    },
                ]
            },

            {
                element: <Page404 />,
                path: '*'
            }
        ]
    }
]