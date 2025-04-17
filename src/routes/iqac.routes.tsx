import { Activities, HomeIQAC, OutletIqac, Users } from "@/pages/iqac"
import { Route, Routes } from "react-router"

const IqacRoutes = () => {
  return (
    <Routes>
      <Route element={<OutletIqac />}>
        <Route index element={<HomeIQAC />} />

        <Route path="activities" element={<Activities />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  )
}

export default IqacRoutes