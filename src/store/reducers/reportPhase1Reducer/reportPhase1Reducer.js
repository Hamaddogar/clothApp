let defaultState = {
    flag: false,
    dataArray: []
}


const reportPhase1Reducer = (state = defaultState,action)=>{
    switch(action.type){
        case 'GET_DATA_PHASE_1':
            return{
                flag: true,
                dataArray: action.data
            }
        case 'CLOSE_PHASE_1':
            return{
                flag: false,
                dataArray: state.dataArray
            }
            
        default:
        return state;
    }
}

export default reportPhase1Reducer;