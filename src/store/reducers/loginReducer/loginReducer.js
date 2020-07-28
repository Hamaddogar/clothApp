import loginServices from '../../../services/loginServices/loginServices';
import {getSettings} from '../../../services/settings/settings';
import store from '../../store';

let defaultState = {
    flag: false,
    user: false,
    report: false,
    loggedIn:null
}

const loginReducer = (state = defaultState,action)=>{
    switch(action.type){
        case 'GET_LOGIN_DATA':
        loginServices.getLoginData(action.data);
        return state;
        case 'REPORT_LOGIN':
        return {
            flag: true,
            user: false,
            report: true
        }
        case 'USER_LOGIN':
        
        getSettings().then((resp) => {        

            store.dispatch({
                type:'DOWNLOAD_DATA',
                payload:resp
            });

        });

        return {
            flag: true,
            user: true,
            loggedIn:action.user,
            report: false
        }

        case 'USER_LOGOUT':
        return {
            flag: false,
            user: false,
            report: false,
            loggedIn:{}
        }
        default:
        return state;
    }
}

export default loginReducer;