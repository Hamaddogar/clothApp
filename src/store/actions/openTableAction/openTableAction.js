export function openTableAction(){
    return{
        type:'OPEN_TABLE',
        // hallName:selectedHallName,
        // tableName:table.name
    }
}

export function openEstimatorAction(){
    return{
        type:'OPEN_ESTIMATOR',
        // hallName:selectedHallName,
        // tableName:table.name
    }
}

export function openSettingsAction(selectedHallName,table){
    return{
        type:'OPEN_SETTINGS'
    }
}

// export default openTableAction;