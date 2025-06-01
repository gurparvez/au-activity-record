import DownloadRecord from "@/pages/DownloadRecord"
import EditRecord from "@/pages/EditRecord"
import { NewRecord } from "@/pages/hod"
import { Activities, Activity, HomeIQAC, OutletIqac, Users } from "@/pages/iqac"
import { Route, Routes } from "react-router"

const IqacRoutes = () => {
  return (
    <Routes>
      <Route element={<OutletIqac />}>
        <Route index element={<HomeIQAC />} />

        <Route path="activities" element={<Activities />} />
        <Route path="activity/:id" element={<Activity />} />
        <Route path="activity/:id/new" element={<NewRecord />} />
        <Route path="activity/:id/download" element={<DownloadRecord />} />
        <Route path="activity/:id/edit/:docId" element={<EditRecord />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  )
}

export default IqacRoutes