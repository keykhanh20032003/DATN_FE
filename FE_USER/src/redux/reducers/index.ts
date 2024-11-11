import { combineReducers } from 'redux'
import AuthReducer from './authReducer';
import CartReducer from './cartReducer';


const Reducers = combineReducers({
  AuthReducer,
  CartReducer,
})
export type RootState = ReturnType<typeof Reducers>;
export default Reducers
