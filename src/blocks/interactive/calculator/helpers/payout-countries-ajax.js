import ajaxLoader from './ajax-loader';
import removeLoader from './remove-loader';
import ajaxReceiveMethods from './ajax-receive-methods';

export default function payoutCountriesAjax(self) {
    
    let selectedID = self.getAttribute('data-id');
    let selectedChannel = self.getAttribute('data-channel');
    let selectedCode = self.getAttribute('data-code');
    let preferredCode = self.closest('.mukuru-calculator').getAttribute('data-preferred-out');

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

        returnedNames.forEach(item => {
            if (returned[item]['id'] == preferredCode && preferredCode != selectedCode) {
                hiddenCurrency = returned[item][Object.keys(returned[item])[0]];
                hiddenCode = item;
                flagCode = item;
            }

            newList += `<span class="currency__option ${item} ${returned[item][Object.keys(returned[item])[0]]}" data-currency="${returned[item][Object.keys(returned[item])[0]]}" data-code="${item}"><span class="flag select ${item}" data-os-flag=""></span>${Object.keys(returned[item])[0]}</span>`;
        });

        if (hiddenCurrency === '') {
            hiddenCurrency = returned[returnedNames[0]][Object.keys(returned[returnedNames[0]])[0]];
            hiddenCode = returnedNames[0];
            flagCode = returnedNames[0];
            preferredCode = returnedNames[0];
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