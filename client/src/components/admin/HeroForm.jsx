import React, { useEffect, useState } from "react";
// Modernized: Import icons for the button and input fields
import { FaSave, FaPen, FaParagraph, FaLink, FaImage } from "react-icons/fa";
import { useStore } from "../../store/useStore";
import { actionTypes } from "../../store/actions";
import axios from "axios";
import Loader from "./Loader";

// Helper component for consistent input fields with icons
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

const HeroForm = () => {
  const { state, dispatch } = useStore();

  // Initialize localHeroData with the nested structure
  const [localHeroData, setLocalHeroData] = useState(
    state.heroData || { title: "", subtitle: "", imageUrl: "" }
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalHeroData(
      state.heroData || { title: "", subtitle: "", imageUrl: "" }
    );

    // Set the initial image preview from the data in the store
    if (state.heroData.imageUrl) {
      setPreviewUrl(`http://localhost:5001/${state.heroData.imageUrl}`);
    }
  }, [state.heroData]);

  const handleChange = (e) => {
    setIsDirty(true);
    const { name, value } = e.target;
    setLocalHeroData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ ACTION: This new function handles when a user selects an image file
  const handleFileChange = (e) => {
    setIsDirty(true);
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a temporary local URL for the live preview
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsDirty(false);

    const formData = new FormData();
    formData.append("title", localHeroData.title);
    formData.append("subtitle", localHeroData.subtitle);

    // Only append the image if a new one has been selected
    if (selectedFile) {
      formData.append("heroImage", selectedFile);
    }
    try {
      const response = await axios.post(
        "http://localhost:5001/api/content/hero",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      dispatch({
        type: actionTypes.UPDATE_HERO_DATA,
        payload: response.data, // Dispatch the full nested object
      });
      setLocalHeroData(response.data);
      if (response.data.imageUrl) {
        setPreviewUrl(`http://localhost:5001/${response.data.imageUrl}`);
      }
      setSelectedFile(null); // Clear the selected file after saving

      alert("Hero Section Updated Successfully!");
    } catch (error) {
      setIsDirty(true);
      console.error("Error Updating Hero :", error);
      alert(`An error occurred while saving: ${error.message}`);
    }
  };

  // Now, check for localHeroData.items before rendering
  if (!localHeroData) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* --- Form --- */}
      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-800">Hero Section</h2>
          <p className="text-slate-500 text-sm mt-1">
            Update the main headline, description, and image for your homepage.
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-slate-700 font-medium mb-1 text-sm">
            Title
          </label>
          <InputField
            type="text"
            name="title"
            value={localHeroData.title} // Corrected access
            onChange={handleChange}
            placeholder="Enter Hero Title"
            icon={<FaPen />}
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-slate-700 font-medium mb-1 text-sm">
            Subtitle
          </label>
          <TextAreaField
            name="subtitle"
            value={localHeroData.subtitle} // Corrected access
            onChange={handleChange}
            rows={4}
            placeholder="Enter Hero Description"
            icon={<FaParagraph />}
          />
        </div>

        <div>
          <label className="block text-slate-700 font-medium mb-1 text-sm">
            Hero Image
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        <button
          disabled={!isDirty}
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 rounded-md hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          <FaSave />
          Save Changes
        </button>
      </form>

      {/* --- Live Preview --- */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 max-w-4xl">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              {localHeroData.title}
            </h1>
            <p className="text-gray-600">{localHeroData.subtitle}</p>{" "}
            {/* Corrected access */}
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all">
              Shop Now
            </button>
          </div>
          <div>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Hero Preview"
                className="rounded-2xl shadow-md w-full object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-slate-100 rounded-2xl flex items-center justify-center">
                <p className="text-slate-400">Image Preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroForm;
