import ajaxLoader from './ajax-loader';
import removeLoader from './remove-loader';

export default function payoutCountriesAjax(self) {
    console.log('payoutCountriesAjax');
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
        let newList = '';
        let returnedNames = Object.keys(returned);
        returnedNames.sort();
        let hiddenCurrency = '';
        let hiddenCode = '';
        let flagCode = '';
        let sendSelectedCode = self.closest('.mukuru-calculator').querySelector('.mukuru-calculator__send .hidden-code').value;

        returnedNames.forEach(item => {
            if (returned[item]['payInCountryCode'] == preferredCode && preferredCode != selectedCode) {
                hiddenCurrency = returned[item]['payOutCurrencyCode'];
                hiddenCode = returned[item]['payOutCountryCode'];
                flagCode = returned[item]['payInCountryCode'];
            }

            newList += `<span class="currency__option ${returned[item]['payInCountryCode']} ${returned[item]['payOutCurrencyCode']}" data-currency="${returned[item]['payOutCurrencyCode']}" data-code="${returned[item]['payInCountryCode']}"><span class="flag select ${returned[item]['payInCountryCode']}" data-os-flag=""></span>${item}</span>`;
        });

        if (hiddenCurrency === '') {
            hiddenCurrency = returned[returnedNames[0]]['payOutCurrencyCode'];
            hiddenCode = returned[returnedNames[0]]['payOutCountryCode'];
            flagCode = returned[returnedNames[0]]['payInCountryCode'];
            preferredCode = returned[returnedNames[0]]['payOutCountryCode'];
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
    })
    .catch(error => {
        console.error('Error:', error);
        removeLoader('.mukuru-calculator__switch');
    });
}