import { Navigate, Route, Routes } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"
import LoginPage from "@/pages/login/LoginPage"
import AppLayout from "./AppLayout"
import LicensesPage from "@/pages/licenses/LicensesPage"
import MyLicensesPage from "@/pages/licenses/MyLicensesPage"
import RequestsPage from "@/pages/requests/RequestsPage"
import AdminRequestsPage from "@/pages/requests/AdminRequestsPage"

export default function AppRoutes() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const role = useAuthStore((state) => state.role)

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {isLoggedIn ? (
        <Route element={<AppLayout />}>
          <Route path="/licenses" element={<LicensesPage />} />

          {role === "user" && (
            <>
              <Route path="/my-licenses" element={<MyLicensesPage />} />
              <Route path="/requests" element={<RequestsPage />} />
            </>
          )}

          {role === "admin" && (
            <Route path="/admin-requests" element={<AdminRequestsPage />} />
          )}

          <Route path="/" element={<Navigate to="/licenses" />} />
          <Route path="*" element={<Navigate to="/licenses" />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  )
}
