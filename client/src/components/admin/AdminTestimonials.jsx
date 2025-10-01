import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaStar, FaExclamationTriangle } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModel";
import { useStore } from "../../store/useStore";
import { actionTypes } from "../../store/actions";
import axios from "axios";

// UI/UX: A dedicated component for displaying star ratings visually
const RatingStars = ({ rating, className }) => (
  <div className={`flex items-center gap-0.5 ${className}`}>
    {[...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-yellow-400" : "text-slate-300"}
      />
    ))}
  </div>
);

const AdminTestimonials = () => {
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const { state, dispatch } = useStore();
  const [testimonials, setTestimonials] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Adding mock data for demonstration purposes if the store is empty
    const mockTestimonials = [
      {
        _id: "t1",
        author: "Priya Sharma",
        location: "Mumbai, India",
        quote:
          "This service exceeded all my expectations. Highly recommended for everyone!",
        rating: 5,
      },
      {
        _id: "t2",
        author: "Rajesh Kumar",
        location: "Delhi, India",
        quote:
          "Good experience overall, but the delivery was a day late. Still, the product quality is excellent.",
        rating: 4,
      },
      {
        _id: "t3",
        author: "Anjali Singh",
        location: "Bangalore, India",
        quote:
          "A truly seamless and wonderful experience from start to finish. The customer support was fantastic.",
        rating: 5,
      },
    ];

    if (
      state.testimonials &&
      state.testimonials.items &&
      state.testimonials.items.length > 0
    ) {
      setTestimonials(state.testimonials.items);
    } else {
      setTestimonials(mockTestimonials);
    }
  }, [state.testimonials]);

  const handleDeleteClick = (id) => {
    setTestimonialToDelete(id);
  };

  const handleDelete = async (idToDelete) => {
    setIsUpdating(true);
    try {
      const updatedList = testimonials.filter((t) => t._id !== idToDelete);
      const response = await axios.post(
        "http://localhost:5001/api/content/testimonials",
        updatedList
      );
      dispatch({
        type: actionTypes.UPDATE_TESTIMONIALS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      alert("An error occurred: " + err.message);
    } finally {
      setIsUpdating(false);
      setTestimonialToDelete(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-slate-800">
        Manage Testimonials
      </h2>

      {testimonials.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
          <FaExclamationTriangle className="mx-auto text-4xl text-slate-300 mb-4" />
          <p className="text-slate-500">No testimonials available.</p>
        </div>
      ) : (
        <div>
          {/* == MOBILE VIEW: CARD LAYOUT == */}
          <div className="md:hidden space-y-4">
            <AnimatePresence>
              {testimonials.map((t) => (
                <motion.div
                  key={t._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white border border-slate-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {t.author}
                      </div>
                      <div className="text-xs text-slate-500">{t.location}</div>
                    </div>
                    <RatingStars rating={t.rating} />
                  </div>
                  <p className="text-sm text-slate-600 border-t border-slate-100 pt-3">
                    "{t.quote}"
                  </p>
                  <div className="text-right border-t border-slate-100 pt-2">
                    <button
                      onClick={() => handleDeleteClick(t._id)}
                      disabled={isUpdating}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* == DESKTOP VIEW: TABLE LAYOUT == */}
          <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm text-left text-slate-700">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Feedback
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {testimonials.map((t) => (
                    <motion.tr
                      key={t._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="bg-white border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-medium whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {t.author}
                        </div>
                        <div className="text-xs text-slate-500">
                          {t.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-sm">
                        <p className="line-clamp-2">"{t.quote}"</p>
                      </td>
                      <td className="px-6 py-4">
                        <RatingStars
                          rating={t.rating}
                          className="justify-center"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteClick(t._id)}
                          disabled={isUpdating}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reusable confirmation modal (no changes needed) */}
      <ConfirmationModal
        isOpen={!!testimonialToDelete}
        onClose={() => setTestimonialToDelete(null)}
        onConfirm={() => handleDelete(testimonialToDelete)}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
      />
    </div>
  );
};

export default AdminTestimonials;
