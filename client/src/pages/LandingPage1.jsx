import AdminDashboard from "../components/admin/AdminDashboard";
import { StoreProvider } from "../store/provider";

export default function LandingPage1() {
  return (
    <>
      <StoreProvider>
        <AdminDashboard />
      </StoreProvider>
    </>
  );
}
