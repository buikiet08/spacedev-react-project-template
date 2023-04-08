import "@/assets/css/tailwind.css"
import { useRoutes } from "react-router-dom"
import { routers } from "./routers"
import { Suspense } from "react"
import { message } from "antd"

function App() {
  const element = useRoutes(routers)
  message.config({
    maxCount:3
  })
  return (
    <Suspense fallback={<div>App Loading....</div>}>
      {element}
    </Suspense>
  )
}

export default App
