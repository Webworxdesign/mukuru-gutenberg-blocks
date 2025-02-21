jQuery(document).ready(function ($) {
	//Get receive methods
	function ajaxReceiveMethods(self,selectedCode = 'ZA',preferredCode) {
		ajaxLoader('.mukuru-calculator__switch', 'absolute', false, false)
		$.ajax({
			type: "POST",
			url: mukuru_obj.ajaxurl,
			data: {
				action: "calculator_product_callback",
				'in_code': selectedCode,
				'out_code': preferredCode,
		}})
		.done(function(response) {
			let returned = JSON.parse(response)
			let paymentMethods = returned?.items.map((product)=>{
				return `<li class="payout-method" data-calculator-type="${product.calculatorType}" data-type="${product.type}" data-payout-currency="${product.payOutCurrencyCode}" >${product.payoutName}</li>`;				
			})

			//Change payin label
			if($(paymentMethods[0]).data("calculator-type") === "you-send") {
				self.closest(".mukuru-calculator").find('.mukuru-calculator__send .mukuru-calculator__label').text('You send')
			} else {
				self.closest(".mukuru-calculator").find('.mukuru-calculator__send .mukuru-calculator__label').text('You pay')
			}

			$('.selected-out-option').html(`${paymentMethods[0]}<span class="dropdown-arrow"><icon><svg xmlns="http://www.w3.org/2000/svg" width="13px" height="9px" viewBox="0 0 13 9" fill="#fff"><path d="M11.713,0.633l-5.116,5.23L1.405,0.748L0.328,1.863l6.308,6.192l6.193-6.346L11.713,0.633z"></path></svg></icon></span>`)
			$('.currency-out-options').html(paymentMethods)	
			removeLoader('.mukuru-calculator__switch')	

			//Enable Calculator Inputs
			$('.mukuru-calculator').css('pointer-events','all')		
		})
	}

	//Select currency payout option
	$(document).on('click','.mukuru-calculator__currency .currency-out-options .payout-method', function() {
		const self = $(this)
		let selectedOptionCurrency = self.data('payout-currency')
		let selectedOptionText = self.text()		
		let payType = self.data('type')	
		let calculatorType = self.data('calculator-type')	
		
		self.closest('.mukuru-calculator').find('.mukuru-calculator__receive .currency_amount .text').text(selectedOptionCurrency)
		self.closest('.currency-options-wrapper').find('.selected-out-option li').attr('data-payout-currency',selectedOptionCurrency)
		self.closest('.currency-options-wrapper').find('.selected-out-option li').text(selectedOptionText)
		self.closest('.currency-options-wrapper').find('.selected-out-option li').attr("data-type",payType)
		self.closest('.currency-options-wrapper').find('.selected-out-option li').attr("data-calculator-type",calculatorType)
		self.closest('.mukuru-calculator').find('.mukuru-calculator__receive .currency_amount input[name="receive-amount"]').val('')

		//Clear messaging
		self.closest('.mukuru-calculator').find(".mukuru-calculator__send .charge-message").remove()
		self.closest('.mukuru-calculator').find(".mukuru-calculator__receive .payout-message").remove()

		//Reset pay in and out values
		if(calculatorType === "you-send") {
			self.closest(".mukuru-calculator").find('.mukuru-calculator__send .mukuru-calculator__label').text('You send')
		} else {
			self.closest(".mukuru-calculator").find('.mukuru-calculator__send .mukuru-calculator__label').text('You pay')
		}
		self.closest('.mukuru-calculator').find('.calculate-results').children().remove()

		//Trigger Calculate
		setTimeout(() => {
			if($('.calculator-wrapper .mukuru-calculator input').val() > 0) {
				$('a[href="#calculate"]').trigger('click')
			}
		}, 10);
	})
	
	

    if($(".mukuru-calculator").length){
		
		var dropdownOpen = false;
        $(document).on("click", ".selected_currency", function(e) {
            e.preventDefault();
            $(this).closest(".inputs-wrapper").find(".currency_amount").addClass('hidden');
            $(this).closest(".inputs-wrapper").find(".select_country").removeClass('hidden');
            var th = $(this);
            setTimeout(() => {
              th.closest(".inputs-wrapper").find('.country_search input')[0].focus();
            }, 100);
        });
        $(document).on("click", function(e) {
            if (dropdownOpen && !$(e.target).closest(".select_country").length) {
                $(".currency_amount").removeClass('hidden');
                $(".select_country").addClass('hidden');
                dropdownOpen = false;
            }
        });

        $(document).on("click", ".currency__option", function(e) {
			// ajaxLoader('.mukuru-calculator__switch', 'absolute', false, false);			
            e.preventDefault();
			let self = $(this)
            var currency = self.data('currency');
			let countryCode = self.data('code');
            self.closest(".inputs-wrapper").find(".selected").removeClass('selected');
            self.addClass('selected');
            self.closest(".inputs-wrapper").find(".currency_amount").removeClass('hidden');
            self.closest(".inputs-wrapper").find(".select_country").addClass('hidden');
            self.closest(".inputs-wrapper").find(".selected_currency").find(".text").text(currency);
			self.closest(".inputs-wrapper").find(".selected_currency").find(".hidden-currency").val(currency);
			self.closest(".inputs-wrapper").find(".selected_currency").find(".hidden-code").val(countryCode);
            self.closest(".inputs-wrapper").find(".selected_currency").find(".flag").removeClass().addClass('flag ' + countryCode);

			//Clear messaging
			self.closest('.mukuru-calculator').find(".mukuru-calculator__send .charge-message").remove()
			self.closest('.mukuru-calculator').find(".mukuru-calculator__receive .payout-message").remove()

			//Clear out values
			self.closest('.mukuru-calculator').find('.calculate-results').children().remove()

            dropdownOpen = false;			
        });

        $(document).on("focus click", 'input[name="country-search"], .country_search .dropdown-arrow', function(e) {
            $(this).closest(".select_country").addClass('searching');
            dropdownOpen = true;
        });
        $(document).on("blur", 'input[name="country-search"]', function(e) {
            $(this).closest(".select_country").removeClass('searching');
            $(this).val("");
            dropdownOpen = false;
        });

      $(document).on("keypress", ".currency_amount input", function(e) {
        var key = e.which;
        if (key == 8 || key == 0 || key == 46) {
            return true;
        }
        if (key < 48 || key > 57) {
            e.preventDefault();
        }

      });

      $(document).on("blur change", ".currency_amount input", function(e) {
        let value = Number($(this).val());
        // let rounded = (Math.round(value * 100) / 100);
        let rounded = value.toFixed();
        // rounded = rounded.toString().indexOf('.') > -1 ? rounded : rounded;
        // rounded = rounded.toString().indexOf('.') == rounded.toString().length - 2 ? rounded + '0' : rounded;
        $(this).val(rounded);
      });

      $(document).on("blur", ".currency_amount input", function(e) {
        $(this).closest(".mukuru-calculator").find(".currency_amount input[type='number']").not($(this)).val('');
      });

      $(document).on("keyup focus", "input[name='country-search']", function(e) {
        var search = $(this).val().toLowerCase();
        $(this).closest(".select_country").find(".currency__option").each(function() {
          var text = $(this).text().toLowerCase();
          if (text.indexOf(search) > -1) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      });

	  function valueFormatting(num) {
		num = String(num)
		let newNum = num
		let numLength = newNum.indexOf('.') > 0 ? num.length - 3 : num.length
		let index = newNum.indexOf('.') > 0 ? - 6 : -3

		//Set loop amount based off how many sets of 1000s are in the number
		let loopCount = Math.round(  numLength / 3 )		
		
		for (let i = 0; i < loopCount; i++) {
			//Add comma
			if(num.length >= 4) {
				newNum = [newNum.slice(0, index), ',', newNum.slice(index)].join('');
			}
			index -= 4
		}
		//Replace first instance of ',' if at index 0
		if(newNum.indexOf(',') == 0) {
			newNum = newNum.replace(',',' ')
		} 

		return newNum 

	  }

	  $('.mukuru-calculator').on("keypress", function(event) {
		if (event.key === "Enter") {
			event.preventDefault()
			$('a[href="#calculate"]').trigger('click')
		}
      });

      // click href=#calculate
      $(document).on("click", "a[href='#calculate']", function(e) {

        e.preventDefault();
		ajaxLoader('.mukuru-calculator__switch', 'absolute', false, false);
		let self = $(this)
		let payInAmount;
		let payingIn = true;
		let outCurrency = self.closest('.mukuru-calculator').find('.mukuru-calculator__currency .selected-out-option .payout-method').attr('data-payout-currency')
		let payInCurrency = self.closest('.mukuru-calculator').find(".mukuru-calculator__send .hidden-currency").val();
		let payInCode = self.closest('.mukuru-calculator').find(".mukuru-calculator__send .hidden-code").val();
		let payoutType = self.closest('.mukuru-calculator').find(".mukuru-calculator__currency .selected-out-option .payout-method").attr('data-type');
		let calculatorType = self.closest('.mukuru-calculator').find(".mukuru-calculator__currency .selected-out-option .payout-method").attr('data-calculator-type');
		let payoutName = self.closest('.mukuru-calculator').find(".mukuru-calculator__currency .selected-out-option .payout-method").text();

		self.closest('.mukuru-calculator').find(".mukuru-calculator__send .charge-message").remove()
		self.closest('.mukuru-calculator').find(".mukuru-calculator__receive .payout-message").remove()

		//Disable Calculator Inputs
		self.closest('.mukuru-calculator').css('pointer-events','none')

		if(self.closest('.mukuru-calculator').find(".mukuru-calculator__send input[name='send-amount']").val() > 0) {		
			payInAmount = self.closest('.mukuru-calculator').find(".mukuru-calculator__send input[name='send-amount']").val()
		} else {
			payInAmount = self.closest('.mukuru-calculator').find(".mukuru-calculator__receive input[name='receive-amount']").val()
			payingIn = false
		}
		let payOutCode = self.closest('.mukuru-calculator').find('.mukuru-calculator__receive .hidden-code').val();
		
		//  do wp ajax call
		$.ajax({
			type: "POST",
			url: mukuru_obj.ajaxurl,
			data: {
				action: "mukuru_get_calc",
				inCode: payInCode,
				inCurrency: payInCurrency,
				outCurrency: outCurrency,
				inAmount: payInAmount,
				OutCode: payOutCode,
				payingIn: payingIn,
				payOutType: payoutType
			},
			success: function (response) {	
				let data = JSON.parse(response);
				removeLoader('.mukuru-calculator__switch');
				let tableMarkup
				data['items'].forEach(method => {
					if(method.payOutCurrencyCode === outCurrency && method.payoutName === payoutName && method.calculatorType === 'you-send') {
						if(method.calculatorType === calculatorType && method.type === payoutType) {
							self.closest('.mukuru-calculator').find("input[name='send-amount']").val(method.payInAmountSubTotal);
							self.closest('.mukuru-calculator').find("input[name='receive-amount']").val(method.payOutAmountSubTotal);
							self.closest('.mukuru-calculator').find(".mukuru-calculator__send").append(`<p class="charge-message" >${method.payInAmountMessage}</p>`);
							self.closest('.mukuru-calculator').find(".mukuru-calculator__receive").append(`<p class="payout-message" >${method.payOutAmountMessage}</p>`);
							
							tableMarkup = `<div class="uk-table-wrapper mb-2">
							<p>Send <span>${method.payInCurrencyCode} ${valueFormatting(method.payInAmountSubTotal)}</span></p>
							<p>Charge <span>${method.payInCurrencyCode} ${valueFormatting(method.fee.amount)}</span></p>
							<strong>
							<p>Total to pay <span>${method.payInCurrencyCode} ${valueFormatting(method.payInAmount)}</span></p>
							<p>They receive <span>${method.payOutCurrencyCode} ${valueFormatting(method.payOutAmount)}</span></p>
							</strong>
							${method.uspMessage}
							</div>
							<div class="mb-1" >															
							<p class="exchange-rate" >
								1.00 ${ method['rate']['inverted'] ? method['rate']['payOutCurrencyCode'] : method['rate']['payInCurrencyCode'] }
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
									<g id="Group_1" data-name="Group 1" transform="translate(-383 -163.75)">
									<circle id="Ellipse_1" data-name="Ellipse 1" cx="10" cy="10" r="10" transform="translate(383 163.75)" fill="#f05423"/>
									<g id="exchange-rates" transform="translate(398.418 168.178) rotate(90)">
										<path id="Path_1" data-name="Path 1" d="M2.652.223,0,2.875,1.041,3.916,2.412,2.545,2.348,9.376l1.487-.014L3.9,2.531,5.245,3.877,6.306,2.816,3.7.213A.729.729,0,0,0,3.18,0,.758.758,0,0,0,2.652.223Z" transform="translate(0 0)" fill="#fff"/>
										<path id="Path_2" data-name="Path 2" d="M2.407,6.845,1.061,5.5,0,6.561l2.6,2.6a.729.729,0,0,0,.523.213.757.757,0,0,0,.528-.223L6.306,6.5,5.265,5.46,3.894,6.831,3.958,0,2.47.014Z" transform="translate(5.35 0.471)" fill="#fff"/>
									</g>
									</g>
								</svg> 
								${parseFloat(method['rate']['rate']).toFixed(4)} ${ method['rate']['inverted'] ? method['rate']['payInCurrencyCode'] : method['rate']['payOutCurrencyCode']  } </p>
							</div>`
	
							self.closest('.mukuru-calculator').find(".calculate-results").html(tableMarkup);						
						}

					} else {
						if(method['rate']['payOutCurrencyCode'] === outCurrency && method.payoutName === payoutName && method.calculatorType === calculatorType && method.type === payoutType) {
							//Main calculator payout field
							self.closest('.mukuru-calculator').find("input[name='send-amount']").val(method.payInAmount);
							self.closest('.mukuru-calculator').find("input[name='receive-amount']").val(method.payOutAmount);
							self.closest('.mukuru-calculator').find(".mukuru-calculator__send").append(`<p class="charge-message" >${method.payInAmountMessage}</p>`);
							self.closest('.mukuru-calculator').find(".mukuru-calculator__receive").append(`<p class="payout-message" >${method.payOutAmountMessage}</p>`);
							self.closest('.mukuru-calculator').find(".calculate-results").text(method['payOutAmountMessage']); 	
	
							//Rates information
							self.closest('.mukuru-calculator').find(".calculate-results").html(
								`<div><p>Exchange rate</p>		
								<p class="exchange-rate" > 1.00 ${ method['rate']['inverted'] ? method['rate']['payOutCurrencyCode'] : method['rate']['payInCurrencyCode'] } 
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
									<g id="Group_1" data-name="Group 1" transform="translate(-383 -163.75)">
									<circle id="Ellipse_1" data-name="Ellipse 1" cx="10" cy="10" r="10" transform="translate(383 163.75)" fill="#f05423"/>
									<g id="exchange-rates" transform="translate(398.418 168.178) rotate(90)">
										<path id="Path_1" data-name="Path 1" d="M2.652.223,0,2.875,1.041,3.916,2.412,2.545,2.348,9.376l1.487-.014L3.9,2.531,5.245,3.877,6.306,2.816,3.7.213A.729.729,0,0,0,3.18,0,.758.758,0,0,0,2.652.223Z" transform="translate(0 0)" fill="#fff"/>
										<path id="Path_2" data-name="Path 2" d="M2.407,6.845,1.061,5.5,0,6.561l2.6,2.6a.729.729,0,0,0,.523.213.757.757,0,0,0,.528-.223L6.306,6.5,5.265,5.46,3.894,6.831,3.958,0,2.47.014Z" transform="translate(5.35 0.471)" fill="#fff"/>
									</g>
									</g>
								</svg> 
								${parseFloat(method['rate']['rate']).toFixed(4)} ${ method['rate']['inverted'] ? method['rate']['payInCurrencyCode'] : method['rate']['payOutCurrencyCode']  } </p><p class="usp-message" >${method.uspMessage}</p></div>`
							);							

						}
					}
				})		
				//Enable Calculator Inputs
				self.closest('.mukuru-calculator').css('pointer-events','all')					
			},
			error: function(error) {
				$(".mukuru-calculator").find(".calculate-results").text('');
				//Enable Calculator Inputs
				self.closest('.mukuru-calculator').css('pointer-events','all')					
			}
		});

      });
    } 

	//Calculator select out currency
	$(document).on('click','.mukuru-calculator__currency .selected-out-option .payout-method, .mukuru-calculator__currency.active .payout-method', function() {
		$(this).closest('.mukuru-calculator__currency').toggleClass('active')
	})
	
	

	
	
	//Clear payin value if the country changes
    $(document).on('click', '.mukuru-calculator__send .currency__option', function() {
		$(this).closest('.inputs-wrapper').find('.currency_amount > input').val('')    
		$(this).closest('.mukuru-calculator').find('.mukuru-calculator__receive .currency_amount > input').val('')
	});
	
    $(document).on('click', '.mukuru-calculator__receive .currency__option', function() {
		//update receive methods
		const self = $(this)
		let selectedCode = self.closest('.mukuru-calculator').find('.mukuru-calculator__send').find('.hidden-code').val();
		let preferredCode = self.closest('.mukuru-calculator').find('.mukuru-calculator__receive').find('.hidden-code').val();
		
		//Disable Calculator Inputs
		self.closest('.mukuru-calculator').css('pointer-events','none')
		
		$(this).closest('.mukuru-calculator').attr('data-preferred-out',preferredCode)
		self.closest('.inputs-wrapper').find('.currency_amount > input').val('')
		ajaxReceiveMethods(self,selectedCode,preferredCode)       
	});

    $(document).on('click', '.mukuru-calculator__send .currency__option', function() {
		
        let self = $(this);

		//Disable Calculator Inputs
		self.closest('.mukuru-calculator').css('pointer-events','none')

        payout_countries_ajax(self);
       
	});

    function payout_countries_ajax(self) {
	
        let selectedID = self.attr('data-id');
        let selectedChannel = self.attr('data-channel');
        let selectedCode = self.attr('data-code');
		let payIn, payOut	
        let preferredCode = self.closest('.mukuru-calculator').attr('data-preferred-out');
        ajaxLoader('.mukuru-calculator__switch', 'absolute', false, false);
		
        $.ajax({
		type: "POST",
		url: mukuru_obj.ajaxurl,
		data: {
			action: "calculator_callback",
			'selected_id': selectedID,
			'selected_channel': selectedChannel,
			'selected_code': selectedCode,
			'payout_countries_ajax': true
		}})
		.done(function(response) {	
			let selfSuccess = self
			let newList = '';
			let returned = JSON.parse(response);
			let returnedNames = Object.keys(returned);
			returnedNames.sort();
			let hiddenCurrency = '';
			let hiddenCode = '';
			let flagCode = '';	
			let selectedCode = selfSuccess.closest('.mukuru-calculator').find('.mukuru-calculator__send').find('.hidden-code').val();
			
			returnedNames.forEach(item => {
				if( returned[item]['payInCountryCode'] == preferredCode && preferredCode != selectedCode ) {    
					payIn = returned[item]['payInCountryCode']
					payOut = selectedCode
					hiddenCurrency = returned[item]['payOutCurrencyCode'];
					hiddenCode = returned[item]['payOutCountryCode'];
					flagCode = returned[item]['payInCountryCode'];					        
				} 
				
				newList += (`<span class="currency__option ${ returned[item]['payInCountryCode'] } ${ returned[item]['payOutCurrencyCode'] }" data-currency="${ returned[item]['payOutCurrencyCode'] }" data-code="${ returned[item]['payInCountryCode'] }"><span class="flag select ${ returned[item]['payInCountryCode'] }" data-os-flag=""></span>${ item }</span>`);			
			});
			if(hiddenCurrency === '') {
				payIn = returned[returnedNames[0]]['payInCountryCode']
				payOut = selectedCode
				hiddenCurrency = returned[returnedNames[0]]['payOutCurrencyCode'];
				hiddenCode = returned[returnedNames[0]]['payOutCountryCode'];
				flagCode = returned[returnedNames[0]]['payInCountryCode'];	
				preferredCode = returned[returnedNames[0]]['payOutCountryCode'];
			}
			
			//Order options alphabetically
			selfSuccess.closest('.mukuru-calculator').find('.mukuru-calculator__receive .selected_currency .hidden-currency').val( hiddenCurrency );
			selfSuccess.closest('.mukuru-calculator').find('.mukuru-calculator__receive .selected_currency .hidden-code').val( hiddenCode );
			selfSuccess.closest('.mukuru-calculator').find('.mukuru-calculator__receive .selected_currency .text').text( hiddenCurrency );
			selfSuccess.closest('.mukuru-calculator').find('.mukuru-calculator__receive .selected_currency .flag').removeClass().addClass( `flag ${ flagCode }` );  

			selfSuccess.closest('.mukuru-calculator').find('.mukuru-calculator__receive .currency_dropdown').html(newList);
			
			ajaxReceiveMethods(selfSuccess,selectedCode,preferredCode)
			removeLoader('.mukuru-calculator__switch')

			//Enable Calculator Inputs
			self.closest('.mukuru-calculator').css('pointer-events','all')
			
        })

    }

	//Order payout list on page load
	if( $('.mukuru-calculator .mukuru-calculator__receive .currency_dropdown > span').length > 0 ) {
		var categoryItemsArray = $(".mukuru-calculator .mukuru-calculator__receive .currency_dropdown").get()
		let htmlToArray = Array.from(categoryItemsArray[0].children)
		let sorted = htmlToArray.sort(sorter);
		function sorter(a,b) {
			return $(a).text().localeCompare($(b).text()); // sorts based on alphabetical order
		}
		$('.mukuru-calculator .mukuru-calculator__receive .currency_dropdown').html(sorted)
	}
});