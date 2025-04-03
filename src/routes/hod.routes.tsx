import { HomeHOD } from "@/pages"
import { Route, Routes } from "react-router"

const HodRoutes = () => {
  return (
    <Routes>
      <Route index element={<HomeHOD />} />
    </Routes>
  )
}

export default HodRoutes