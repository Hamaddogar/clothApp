import saveDataService from '../../../services/saveDataService/saveDataService';
let defaultState = {
    flag: false,
    inProcess:false
}


const openCustomReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'OPEN_CUSTOM_ORDER':
            return {
                flag: true
            }
        case 'CLOSE_CUSTOM_ORDER':
            return {
                flag: false,
                inProcess:false
            }        

        case 'PRINT_CUSTOM_DATA':
            var sState = {...state};
            sState.inProcess = true;
            saveDataService.saveCustomDataToBackEnd(action.data);
            return sState;
        default:
            return state;
    }
}

export default openCustomReducer;