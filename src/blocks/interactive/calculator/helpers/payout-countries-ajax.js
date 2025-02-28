import ajaxLoader from './ajax-loader';
import removeLoader from './remove-loader';
import ajaxReceiveMethods from './ajax-receive-methods';

export default function payoutCountriesAjax(self) {
    
    let selectedID = self.getAttribute('data-id');
    let selectedChannel = self.getAttribute('data-channel');
    let selectedCode = self.getAttribute('data-code');
    let preferredCode = self.closest('.mukuru-calculator').getAttribute('data-preferred-out');

    removeLoader('.mukuru-calculator__switch');

    ajaxLoader('.mukuru-calculator__switch', 'absolute', false, false);

    fetch(mukuru_obj.ajaxurl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: "calculator_callback",
            'selected_id': selectedID,
            'selected_channel': selectedChannel,
            'selected_code': selectedCode,
            'payout_countries_ajax': true
        })
    })
    .then(response => response.json())
    .then(returned => {

        console.log(returned);
        
        if (returned.status !== 'success') {
            throw new Error('Failed to fetch data');
        }

        let newList = '';
        let returnedNames = Object.keys(returned.data);
        returnedNames.sort();
        let hiddenCurrency = '';
        let hiddenCode = '';
        let flagCode = '';

        returnedNames.forEach(item => {
            if (returned.data[item]['payInCountryCode'] == preferredCode && preferredCode != selectedCode) {
                hiddenCurrency = returned.data[item]['payOutCurrencyCode'];
                hiddenCode = returned.data[item]['payOutCountryCode'];
                flagCode = returned.data[item]['payInCountryCode'];
            }

            newList += `<span class="currency__option ${returned.data[item]['payInCountryCode']} ${returned.data[item]['payOutCurrencyCode']}" data-currency="${returned.data[item]['payOutCurrencyCode']}" data-code="${returned.data[item]['payInCountryCode']}"><span class="flag select ${returned.data[item]['payInCountryCode']}" data-os-flag=""></span>${item}</span>`;
        });

        if (hiddenCurrency === '') {
            hiddenCurrency = returned.data[returnedNames[0]]['payOutCurrencyCode'];
            hiddenCode = returned.data[returnedNames[0]]['payOutCountryCode'];
            flagCode = returned.data[returnedNames[0]]['payInCountryCode'];
            preferredCode = returned.data[returnedNames[0]]['payOutCountryCode'];
        }

        let calculator = self.closest('.mukuru-calculator');
        calculator.querySelector('.mukuru-calculator__receive .selected_currency .hidden-currency').value = hiddenCurrency;
        calculator.querySelector('.mukuru-calculator__receive .selected_currency .hidden-code').value = hiddenCode;
        calculator.querySelector('.mukuru-calculator__receive .selected_currency .text').textContent = hiddenCurrency;
        calculator.querySelector('.mukuru-calculator__receive .selected_currency .flag').className = `flag ${flagCode}`;
        calculator.querySelector('.mukuru-calculator__receive .currency_dropdown').innerHTML = newList;

        ajaxReceiveMethods(self, selectedCode, preferredCode);
        removeLoader('.mukuru-calculator__switch');

        // Enable Calculator Inputs
        calculator.style.pointerEvents = 'all';
        document.querySelector('a[href="#calculate"]').click();
    })
    .catch(error => {
        console.error('Error:', error);
        removeLoader('.mukuru-calculator__switch');
    });
}