import { combineReducers } from 'redux'
import ThemeReducer from "./ThemeReducer"
import ReducerAuth from './authReducer'

const Reducers = combineReducers({
  ThemeReducer,
  ReducerAuth,
})
export type RootState = ReturnType<typeof Reducers>;
export default Reducers
