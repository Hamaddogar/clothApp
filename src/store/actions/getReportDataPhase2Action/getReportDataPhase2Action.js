function getReportDataPhase2Action(data){
    return{
        type:'GET_DATA_PHASE_2',
        data: data.item,
        today: data.today
    }
}
export default getReportDataPhase2Action;