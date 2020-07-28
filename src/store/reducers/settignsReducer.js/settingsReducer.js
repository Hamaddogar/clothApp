

import saveDataService from '../../../services/saveDataService/saveDataService';
// import settings from '../../../services/saveDataService/saveDataService';


let defaultState ={


};

const settingsReducer = (state = defaultState, action) => {
    
    switch (action.type) {

        case 'LOAD_DATA':
            return {
             payload: saveDataService.getSigleItemSettingsData(action.data)
            }

    }

    return state;

}

export default settingsReducer;
