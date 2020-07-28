import store from '../../store';
import closeCustomAction from '../closeCustomAction/closeCustomAction';
function saveCustomDataAction(data){
    store.dispatch(closeCustomAction());
    return{
        type:'SAVE_CUSTOM_DATA',
        data:data
    }
}


export default saveCustomDataAction;