import { useState, useEffect } from "react";
import { useStore } from "../../store/useStore"; // Adjust path if necessary
import { actionTypes } from "../../store/actions"; // Adjust path if necessary

import axios from "axios";

// Forms and Components
import DashboardHome from "./DashboardHome";
import HeroForm from "./HeroForm";
import AboutForm from "./AboutForm";
import ProductsForm from "./ProductsForm";
import AdminTestimonials from "./AdminTestimonials";
import Loader from "./Loader";
import FaqForm from "./FaqForm";
import AdminContactForm from "./AdminContactForm";
import AdminQueries from "./AdminQueries";

// Icons
import {
  FaHome,
  FaImage,
  FaInfoCircle,
  FaBoxOpen,
  FaComments,
  FaRegAddressCard,
  FaSignOutAlt,
  FaBars,
  FaInfo,
  FaQuestionCircle,
} from "react-icons/fa";

// Sections
const sections = [
  { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
  { id: "hero", label: "Hero Section", icon: <FaImage /> },
  { id: "about", label: "About Us", icon: <FaInfoCircle /> },
  { id: "products", label: "Products", icon: <FaBoxOpen /> },
  { id: "testimonials", label: "Testimonials", icon: <FaRegAddressCard /> },
  { id: "contact", label: "Contact", icon: <FaInfo /> },
  { id: "queries", label: "Queries", icon: <FaQuestionCircle /> },
  { id: "faq", label: "FAQ", icon: <FaComments /> },
];

function AdminDashboard() {
  const { state, dispatch } = useStore();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/content");
        dispatch({
          type: actionTypes.SET_INITIAL_DATA,
          payload: response.data,
        });
      } catch (err) {
        console.error("Error Fetching data:", err);
        dispatch({
          type: actionTypes.SET_ERROR,
          payload: "Failed to load data from the server.",
        });
      }
    };
    fetchData();
  }, [dispatch]);

  if (state.isLoading) {
    return <Loader text="Loading Dashboard..." size="lg" fullScreen={true} />;
  }
  if (state.error) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-50 text-red-600">
        {state.error}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-slate-900 text-slate-300 flex flex-col
        transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6 text-center border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white tracking-wider">
            Sangli Milk
          </h2>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setIsSidebarOpen(false); // Auto-close on mobile
              }}
              className={`flex items-center gap-4 w-full px-4 py-3 rounded-md text-left transition-colors duration-200 ${
                activeSection === section.id
                  ? "bg-slate-700 text-white font-semibold"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ===== Mobile Backdrop (with blur effect) ===== */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm md:hidden z-40"
          onClick={() => setIsSidebarOpen(false)} // close on backdrop click
        ></div>
      )}

      {/* ===== Content Area ===== */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Hamburger menu only visible on mobile */}
            <button
              className="text-slate-600 md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FaBars size={20} />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">
              {sections.find((s) => s.id === activeSection)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 hidden sm:block">Hello, Admin</span>
            <button className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors duration-200 p-2 rounded-md hover:bg-red-50">
              <FaSignOutAlt />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* ===== Main Content ===== */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="bg-white shadow-sm rounded-lg p-6">
            {activeSection === "dashboard" && (
              <DashboardHome setActiveSection={setActiveSection} />
            )}
            {activeSection === "hero" && <HeroForm />}
            {activeSection === "about" && <AboutForm />}
            {activeSection === "products" && <ProductsForm />}
            {activeSection === "testimonials" && <AdminTestimonials />}
            {activeSection === "contact" && <AdminContactForm />}
            {activeSection === "faq" && <FaqForm />}
            {activeSection === "queries" && <AdminQueries />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
