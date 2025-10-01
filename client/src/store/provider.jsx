import React, { useReducer } from "react";
import { StoreContext } from "./context.js"; // Import the context
import { reducer, initialState } from "./reducer.js"; // Assuming reducer is a .jsx file

// This file now ONLY exports the provider component.
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
