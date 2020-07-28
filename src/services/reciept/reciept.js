import { db } from '../../data/config';
export default {
    getReciept: () => {
        return db.collection('data').doc('reciept').get().then(doc => {
            if(doc.exists){
                return doc.data().recieptNo;
            }
            else{
                db.collection('data').doc('reciept').set({
                    recieptNo: 1
                })
                return 1
            }
        })
    },
    increaseReciept: () => {
        return db.collection('data').doc('reciept').get().then(doc => {
            if(doc.exists){
                let recieptNo = doc.data().recieptNo;
                db.collection('data').doc('reciept').set({
                    recieptNo: recieptNo+1
                })
            }
        })
    }
}