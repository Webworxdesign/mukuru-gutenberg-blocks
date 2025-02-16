import { getElement, store, getContext } from '@wordpress/interactivity';

console.log('check-rates');

store('check-rates', {
    actions: { 
        doCalculation: () => {
            const context = getContext();
            const element = getElement(context);
            
            console.log('doCalculation', element.ref);

            let self = element.ref;
            let payInAmount;
            let payingIn = true;
            let parentWrapper = self.closest('.mukuru-calculator');
            let outCurrency = parentWrapper.querySelector('.mukuru-calculator__currency .selected-out-option .payout-method').getAttribute('data-payout-currency');
            console.log('outCurrency', outCurrency);
        }
    },
});