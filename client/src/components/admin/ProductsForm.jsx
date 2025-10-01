import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../../store/useStore";
import axios from "axios";
import {
  FaPlus,
  FaSave,
  FaPencilAlt,
  FaTrash,
  FaTimes,
  FaPen,
  FaParagraph,
} from "react-icons/fa";
// ✅ FIX: Corrected import path assuming modal is in the same folder. Adjust if needed.
import ConfirmationModal from "./ConfirmationModel";
import { actionTypes } from "../../store/actions";

// --- Helper Components (No changes) ---
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

// --- Main Component ---
const ProductsForm = () => {
  const { state, dispatch } = useStore();
  const [localProducts, setLocalProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (state.products) {
      // ✅ FIX: This logic is now more robust. It ensures that every product
      // object always has an `images` array, converting old `imageUrl` data
      // on the fly and creating an empty array if no image data exists.
      // This is the key fix for the display bug.
      const initialProducts = state.products.map((p) => ({
        ...p,
        images: p.images || (p.imageUrl ? [p.imageUrl] : []),
      }));
      setLocalProducts(initialProducts);
    }
  }, [state.products]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const removeExistingImage = (imageUrlToRemove) => {
    setEditingProduct((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrlToRemove),
    }));
  };

  const handleDelete = (idToDelete) => {
    setProductToDeleteId(idToDelete);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDeleteId) {
      try {
        await axios.delete(
          `http://localhost:5001/api/content/products/${productToDeleteId}`
        );
        const updatedProducts = localProducts.filter(
          (p) => p._id !== productToDeleteId
        );
        setLocalProducts(updatedProducts);
        dispatch({
          type: actionTypes.UPDATE_PRODUCTS,
          payload: updatedProducts,
        });
        alert("Product deleted successfully.");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(`Deletion Failed: ${error.message}`);
      } finally {
        setIsConfirmModalOpen(false);
        setProductToDeleteId(null);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product, images: product.images || [] });
    setSelectedFiles([]);
  };

  const handleAddNew = () => {
    setEditingProduct({
      _id: `temp-${Date.now()}`,
      name: "",
      description: "",
      images: [],
    });
    setSelectedFiles([]);
  };

  const handleModelTextChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editingProduct.name) {
      alert("Product name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", editingProduct.name);
    formData.append("description", editingProduct.description);

    if (editingProduct.images) {
      editingProduct.images.forEach((imgUrl) => {
        formData.append("existingImages", imgUrl);
      });
    }
    selectedFiles.forEach((file) => {
      formData.append("productImages", file);
    });
    try {
      const isNewProduct = editingProduct._id.toString().startsWith("temp-");
      let response;
      let updatedProducts;

      if (isNewProduct) {
        response = await axios.post(
          "http://localhost:5001/api/content/products",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        updatedProducts = [...localProducts, response.data];
      } else {
        response = await axios.put(
          `http://localhost:5001/api/content/products/${editingProduct._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        updatedProducts = localProducts.map((p) =>
          p._id === editingProduct._id ? response.data : p
        );
      }
      setLocalProducts(updatedProducts);
      dispatch({ type: actionTypes.UPDATE_PRODUCTS, payload: updatedProducts });

      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      alert(`Save failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // ✅ FIX: Corrected the console.log to show the entire array for debugging.
  // This will no longer show 'undefined'.
  console.log("Current local products state:", localProducts);

  return (
    <div>
      {/* Header and main actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manage Products</h2>
          <p className="text-slate-500 text-sm mt-1">
            Add, edit, or delete individual product listings.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            <FaPlus size={12} /> Add New
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        <AnimatePresence>
          {localProducts.map((p) => (
            <motion.div
              key={p._id}
              layout
              className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-200"
            >
              <img
                src={
                  p.images && p.images.length > 0
                    ? `http://localhost:5001/${p.images[0]}`
                    : "https://placehold.co/600x400/EEE/31343C?text=No+Image"
                }
                alt={p.name}
                className="w-16 h-16 object-cover bg-slate-50 rounded-md p-1"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{p.name}</h3>
                <p className="text-slate-500 text-sm">{p.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-md"
                >
                  <FaPencilAlt />
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal for Editing/Adding */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <motion.div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-6 relative">
              <h3 className="text-lg font-bold mb-4 text-slate-800">
                {editingProduct._id.toString().startsWith("temp-")
                  ? "Add New Product"
                  : "Edit Product"}
              </h3>
              <div className="space-y-4">
                <InputField
                  icon={<FaPen />}
                  name="name"
                  placeholder="Product Name"
                  value={editingProduct.name}
                  onChange={handleModelTextChange}
                />
                <TextAreaField
                  icon={<FaParagraph />}
                  name="description"
                  placeholder="Product Description"
                  value={editingProduct.description}
                  onChange={handleModelTextChange}
                />
                <div>
                  <label className="block text-slate-700 font-medium mb-2 text-sm">
                    Images
                  </label>
                  {editingProduct.images &&
                    editingProduct.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {editingProduct.images.map((imgUrl) => (
                          <div key={imgUrl} className="relative group">
                            <img
                              src={`http://localhost:5001/${imgUrl}`}
                              alt="Existing product"
                              className="w-full h-24 object-cover rounded-md border"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(imgUrl)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2"
                  >
                    <FaSave /> Save
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-semibold py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <FaTimes size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Product Deletion"
        message="Are you sure you want to permanently delete this product? This action cannot be undone."
      />
    </div>
  );
};

export default ProductsForm;
