import { getElement, store, getContext } from '@wordpress/interactivity';
import ajaxLoader from './helpers/ajax-loader';
import removeLoader from './helpers/remove-loader';
import valueFormatting from './helpers/value-formatting';
import payoutCountriesAjax from './helpers/payout-countries-ajax';
import ajaxReceiveMethods from './helpers/ajax-receive-methods';

store('calculator', {
    actions: {
        doCalculation: async (e) => {
            e.preventDefault();
            console.log('doCalculation');

            const context = getContext();
            const self = getElement(context).ref;

            if (context.isCalculating) return;
            context.isCalculating = true;

            ajaxLoader('.mukuru-calculator__switch', 'absolute', false, false);

            const calculator = self.closest('.mukuru-calculator');
            const getValue = (selector) => calculator.querySelector(selector).value;
            const getAttribute = (selector, attr) => calculator.querySelector(selector).getAttribute(attr);
            const getTextContent = (selector) => calculator.querySelector(selector).textContent;

            let payInAmount;
            let payingIn = true;
            const outCurrency = getAttribute('.mukuru-calculator__currency .selected-out-option .payout-method', 'data-payout-currency');
            const payInCurrency = getValue(".mukuru-calculator__send .hidden-currency");
            const payInCode = getValue(".mukuru-calculator__send .hidden-code");
            const payoutType = getAttribute(".mukuru-calculator__currency .selected-out-option .payout-method", 'data-type');
            const calculatorType = getAttribute(".mukuru-calculator__currency .selected-out-option .payout-method", 'data-calculator-type');
            const payoutName = getTextContent(".mukuru-calculator__currency .selected-out-option .payout-method");

            calculator.querySelectorAll(".mukuru-calculator__send .charge-message, .mukuru-calculator__receive .payout-message").forEach(el => el.remove());
            calculator.style.pointerEvents = 'none';

            if (getValue(".mukuru-calculator__send input[name='send-amount']") > 0) {
                payInAmount = getValue(".mukuru-calculator__send input[name='send-amount']");
            } else {
                payInAmount = getValue(".mukuru-calculator__receive input[name='receive-amount']");
                payingIn = false;
            }

            const payOutCode = getValue('.mukuru-calculator__receive .hidden-code');

            console.log({ payInCode, payInCurrency, outCurrency, payInAmount, payOutCode, payingIn, payoutType });

            try {
                const response = await fetch('/wp-admin/admin-ajax.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        action: "mukuru_get_calc",
                        inCode: payInCode,
                        inCurrency: payInCurrency,
                        outCurrency: outCurrency,
                        inAmount: payInAmount,
                        OutCode: payOutCode,
                        payingIn: payingIn,
                        payOutType: payoutType
                    })
                });

                const data = await response.json();
                let tableMarkup = '';

                data['items'].forEach(method => {
                    if (method.payOutCurrencyCode === outCurrency && method.payoutName.trim() === payoutName.trim() && method.calculatorType === 'you-send') {
                        if (method.calculatorType === calculatorType && method.type === payoutType) {
                            calculator.querySelector("input[name='send-amount']").value = method.payInAmountSubTotal;
                            calculator.querySelector("input[name='receive-amount']").value = method.payOutAmountSubTotal;
                            calculator.querySelector(".mukuru-calculator__send").insertAdjacentHTML('beforeend', `<p class="charge-message">${method.payInAmountMessage}</p>`);
                            calculator.querySelector(".mukuru-calculator__receive").insertAdjacentHTML('beforeend', `<p class="payout-message">${method.payOutAmountMessage}</p>`);

                            tableMarkup = `<div class="uk-table-wrapper mb-2">
                                <p>Send <span>${method.payInCurrencyCode} ${valueFormatting(method.payInAmountSubTotal)}</span></p>
                                <p>Charge <span>${method.payInCurrencyCode} ${valueFormatting(method.fee.amount)}</span></p>
                                <strong>
                                <p>Total to pay <span>${method.payInCurrencyCode} ${valueFormatting(method.payInAmount)}</span></p>
                                <p>They receive <span>${method.payOutCurrencyCode} ${valueFormatting(method.payOutAmount)}</span></p>
                                </strong>
                                ${method.uspMessage}
                                </div>
                                <div class="mb-1">
                                <p class="exchange-rate">
                                    1.00 ${method['rate']['inverted'] ? method['rate']['payOutCurrencyCode'] : method['rate']['payInCurrencyCode']}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                        <g id="Group_1" data-name="Group 1" transform="translate(-383 -163.75)">
                                        <circle id="Ellipse_1" data-name="Ellipse 1" cx="10" cy="10" r="10" transform="translate(383 163.75)" fill="#f05423"/>
                                        <g id="exchange-rates" transform="translate(398.418 168.178) rotate(90)">
                                            <path id="Path_1" data-name="Path 1" d="M2.652.223,0,2.875,1.041,3.916,2.412,2.545,2.348,9.376l1.487-.014L3.9,2.531,5.245,3.877,6.306,2.816,3.7.213A.729.729,0,0,0,3.18,0,.758.758,0,0,0,2.652.223Z" transform="translate(0 0)" fill="#fff"/>
                                            <path id="Path_2" data-name="Path 2" d="M2.407,6.845,1.061,5.5,0,6.561l2.6,2.6a.729.729,0,0,0,.523.213.757.757,0,0,0,.528-.223L6.306,6.5,5.265,5.46,3.894,6.831,3.958,0,2.47.014Z" transform="translate(5.35 0.471)" fill="#fff"/>
                                        </g>
                                        </g>
                                    </svg>
                                    ${parseFloat(method['rate']['rate']).toFixed(4)} ${method['rate']['inverted'] ? method['rate']['payInCurrencyCode'] : method['rate']['payOutCurrencyCode']}
                                </p>
                                </div>`;
                        }
                    } else {
                        if (method['rate']['payOutCurrencyCode'] === outCurrency && method.payoutName.trim() === payoutName.trim() && method.calculatorType === calculatorType && method.type === payoutType) {
                            calculator.querySelector("input[name='send-amount']").value = method.payInAmount;
                            calculator.querySelector("input[name='receive-amount']").value = method.payOutAmount;
                            calculator.querySelector(".mukuru-calculator__send").insertAdjacentHTML('beforeend', `<p class="charge-message">${method.payInAmountMessage}</p>`);
                            calculator.querySelector(".mukuru-calculator__receive").insertAdjacentHTML('beforeend', `<p class="payout-message">${method.payOutAmountMessage}</p>`);
                            calculator.querySelector(".calculate-results").textContent = method['payOutAmountMessage'];

                            calculator.querySelector(".calculate-results").innerHTML = `
                                <div><p>Exchange rate</p>
                                <p class="exchange-rate"> 1.00 ${method['rate']['inverted'] ? method['rate']['payOutCurrencyCode'] : method['rate']['payInCurrencyCode']}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                    <g id="Group_1" data-name="Group 1" transform="translate(-383 -163.75)">
                                    <circle id="Ellipse_1" data-name="Ellipse 1" cx="10" cy="10" r="10" transform="translate(383 163.75)" fill="#f05423"/>
                                    <g id="exchange-rates" transform="translate(398.418 168.178) rotate(90)">
                                        <path id="Path_1" data-name="Path 1" d="M2.652.223,0,2.875,1.041,3.916,2.412,2.545,2.348,9.376l1.487-.014L3.9,2.531,5.245,3.877,6.306,2.816,3.7.213A.729.729,0,0,0,3.18,0,.758.758,0,0,0,2.652.223Z" transform="translate(0 0)" fill="#fff"/>
                                        <path id="Path_2" data-name="Path 2" d="M2.407,6.845,1.061,5.5,0,6.561l2.6,2.6a.729.729,0,0,0,.523.213.757.757,0,0,0,.528-.223L6.306,6.5,5.265,5.46,3.894,6.831,3.958,0,2.47.014Z" transform="translate(5.35 0.471)" fill="#fff"/>
                                    </g>
                                    </g>
                                </svg>
                                ${parseFloat(method['rate']['rate']).toFixed(4)} ${method['rate']['inverted'] ? method['rate']['payInCurrencyCode'] : method['rate']['payOutCurrencyCode']}
                                </p><p class="usp-message">${method.uspMessage}</p></div>`;
                        }
                    }
                });

                calculator.querySelector(".calculate-results").innerHTML = tableMarkup;
                calculator.style.pointerEvents = 'all';
                removeLoader('.mukuru-calculator__switch');
            } catch (error) {
                calculator.querySelector(".calculate-results").textContent = '';
                calculator.style.pointerEvents = 'all';
                removeLoader('.mukuru-calculator__switch');
            }

            context.isCalculating = false;
            console.log('***********');
        }, 
        currencyOption: (e) => {

            e.preventDefault();
            const context = getContext();
            const self = getElement(context).ref;            

            let currency = self.getAttribute('data-currency');
            let countryCode = self.getAttribute('data-code');
            self.closest(".inputs-wrapper").querySelectorAll(".selected").forEach(el => el.classList.remove('selected'));
            self.classList.add('selected');
            self.closest(".inputs-wrapper").querySelector(".currency_amount").classList.remove('hidden');
            self.closest(".inputs-wrapper").querySelector(".select_country").classList.add('hidden');
            self.closest(".inputs-wrapper").querySelector(".selected_currency .text").textContent = currency;
            self.closest(".inputs-wrapper").querySelector(".selected_currency .hidden-currency").value = currency;
            self.closest(".inputs-wrapper").querySelector(".selected_currency .hidden-code").value = countryCode;
            self.closest(".inputs-wrapper").querySelector(".selected_currency .flag").className = 'flag ' + countryCode;

            // Clear messaging
            self.closest('.mukuru-calculator').querySelectorAll(".mukuru-calculator__send .charge-message").forEach(el => el.remove());
            self.closest('.mukuru-calculator').querySelectorAll(".mukuru-calculator__receive .payout-message").forEach(el => el.remove());

            // Clear out values
            self.closest('.mukuru-calculator').querySelector('.calculate-results').innerHTML = '';

            context.dropdownOpen = false;            
        }, 
        currencyOptionReceive: () => {
            const context = getContext();
            const self = getElement(context).ref;            

            // Update receive methods
            let selectedCode = self.closest('.mukuru-calculator').querySelector('.mukuru-calculator__send .hidden-code').value;
            let preferredCode = self.closest('.mukuru-calculator').querySelector('.mukuru-calculator__receive .hidden-code').value;

            // Disable Calculator Inputs
            self.closest('.mukuru-calculator').style.pointerEvents = 'none';

            self.closest('.mukuru-calculator').setAttribute('data-preferred-out', preferredCode);
            self.closest('.inputs-wrapper').querySelector('.currency_amount > input').value = '';

            ajaxReceiveMethods(self,selectedCode,preferredCode) 
        },
        currencyOptionSend: () => {
            const context = getContext();
            const self = getElement(context).ref;  
            //Clear payin value if the country changes 
            self.closest('.inputs-wrapper').querySelector('.currency_amount > input').value = '';
            self.closest('.mukuru-calculator').querySelector('.mukuru-calculator__receive .currency_amount > input').value = '';

            //Disable Calculator Inputs
            self.closest('.mukuru-calculator').style.pointerEvents = 'none';

            payoutCountriesAjax(self);

        },
        searchingCountryFocus: () => {
            
            const context = getContext();
            const self = getElement(context).ref;            

            self.closest('.select_country').classList.add('searching');

            context.dropdownOpen = true;

            let search = self.value.toLowerCase();
            self.closest(".select_country").querySelectorAll(".currency__option").forEach(option => {
                let text = option.textContent.toLowerCase();
                if (text.indexOf(search) > -1) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            });
        }, 
        searchingCountryBlur: () => {
            const context = getContext();
            const self = getElement(context).ref;
            self.closest('.select_country').classList.remove('searching');
            self.value = '';
        }, 
        searchingCountryKeyup: () => {

            const context = getContext();
            const self = getElement(context).ref;    
            
            let search = self.value.toLowerCase();
            self.closest(".select_country").querySelectorAll(".currency__option").forEach(option => {
                let text = option.textContent.toLowerCase();
                if (text.indexOf(search) > -1) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            });
        }, 
        payoutMethods: () => {
            const context = getContext();
            const self = getElement(context).ref;            
            self.closest('.mukuru-calculator__currency').classList.toggle('active');
        }, 
        selectPayoutMethod: () => {
            const context = getContext();
            const self = getElement(context).ref;

            let selectedOptionCurrency = self.getAttribute('data-payout-currency');
            let selectedOptionText = self.textContent;
            let payType = self.getAttribute('data-type');
            let calculatorType = self.getAttribute('data-calculator-type');
            
            self.closest('.mukuru-calculator').querySelector('.mukuru-calculator__receive .currency_amount .text').textContent = selectedOptionCurrency;
            self.closest('.currency-options-wrapper').querySelector('.selected-out-option li').setAttribute('data-payout-currency', selectedOptionCurrency);
            self.closest('.currency-options-wrapper').querySelector('.selected-out-option li').textContent = selectedOptionText;
            self.closest('.currency-options-wrapper').querySelector('.selected-out-option li').setAttribute('data-type', payType);
            self.closest('.currency-options-wrapper').querySelector('.selected-out-option li').setAttribute('data-calculator-type', calculatorType);
            self.closest('.mukuru-calculator').querySelector('.mukuru-calculator__receive .currency_amount input[name="receive-amount"]').value = '';
    
            // Clear messaging
            self.closest('.mukuru-calculator').querySelectorAll(".mukuru-calculator__send .charge-message").forEach(el => el.remove());
            self.closest('.mukuru-calculator').querySelectorAll(".mukuru-calculator__receive .payout-message").forEach(el => el.remove());
    
            // Reset pay in and out values
            if (calculatorType === "you-send") {
                self.closest(".mukuru-calculator").querySelector('.mukuru-calculator__send .mukuru-calculator__label').textContent = 'You send';
            } else {
                self.closest(".mukuru-calculator").querySelector('.mukuru-calculator__send .mukuru-calculator__label').textContent = 'You pay';
            }
            self.closest('.mukuru-calculator').querySelector('.calculate-results').innerHTML = '';
    
            // Trigger Calculate
            setTimeout(() => {
                if (document.querySelector('.calculator-wrapper .mukuru-calculator input').value > 0) {
                    document.querySelector('a[href="#calculate"]').click();
                }
            }, 10);
        }
    },
    callbacks: {
        initCalculator: () => {
            console.log('initCalculator');
        },
        logClick(event) {
            const context = getContext();

            if (context.dropdownOpen && !event.target.closest('.select_country')) {
                document.querySelector('.currency_amount').classList.remove('hidden');
                document.querySelector('.select_country').classList.add('hidden');
                context.dropdownOpen = false;
            }
        },
        selectCurrency: () => {
            const context = getContext();
            const self = getElement(context).ref;

            self.closest('.inputs-wrapper').querySelector('.currency_amount').classList.add('hidden');
            self.closest('.inputs-wrapper').querySelector('.select_country').classList.remove('hidden');
            setTimeout(() => {
                self.closest('.inputs-wrapper').querySelector('.country_search input').focus();
            }, 100);
        },
        allowedKeys: (event) => {
            const context = getContext();
            const self = getElement(context).ref;

            let key = event.which;
            if (key == 8 || key == 0 || key == 46) {
                return true;
            }
            if (key < 48 || key > 57) {
                event.preventDefault();
            }

            let value = Number(self.value);
            let rounded = value.toFixed();
            self.value = rounded;

            self.closest(".mukuru-calculator").querySelectorAll(".currency_amount input[type='number']").forEach(input => {
                if (input !== self) {
                    input.value = '';
                }
            });
        }
    }
});