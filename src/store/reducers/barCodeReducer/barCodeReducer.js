
let defaultState = {
    open:false
}

const barCodeReducer = (state = defaultState, action) => {

    let newState = JSON.parse(JSON.stringify(state));

    switch(action.type){

        case 'OPEN_BARCODE':
            newState.open = true;        
        return newState;
        case 'CLOSE_BARCODE':
            newState.open = false;        
        return newState;

    }

    return newState;
}

export default barCodeReducer;