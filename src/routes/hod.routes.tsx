import { HomeHOD } from "@/pages"
import { Route, Routes } from "react-router"

const HodRoutes = () => {
  return (
    <Routes>
      <Route index element={<HomeHOD />} />
      
      <Route path="dashboard" element={<div>HOD Dashboard</div>} />
      <Route path="settings" element={<div>HOD Settings</div>} />
    </Routes>
  )
}

export default HodRoutes