let defaultState = {
    discount:0,
     open: false
};

const settingsReducer = (state = defaultState, action) => {

    let newSales = JSON.parse(JSON.stringify(state));

    switch (action.type) {

        case 'OPEN_SALES_OFFER':
            newSales.open = true;
        return newSales;  
        
        case 'CLOSE_SALES_OFFER':
            newSales.open = false;
         return newSales;  
         case 'DISCOUNT_VALUE':
         newSales.discount = parseInt(action.data)
        return newSales;      
                
    }

    return state;
}

export default settingsReducer;