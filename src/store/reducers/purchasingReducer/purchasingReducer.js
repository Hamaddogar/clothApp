let defaultState = {
  open: false
};

const purchasingReducer = (state = defaultState, action) => {
  let newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case "OPEN_RECEIPT":
      newState.open = true;
      return newState;
    case "CLOSE_PURCHASING_DIALOG":
      newState.open = false;
      return newState;
  }

  return newState;
};

export default purchasingReducer;
