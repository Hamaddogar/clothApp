let defaultState = {
  open: false
};

const sellingReducer = (state = defaultState, action) => {
  let newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case "OPEN_SALE_DIALOG":
      newState.open = true;
      return newState;
    case "CLOSE_SALE_DIALOG":
      newState.open = false;
      return newState;
  }

  return newState;
};

export default sellingReducer;
