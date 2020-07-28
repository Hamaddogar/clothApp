function filterAfterPrintAction(tableName){
    return{
        type:'FILTER_AFTER_PRINT',
        tableName:tableName
    }
}
export default filterAfterPrintAction;