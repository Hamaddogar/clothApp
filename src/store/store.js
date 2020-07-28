import {createStore,combineReducers} from 'redux';
import openTableReducer from './reducers/openTableReducer/openTableReducer';
import openCustomReducer from './reducers/openCustomReducer/openCustomReducer';
import reportPhase1Reducer from './reducers/reportPhase1Reducer/reportPhase1Reducer';
import reportPhase2Reducer from './reducers/reportPhase2Reducer/reportPhase2Reducer';
import reportPhase3Reducer from './reducers/reportPhase3Reducer/reportPhase3Reducer';
import closeTableButSaveReducer from './reducers/closeTableButSaveReducer/closeTableButSaveReducer';
import closeCustomButSaveReducer from './reducers/closeCustomButSaveReducer/closeCustomButSaveReducer';
import loginReducer from './reducers/loginReducer/loginReducer';
import barCodeReducer from './reducers/barCodeReducer/barCodeReducer';
import accountsData from './reducers/accountsReducer/accountsReducer';
import purchasingReducer from './reducers/purchasingReducer/purchasingReducer';
import settingsReducer from './reducers/salesOfferReducer/salesOfferReducer';
import sellingReducer from './reducers/sellingReducer/sellingReducer';
import transactionsReducer from './reducers/transactionsReducer/transactionsReducer'

let AllReducers = combineReducers({transactionsReducer,sellingReducer,purchasingReducer, barCodeReducer, accountsData, openTableReducer,openCustomReducer,reportPhase1Reducer,reportPhase2Reducer,reportPhase3Reducer,closeTableButSaveReducer,closeCustomButSaveReducer,loginReducer,settingsReducer});
   
let store = createStore(AllReducers);
export default store;