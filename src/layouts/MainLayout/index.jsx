import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
  return (
    <Suspense fallback={<div>MainLayout Loading...</div>}>
        <Outlet />
    </Suspense>
  )
}
