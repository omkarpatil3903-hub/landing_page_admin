// src/store/reducer.js
import { actionTypes } from "./actions";

export const initialState = {
  isLoading: true,
  error: null,
  heroData: {},
  aboutData: {},
  products: {},
  testimonials: {},
  contact: {},
  queries: {},
  faq: {},
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, isLoading: false, error: action.payload };

    case actionTypes.SET_INITIAL_DATA:
      return {
        ...state,
        isLoading: false,
        error: null,
        // ✅ FIX: Store the entire object from the payload, not just the items array
        heroData: action.payload.hero || {},
        aboutData: action.payload.about || {},
        products: action.payload.products || [],
        testimonials: action.payload.testimonials || { items: [] },
        contact: action.payload.contact || {},
        queries: action.payload.query || { items: [] },
        faq: action.payload.faq || { items: [] },
      };

    // ✅ FIX: Standardized action name and corrected logic to handle a FLAT object
    case actionTypes.UPDATE_HERO_DATA:
      return { ...state, heroData: action.payload };

    // ✅ FIX: Standardized action name and corrected the copy-paste error
    case actionTypes.UPDATE_ABOUT_DATA:
      return { ...state, aboutData: action.payload };

    case actionTypes.UPDATE_PRODUCTS:
      return { ...state, products: action.payload };

    case actionTypes.UPDATE_FAQ:
      return { ...state, faq: action.payload };

    case actionTypes.UPDATE_TESTIMONIALS:
      return { ...state, testimonials: action.payload };

    case actionTypes.UPDATE_CONTACT:
      return { ...state, contact: action.payload };

    case actionTypes.UPDATE_QUERIES:
      return { ...state, queries: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
