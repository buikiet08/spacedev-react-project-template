import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
  const layoutLoading = (
    <div className="w-full h-screen flex justify-center items-center">
        <img className='img' style={{ width: 40 }} src="/img/logo.svg" />
    </div>
  )
  return (
    <Suspense fallback={layoutLoading}>
        <Header />
        <Outlet />
        <Footer />
    </Suspense>
  )
}
