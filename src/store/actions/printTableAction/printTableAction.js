export function printTableAction(data){
    return{
        type:'PRINT_TABLE_DATA',
        data:data
    }
}
export function printEstimationAction(data){
    return{
        type:'PRINT_ESTIMATION_BILL',
        data:data
    }
}

export function pre_printEstimationAction(data){
    return{
        type:'PRE_PRINT_ESTIMATION_BILL',
        data:data
    }
}
// export default printTableAction;