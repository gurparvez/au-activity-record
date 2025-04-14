import { Activities, HomeIQAC, OutletIqac } from "@/pages/iqac"
import { Route, Routes } from "react-router"

const IqacRoutes = () => {
  return (
    <Routes>
      <Route element={<OutletIqac />}>
        <Route index element={<HomeIQAC />} />

        <Route path="activities" element={<Activities />} />
      </Route>
    </Routes>
  )
}

export default IqacRoutes