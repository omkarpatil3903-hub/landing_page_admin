import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useStore } from "../../store/useStore";
import { actionTypes } from "../../store/actions";
import axios from "axios";
import {
  FaSeedling,
  FaTractor,
  FaTruck,
  FaSave,
  FaPen,
  FaParagraph,
  FaCertificate,
  FaIndustry,
} from "react-icons/fa";
import Loader from "./Loader";

// --- Icon Configuration ---
// This map is still needed to render the icons in the form and preview.
const iconMap = {
  FaSeedling: <FaSeedling className="w-10 h-10 text-green-600" />,
  FaTractor: <FaTractor className="w-10 h-10 text-yellow-600" />,
  FaTruck: <FaTruck className="w-10 h-10 text-blue-600" />,
  FaCertificate: <FaCertificate className="w-10 h-10 text-purple-600" />,
  FaIndustry: <FaIndustry className="w-10 h-10 text-gray-600" />,
};

// --- Helper Components ---
const InputField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
      {icon}
    </div>
    <input
      {...props}
      className="w-full pl-10 p-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
    />
  </div>
);

const TextAreaField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute top-3 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
      {icon}
    </div>
    <textarea
      {...props}
      className="w-full pl-10 p-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
    />
  </div>
);

const AboutUsForm = () => {
  const { state, dispatch } = useStore();

  const [localData, setLocalData] = useState(state.aboutData);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalData(state.aboutData);
    setIsDirty(false);
  }, [state.aboutData]);

  const handleChange = (e, idx, field) => {
    setIsDirty(true);
    const { name, value } = e.target;

    if (field === "journey") {
      const updatedJourney = [...localData.journey];
      updatedJourney[idx][name] = value;
      setLocalData((prev) => ({ ...prev, journey: updatedJourney }));
    } else {
      setLocalData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/content/about",
        localData
      );

      dispatch({ type: actionTypes.UPDATE_ABOUT_DATA, payload: response.data });
      setLocalData(response.data);
      alert("About Us section updated successfully!");
    } catch (error) {
      console.error("Error saving About Us section:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!localData) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* --- Form --- */}
      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-800">About Us Section</h2>
          <p className="text-slate-500 text-sm mt-1">
            Tell your story and define the steps of your process.
          </p>
        </div>
        <div className="space-y-4">
          <InputField
            icon={<FaPen />}
            type="text"
            name="subtitle"
            value={localData.subtitle}
            onChange={handleChange}
          />
          <InputField
            icon={<FaPen />}
            type="text"
            name="title"
            value={localData.title}
            onChange={handleChange}
          />
          <TextAreaField
            icon={<FaParagraph />}
            name="description"
            rows={4}
            value={localData.description}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-t border-slate-200 pt-6">
            Journey Steps
          </h3>
          {localData.journey.map((step, idx) => (
            <div
              key={idx}
              className="border border-slate-200 bg-slate-50 p-4 rounded-lg space-y-3"
            >
              {/* ✅ CHANGE: Icon is now displayed, not editable */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 flex-shrink-0">
                  {iconMap[step.icon]}
                </div>
                <div className="font-semibold text-slate-700 text-lg">
                  Step {idx + 1}: {step.title}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 text-xs">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={step.title}
                  onChange={(e) => handleChange(e, idx, "journey")}
                  className="w-full p-2 border border-slate-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 text-xs">
                  Description
                </label>
                <textarea
                  name="desc"
                  value={step.desc}
                  onChange={(e) => handleChange(e, idx, "journey")}
                  className="w-full p-2 border border-slate-300 rounded-md text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={!isDirty || isSaving}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 rounded-md hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          <FaSave />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
      {/* --- Live Preview --- */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center">
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <section>
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600 mb-3 uppercase tracking-wider">
                {localData.subtitle}
              </p>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                {localData.title}
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-12 leading-relaxed">
                {localData.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              {localData.journey.map((step, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center bg-gray-50 shadow-md rounded-2xl p-6 hover:shadow-xl transition"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="mb-4 bg-white p-3 rounded-full shadow-md">
                    {iconMap[step.icon]}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-center text-sm">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUsForm;
