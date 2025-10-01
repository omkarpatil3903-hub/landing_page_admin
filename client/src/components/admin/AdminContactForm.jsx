import React, { useState, useEffect } from "react";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import { useStore } from "../../store/useStore";
import axios from "axios";
import { actionTypes } from "../../store/actions";

// The component is now named AdminContactForm
export default function AdminContactForm() {
  const { state, dispatch } = useStore();
  const [isDirty, setIsDirty] = useState(false);
  const [formData, setFormData] = useState(
    state.contact || {
      title: "",
      subtitle: "",
      phone: "",
      email: "",
      address: "",
      hours: "",
    }
  );

  useEffect(() => {
    if (state.contact) {
      setFormData(
        state.contact || {
          title: "",
          subtitle: "",
          phone: "",
          email: "",
          address: "",
          hours: "",
        }
      );
    }
  }, [state.contact]);

  const handleChange = (e) => {
    setIsDirty(true);
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSave = async () => {
    setIsDirty(false);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/content/contact",
        formData
      );
      dispatch({ type: actionTypes.UPDATE_CONTACT, payload: response.data });
      setFormData(response.data);
      alert("Contact Updated Successfully!");
    } catch (error) {
      console.error("Error Updating Contact : ", error);
      alert("Updating Contact Failed");
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Edit Contact Section
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- Left Side: Input Form --- */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subtitle
            </label>
            <textarea
              name="subtitle"
              rows={3}
              value={formData.subtitle}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Hours
            </label>
            <textarea
              name="hours"
              rows={3}
              value={formData.hours}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="pt-4">
            <button
              disabled={!isDirty}
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 rounded-md hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* --- Right Side: Live Preview --- */}
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Live Preview
          </h3>
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {formData.title || "Contact Information"}
            </h3>
            <p className="text-gray-600 mb-8 whitespace-pre-line">
              {formData.subtitle || "Your subtitle will appear here."}
            </p>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-green-100 rounded-full">
                  <FiPhone className="w-6 h-6 text-green-700" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800">Phone</h4>
                  <p className="text-gray-600 mt-1">
                    <a
                      href={`tel:${formData.phone}`}
                      className="hover:text-green-600 transition-colors"
                    >
                      {formData.phone || "+91 00000 00000"}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-green-100 rounded-full">
                  <FiMail className="w-6 h-6 text-green-700" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600 mt-1">
                    <a
                      href={`mailto:${formData.email}`}
                      className="hover:text-green-600 transition-colors"
                    >
                      {formData.email || "email@example.com"}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-green-100 rounded-full">
                  <FiMapPin className="w-6 h-6 text-green-700" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Address
                  </h4>
                  <p className="text-gray-600 mt-1 whitespace-pre-line">
                    {formData.address || "Your address will appear here."}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-green-100 rounded-full">
                  <FiClock className="w-6 h-6 text-green-700" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Business Hours
                  </h4>
                  <p className="text-gray-600 mt-1 whitespace-pre-line">
                    {formData.hours || "Your business hours will appear here."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
