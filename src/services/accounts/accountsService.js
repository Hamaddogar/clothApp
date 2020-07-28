import { db } from '../../data/config';
import store from '../../store/store';
import history from '../../history';

export default {
    saveData: (data) => {
        db.collection('profile').doc('user').set(data).then((data)=>{
            // if(doc.exists){
            //     if(data.email == doc.data().user.email && data.password == doc.data().user.password){
            //         store.dispatch({
            //             type: 'USER_LOGIN',
            //         });
            //         // history.push('/main');
            //         history.push('/club');
            //     }
            //     else{
            //         alert('username or password incorrect!');
            //     }
            // }
        })
    }
}