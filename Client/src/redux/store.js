import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import {
  useSelector as useAppSelector,
  useDispatch as useAppDispatch,
} from "react-redux";

const rootReducer = combineReducers({
  user: userSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

const { dispatch } = store;
const useSelector = useAppSelector;
const useDispatch = () => useAppDispatch();

export { store, dispatch, useSelector, useDispatch };
