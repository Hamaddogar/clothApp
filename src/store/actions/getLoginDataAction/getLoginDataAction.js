export function getLoginDataAction(data){
    return{
        type:'GET_LOGIN_DATA',
        data: data
    }
}

export function getLogOutAction(data){
    return{
        type:'USER_LOGOUT'        
    }
}

// export default getLoginDataAction;