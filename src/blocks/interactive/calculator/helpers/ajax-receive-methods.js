import ajaxLoader from './ajax-loader';
import removeLoader from './remove-loader';

export default function ajaxReceiveMethods(self, selectedCode = 'ZA', preferredCode) {
    
    ajaxLoader('.mukuru-calculator__switch', 'absolute', false, false);

    if (typeof mukuru_obj === 'undefined' || !mukuru_obj.ajaxurl) {
        console.error('mukuru_obj or mukuru_obj.ajaxurl is not defined');
        removeLoader('.mukuru-calculator__switch');
        return;
    }

    fetch(mukuru_obj.ajaxurl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: "calculator_product_callback",
            'in_code': selectedCode,
            'out_code': preferredCode,
        })
    })
    .then(response => response.text())
    .then(text => {
        try {
            const jsonText = text.trim().replace(/[^}\]]+$/, '');
            return JSON.parse(jsonText);
        } catch (error) {
            throw new Error('Invalid JSON: ' + text);
        }
    })
    .then(returned => {
        let paymentMethods = returned?.items?.map((product) => {
            return `<li class="payout-method" data-calculator-type="${product.calculatorType}" data-type="${product.type}" data-payout-currency="${product.payOutCurrencyCode}" data-wp-on--click="actions.payoutMethods">${product.payoutName}</li>`;
        }) || [];

        if (paymentMethods.length > 0) {
            // Change payin label
            if (paymentMethods[0].includes('data-calculator-type="you-send"')) {
                self.closest(".mukuru-calculator").querySelector('.mukuru-calculator__send .mukuru-calculator__label').textContent = 'You send';
            } else {
                self.closest(".mukuru-calculator").querySelector('.mukuru-calculator__send .mukuru-calculator__label').textContent = 'You pay';
            }

            document.querySelector('.selected-out-option').innerHTML = `${paymentMethods[0]}<span class="dropdown-arrow"><icon><svg xmlns="http://www.w3.org/2000/svg" width="13px" height="9px" viewBox="0 0 13 9" fill="#fff"><path d="M11.713,0.633l-5.116,5.23L1.405,0.748L0.328,1.863l6.308,6.192l6.193-6.346L11.713,0.633z"></path></svg></icon></span>`;
            document.querySelector('.currency-out-options').innerHTML = paymentMethods.join('');
        } else {
            console.error('No payment methods available');
        }

        // Enable Calculator Inputs
        document.querySelector('.mukuru-calculator').style.pointerEvents = 'all';

        setTimeout(() => {
            document.querySelector('a[href="#calculate"]').click();
            removeLoader('.mukuru-calculator__switch');
        }, 600);
    })
    .catch(error => {
        console.error('Error:', error);
        removeLoader('.mukuru-calculator__switch');
    });
}