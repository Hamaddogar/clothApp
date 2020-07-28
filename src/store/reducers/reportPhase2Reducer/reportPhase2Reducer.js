let defaultState = {
    flag: false,
    dataObject: {},
    today: false
}


const reportPhase2Reducer = (state = defaultState,action)=>{
    switch(action.type){
        case 'GET_DATA_PHASE_2':
            return{
                flag: true,
                dataObject: action.data,
                today: action.today
            }
        case 'CLOSE_PHASE_2':
            return{
                flag: false,
                dataObject: state.dataObject,
                today: false
            }
             
        default:
        return state;
    }
}

export default reportPhase2Reducer;