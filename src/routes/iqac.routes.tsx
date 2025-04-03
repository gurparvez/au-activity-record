import { HomeIQAC } from "@/pages"
import { Route, Routes } from "react-router"

const IqacRoutes = () => {
  return (
    <Routes>
      <Route index element={<HomeIQAC />} />
    </Routes>
  )
}

export default IqacRoutes