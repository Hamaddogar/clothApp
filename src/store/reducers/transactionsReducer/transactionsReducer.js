import saveDataService from "../../../services/saveDataService/saveDataService";

let defaultState = [];

const transactionsReducer = (state = defaultState, action) => {
  let newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case "SAVE_TRANSACTIONS_DATA":
      newState = { ...state };
      debugger;
      console.log(newState);
      saveDataService.saveTransactionsData(action.data);
      return newState;
    case "UPDATED_TRANSACTIONS":
      newState = { ...state };
      newState.inProcess = false;
      return newState;
    case "LOAD_TRANSACTIONS_DATA":
        return newState = action.data     
    default:
      return newState;
  }
};
export default transactionsReducer;
