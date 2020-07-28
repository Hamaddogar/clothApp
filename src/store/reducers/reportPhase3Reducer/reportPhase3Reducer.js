let defaultState = {
    flag: false,
    dataObj: {}
}


const reportPhase3Reducer = (state = defaultState,action)=>{
    switch(action.type){
        case 'GET_DATA_PHASE_3':
            return{
                flag: true,
                dataObj: action.data
            }
        case 'CLOSE_PHASE_3':
            return{
                flag: false,
                dataArray: state.dataArray
            }
            
        default:
        return state;
    }
}

export default reportPhase3Reducer;