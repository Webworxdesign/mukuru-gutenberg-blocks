import ajaxLoader from './ajax-loader';
import removeLoader from './remove-loader';
import ajaxReceiveMethods from './ajax-receive-methods';

export default function payoutCountriesAjax(self) {
    
    let selectedID = self.getAttribute('data-id');
    let selectedChannel = self.getAttribute('data-channel');
    let selectedCode = self.getAttribute('data-code');
    let payIn, payOut;
    let preferredCode = self.closest('.mukuru-calculator').getAttribute('data-preferred-out');
    ajaxLoader('.mukuru-calculator__switch', 'absolute', false, false);

    fetch(mukuru_obj.ajaxurl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
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
        let selfSuccess = self;
        let newList = '';
        let returnedNames = Object.keys(returned);
        returnedNames.sort();
        let hiddenCurrency = '';
        let hiddenCode = '';
        let flagCode = '';
        let selectedCode = selfSuccess.closest('.mukuru-calculator').querySelector('.mukuru-calculator__send .hidden-code').value;

        returnedNames.forEach(item => {
            if (returned[item]['payInCountryCode'] == preferredCode && preferredCode != selectedCode) {
                payIn = returned[item]['payInCountryCode'];
                payOut = selectedCode;
                hiddenCurrency = returned[item]['payOutCurrencyCode'];
                hiddenCode = returned[item]['payOutCountryCode'];
                flagCode = returned[item]['payInCountryCode'];
            }

            newList += (`<span class="currency__option ${returned[item]['payInCountryCode']} ${returned[item]['payOutCurrencyCode']}" data-currency="${returned[item]['payOutCurrencyCode']}" data-code="${returned[item]['payInCountryCode']}"><span class="flag select ${returned[item]['payInCountryCode']}" data-os-flag=""></span>${item}</span>`);
        });

        if (hiddenCurrency === '') {
            payIn = returned[returnedNames[0]]['payInCountryCode'];
            payOut = selectedCode;
            hiddenCurrency = returned[returnedNames[0]]['payOutCurrencyCode'];
            hiddenCode = returned[returnedNames[0]]['payOutCountryCode'];
            flagCode = returned[returnedNames[0]]['payInCountryCode'];
            preferredCode = returned[returnedNames[0]]['payOutCountryCode'];
        }

        selfSuccess.closest('.mukuru-calculator').querySelector('.mukuru-calculator__receive .selected_currency .hidden-currency').value = hiddenCurrency;
        selfSuccess.closest('.mukuru-calculator').querySelector('.mukuru-calculator__receive .selected_currency .hidden-code').value = hiddenCode;
        selfSuccess.closest('.mukuru-calculator').querySelector('.mukuru-calculator__receive .selected_currency .text').textContent = hiddenCurrency;
        selfSuccess.closest('.mukuru-calculator').querySelector('.mukuru-calculator__receive .selected_currency .flag').className = `flag ${flagCode}`;

        selfSuccess.closest('.mukuru-calculator').querySelector('.mukuru-calculator__receive .currency_dropdown').innerHTML = newList;

        ajaxReceiveMethods(selfSuccess, selectedCode, preferredCode);
        removeLoader('.mukuru-calculator__switch');

        self.closest('.mukuru-calculator').style.pointerEvents = 'all';
    });
}