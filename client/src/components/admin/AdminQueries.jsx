import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserCircle,
} from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModel"; // Assuming this path is correct
import { useStore } from "../../store/useStore"; // Assuming this path is correct
import { actionTypes } from "../../store/actions"; // Assuming this path is correct
import axios from "axios";

const AdminQueries = () => {
  const [queryToAction, setQueryToAction] = useState(null); // { query: object, type: 'delete' | 'resolve' }
  const { state, dispatch } = useStore();
  const [queries, setQueries] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // MOCK DATA: Using the same mock data as before
  useEffect(() => {
    const mockQueries = [
      {
        _id: "q1",
        name: "John Doe",
        phone: "123-456-7890",
        query:
          "I have an issue with my recent order #1234. The item arrived damaged.",
        status: "pending",
      },
      {
        _id: "q2",
        name: "Jane Smith",
        phone: "098-765-4321",
        query:
          "Could you please provide more information about your return policy?",
        status: "pending",
      },
      {
        _id: "q3",
        name: "Sam Wilson",
        phone: "555-555-5555",
        query: "My account seems to be locked. I cannot reset my password.",
        status: "resolved",
      },
    ];

    if (state.queries && state.queries.items) {
      setQueries(state.queries.items);
    } else {
      setQueries(mockQueries);
    }
  }, [state.queries]);

  const handleActionClick = (query, actionType) => {
    setQueryToAction({ query, type: actionType });
  };

  const handleConfirmAction = async () => {
    if (!queryToAction) return;
    const { query, type } = queryToAction;
    setIsUpdating(true);
    try {
      let updatedList;
      if (type === "delete") {
        updatedList = queries.filter((q) => q._id !== query._id);
      } else if (type === "resolve") {
        updatedList = queries.map((q) =>
          q._id === query._id ? { ...q, status: "resolved" } : q
        );
      }
      const response = await axios.post(
        "http://localhost:5001/api/content/query",
        updatedList
      );
      dispatch({
        type: actionTypes.UPDATE_QUERIES,
        payload: response.data,
      });
    } catch (err) {
      console.error("Failed to update queries:", err);
      alert("An error occurred: " + err.message);
    } finally {
      setIsUpdating(false);
      setQueryToAction(null);
    }
  };

  const getModalDetails = () => {
    if (!queryToAction) return {};
    const { query, type } = queryToAction;
    if (type === "delete") {
      return {
        title: "Delete Query",
        message: `Are you sure you want to delete the query from ${query.name}? This action cannot be undone.`,
      };
    }
    if (type === "resolve") {
      return {
        title: "Resolve Query",
        message: `Are you sure you want to mark the query from ${query.name} as resolved?`,
      };
    }
    return {};
  };

  return (
    <div id="queries">
      <h2 className="text-xl font-bold mb-4 text-slate-800">
        Manage User Queries
      </h2>

      {queries.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
          <FaExclamationTriangle className="mx-auto text-4xl text-slate-300 mb-4" />
          <p className="text-slate-500">No new queries at the moment.</p>
        </div>
      ) : (
        <div>
          {/* == MOBILE VIEW: CARD LAYOUT == */}
          {/* Visible on screens smaller than `md`, hidden on `md` and up */}
          <div className="md:hidden space-y-4">
            <AnimatePresence>
              {queries.map((q) => (
                <motion.div
                  key={q._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white border border-slate-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium whitespace-nowrap">
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        <FaUserCircle className="text-slate-400" /> {q.name}
                      </div>
                      <div className="text-xs text-slate-500 ml-6">
                        {q.phone}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        q.status === "resolved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {q.status === "resolved" ? "Resolved" : "Pending"}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 border-t border-slate-100 pt-3">
                    {q.query}
                  </p>

                  <div className="text-right border-t border-slate-100 pt-2">
                    {q.status !== "resolved" && (
                      <button
                        onClick={() => handleActionClick(q, "resolve")}
                        disabled={isUpdating}
                        className="p-2 text-slate-400 hover:text-green-600 rounded-md hover:bg-green-50 transition-colors disabled:opacity-50"
                        title="Mark as Resolved"
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                    <button
                      onClick={() => handleActionClick(q, "delete")}
                      disabled={isUpdating}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Delete Query"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* == DESKTOP VIEW: TABLE LAYOUT == */}
          {/* Hidden by default, becomes a table on `md` screens and up */}
          <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm text-left text-slate-700">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    User Details
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Query Message
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {queries.map((q) => (
                    <motion.tr
                      key={q._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="bg-white border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-medium whitespace-nowrap">
                        <div className="font-semibold text-slate-800 flex items-center gap-2">
                          <FaUserCircle className="text-slate-400" /> {q.name}
                        </div>
                        <div className="text-xs text-slate-500 ml-6">
                          {q.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <p className="line-clamp-3">{q.query}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            q.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {q.status === "resolved" ? "Resolved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {q.status !== "resolved" && (
                          <button
                            onClick={() => handleActionClick(q, "resolve")}
                            disabled={isUpdating}
                            className="p-2 text-slate-400 hover:text-green-600 rounded-md hover:bg-green-50 transition-colors disabled:opacity-50"
                            title="Mark as Resolved"
                          >
                            <FaCheckCircle />
                          </button>
                        )}
                        <button
                          onClick={() => handleActionClick(q, "delete")}
                          disabled={isUpdating}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete Query"
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

      {/* Reusable confirmation modal (no changes needed here) */}
      <ConfirmationModal
        isOpen={!!queryToAction}
        onClose={() => setQueryToAction(null)}
        onConfirm={handleConfirmAction}
        title={getModalDetails().title}
        message={getModalDetails().message}
        confirmButtonColor={queryToAction?.type === "delete" ? "red" : "green"}
        confirmText={
          queryToAction?.type === "delete" ? "Yes, Delete" : "Resolve Query"
        }
      />
    </div>
  );
};

export default AdminQueries;
