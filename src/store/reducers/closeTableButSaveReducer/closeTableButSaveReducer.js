let defaultState = {
    openTables: []
}


const closeTableButSaveReducer = (state = defaultState,action)=>{
    switch(action.type){
        // case 'REMOVE_OPEN_TABLES':
        // let sTables = JSON.parse(JSON.stringify(state.openTables));
        // sTables.openTables = sTables;
        // let sTables = state.openTables.filter((item)=>{
        //     return item.table != action.data.table;
        // });   
        // return sTables;
        // return {
        //     openTables: sTables
        // }

        case 'ADD_OPEN_TABLES':
        debugger;
            let tables = state.openTables.filter((table)=>{
                return action.data.table != table.table
            });
            tables.push(action.data);
            return {
                openTables: tables
            }
        case 'FILTER_AFTER_PRINT':
            let filtered = state.openTables.filter((table)=>{
                return action.tableName != table.table
            });
            return{
                openTables: filtered
            }
        default:
        return state;
    }
}

export default closeTableButSaveReducer;