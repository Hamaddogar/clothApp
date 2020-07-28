import userSevice from '../../../services/accounts/accountsService';
let defaultState = {
    open: false,
    users: [],
    in_process: false
}


const accountsReducer = (state = defaultState, action) => {
    
    var newState =JSON.parse(JSON.stringify(state));

    // debugger;
    switch (action.type) {

        
        case 'SAVE_USER_ACCOUNTS':

            userSevice.saveData(action.data);
            newState.in_process = true;
            return newState;

        case 'SET_USERS':            
            newState.users = action.users;
            return newState; 
            
        case 'SAVED_USER_ACCOUNTS':
                
        newState.in_process = false
        return newState;        

        case 'OPEN_ACCOUNTS':

        newState.open = true
        return newState; 
            

        case 'CLOSE_ACCOUNTS':
            
        newState.open = false;
        return newState; 

        default:
            return state;
    }
}

export default accountsReducer;