import { HomeIQAC, OutletIqac } from "@/pages"
import { Route, Routes } from "react-router"

const IqacRoutes = () => {
  return (
    <Routes>
      <Route element={<OutletIqac />}>
        <Route index element={<HomeIQAC />} />

        
      </Route>
    </Routes>
  )
}

export default IqacRoutes