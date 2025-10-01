import React, { useEffect, useState } from "react";
import ConfirmationModal from "./ConfirmationModel";
import { useStore } from "../../store/useStore";
import { actionTypes } from "../../store/actions";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import {
  FaPencilAlt,
  FaSave,
  FaTimes,
  FaQuestion,
  FaComment,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";

// InputField and TextAreaField components remain the same...
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

// --- ✅ ENHANCED FAQ Item (Now includes Edit/Delete controls) ---
const FAQItem = ({
  faq,
  index,
  activeIndex,
  setActiveIndex,
  onEdit,
  onDelete,
}) => {
  const isActive = index === activeIndex;
  const toggle = () => setActiveIndex(isActive ? null : index);

  return (
    <div
      className={`rounded-xl overflow-hidden transition-shadow duration-300 border border-slate-200 ${
        isActive ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div
        className={`w-full flex justify-between items-center p-4 transition-colors duration-300 ${
          isActive ? "bg-slate-50" : "bg-white"
        }`}
      >
        <button
          onClick={toggle}
          className="flex-1 flex items-center justify-between text-left mr-4"
          aria-expanded={isActive}
        >
          <span className="font-semibold text-slate-800">{faq.question}</span>
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-slate-500"
          >
            <FiChevronDown size={20} />
          </motion.div>
        </button>

        {/* Action Buttons are now part of the item */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <button
            onClick={() => onEdit(faq)}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="Edit FAQ"
          >
            <FaPencilAlt size={14} />
          </button>
          <button
            onClick={() => onDelete(faq._id)}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete FAQ"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key={`content-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white"
          >
            <p className="px-4 pt-2 pb-4 text-slate-600 leading-relaxed border-t border-slate-200">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Modal component remains the same...
const Modal = ({ faq, onClose, onSave }) => {
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);

  const handleSave = () => {
    onSave({ ...faq, question, answer });
    onClose();
  };

  return (
    <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative"
      >
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          {faq._id.toString().startsWith("temp-") ? "Add New FAQ" : "Edit FAQ"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 font-medium mb-1 text-sm">
              Question
            </label>
            <InputField
              icon={<FaQuestion size={14} />}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1 text-sm">
              Answer
            </label>
            <TextAreaField
              icon={<FaComment size={14} />}
              rows="5"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-md hover:bg-slate-200 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm"
          >
            <FaSave />
            Save Changes
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <FaTimes size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
};

// --- ✅ SIMPLIFIED Admin FAQ Form ---
const AdminFAQForm = () => {
  const { state, dispatch } = useStore();
  const [localFaqs, setLocalFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // Open the first item by default
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (state.faq && state.faq.items) {
      setLocalFaqs(state.faq.items);
    }
  }, [state.faq]);

  const handleAddNew = () => {
    // Logic remains the same
    const newFaq = {
      _id: `temp-${Date.now()}`,
      question: "New Question",
      answer: "New answer.",
    };
    setEditingFAQ(newFaq);
  };

  const confirmDelete = () => {
    // Logic remains the same
    setIsDirty(true);
    setLocalFaqs(localFaqs.filter((faq) => faq._id !== faqToDelete));
    setFaqToDelete(null);
  };

  const handleUpdate = (updatedFAQ) => {
    // Logic remains the same
    let updatedList;
    if (updatedFAQ._id.toString().startsWith("temp-")) {
      updatedList = [...localFaqs, updatedFAQ];
    } else {
      updatedList = localFaqs.map((faq) =>
        faq._id === updatedFAQ._id ? updatedFAQ : faq
      );
    }
    setLocalFaqs(updatedList);
    setIsDirty(true);
    // Find the index of the updated/new item and set it as active
    const newIndex = updatedList.findIndex(
      (item) => item._id === updatedFAQ._id
    );
    setActiveIndex(newIndex);
  };

  const handleSaveAll = async () => {
    // Logic remains the same
    setIsSaving(true);
    try {
      const faqsToSave = localFaqs.map(({ _id, ...rest }) => {
        return _id.toString().startsWith("temp-") ? rest : { _id, ...rest };
      });

      const response = await axios.post(
        "http://localhost:5001/api/content/faq",
        faqsToSave
      );
      dispatch({ type: actionTypes.UPDATE_FAQ, payload: response.data });
      setIsDirty(false); // Reset dirty state on successful save
      alert("FAQs updated successfully!");
    } catch (error) {
      console.error("Error saving FAQs:", error);
      alert(
        `An error occurred while saving: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // No more grid layout, just a single responsive container
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Manage FAQs</h2>
        <div className="flex gap-2">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-semibold"
          >
            <FaPlus size={12} /> Add New
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving || !isDirty}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            <FaSave size={12} /> {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* The new unified list */}
      <div className="space-y-3">
        {localFaqs.map((faq, index) => (
          <FAQItem
            key={faq._id}
            faq={faq}
            index={index}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onEdit={setEditingFAQ}
            onDelete={setFaqToDelete}
          />
        ))}
      </div>

      {/* Modals remain the same */}
      <AnimatePresence>
        {editingFAQ && (
          <Modal
            faq={editingFAQ}
            onClose={() => setEditingFAQ(null)}
            onSave={handleUpdate}
          />
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={!!faqToDelete}
        onClose={() => setFaqToDelete(null)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
      />
    </div>
  );
};

export default AdminFAQForm;
