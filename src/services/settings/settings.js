import { db } from '../../data/config';

export  function getSettings() {
    debugger;
    return db.collection('settings').doc('brands').get().then((doc) => {
        // debugger;
        if (doc.exists) {
            return doc.data();
        }
    });

}