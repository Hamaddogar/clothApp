import { db } from '../../data/config';
export function getDishes() {
    return db.collection('data').doc('dishes').get().then((doc) => {
        // debugger;
        if (doc.exists) {
            return doc.data().menuData;
        }
    });
}

