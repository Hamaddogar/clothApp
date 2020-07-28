import { db } from '../../data/config';
import store from '../../store/store';
import history from '../../history';

export default {
    getLoginData: (data) => {
        db.collection('profile').doc('user').get().then((doc)=>{
            if(doc.exists && doc.data().users){
                //if(data.email == doc.data().user.email && data.password == doc.data().user.password){

                    let userFound = doc.data().users.find((item)=>{
                        
                        return item.username == data.email && item.password == data.password;
                        
                    });
                    
                    if(userFound){
                                                
                        store.dispatch({
                            type: 'USER_LOGIN',
                            user:userFound,
                        });
                        
                        store.dispatch({
                            type: 'SET_USERS',
                            users:userFound.type == "admin" ? doc.data().users : []
                        });                                                                    
                        
                        history.push('/club');

                    }
                                    
             }
                else{
                  //  alert('username or password incorrect!');
               }
           // }
        })
    }
}