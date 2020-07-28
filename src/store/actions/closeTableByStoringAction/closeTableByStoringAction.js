import store from '../../store';
import closeTableAction from '../closeDialogAction/closeDialogAction';
export function closeTableByStoringAction(data){
    store.dispatch(closeTableAction());
    return{
        type:'ADD_OPEN_TABLES',
        data:data
    }
}

export function removeTableByStoringAction(data){
    store.dispatch(closeTableAction());
    return{
        type:'REMOVE_OPEN_TABLES',
        data:data
    }
}


// export default closeTableByStoringAction;