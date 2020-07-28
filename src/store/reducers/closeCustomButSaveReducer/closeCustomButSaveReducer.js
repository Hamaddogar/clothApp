let defaultState = {
    flag: false,
    openCustom: {}
}


const closeCustomButSaveReducer = (state = defaultState,action)=>{
    // debugger;
    switch(action.type){
        case 'SAVE_CUSTOM_DATA':
        return{
            openCustom: action.data,
            flag: true
        }
        case 'REMOVE_CUSTOM_DATA_AFTER_PRINT':
            return{
                openCustom: {},
                flag: false
            }  
        default:
        return state;
    }
}

export default closeCustomButSaveReducer;