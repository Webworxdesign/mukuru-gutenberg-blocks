<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Generate unique id for aria-controls.
$unique_id = wp_unique_id( 'p-' );

$wrapper_attributes = get_block_wrapper_attributes();

//Get selected pay_in country
$pay_in_fields = [];
$current_lang_default = apply_filters( 'wpml_current_language', NULL );

//Default country
if($current_lang_default === 'en' || $current_lang_default === 'sa') {
    $default_country = 'ZA';
} elseif($current_lang_default === 'en-uk') {
    $default_country = 'GB';
} else {
    $default_country = strtoupper(apply_filters( 'wpml_current_language', NULL ));
}
//Get all send options
$s_field = $attributes['sendOptions']['fields'][0]['choices'];

//Get currency by comparing default lang to $s_field options
if(!empty($s_field)) {
    foreach ($s_field as $key => $country) {
        $exploded_key = explode(',',$key);
        if( $exploded_key[0] === $default_country ) {
            $pay_in_fields = [
                $default_country,
                $exploded_key[1]
            ];
        }
    }
}

//Get selected pay_out country
$pay_out_fields = $attributes['payOutCountries'];

//Get the pay_in Country code
$pay_in_currency = $pay_in_fields;

//Get the pay_out Country code
$pay_out_currency = (explode(',',strtoupper($pay_out_fields)));

$className = "";
$currency = $pay_in_currency[1];
$currency2 = $pay_out_currency[1];

//Create array of currency => Country Name
$sendCurrencies = array();
foreach ($s_field as $key => $s_choice) {   
    $current_currency = explode(',', $key);
    $sendCurrencies[strtoupper($current_currency[0])] = array(
        $s_choice => $current_currency[1],
        'id' => $current_currency[2],
        'channel'=> $current_currency[3]
    );
}

$payout_countries_get = $attributes['payOutCountriesJSON'];
$receive_countries = $payout_countries_get[$pay_in_currency[0]];   

$out_currency = $receive_countries['items'][0]['baseCurrencyCode'];
$out_code = $receive_countries['items'][0]['code'];
$out_name = $receive_countries['items'][0]['code'];
foreach( $receive_countries['items'] as $key => $country) {
    if( $country['code'] === $pay_out_currency[0] ) {
        $out_currency = $country['baseCurrencyCode'];
        $out_code = $country['code'];
        $out_name = $country['code'];
        break;
    }
}

?>

<div 
    <?php echo $wrapper_attributes; ?>
    data-wp-interactive="check-rates" >
    <div class="calculator-wrapper">
        <div class="mukuru-calculator <?php echo $className; ?>" data-preferred-out="<?= $pay_out_currency[0]; ?>" >
            <div class="calculator-header">
                <div class="calculator-icon">
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.53769 18.2484C10.5391 16.5923 11.6638 15.014 12.9024 13.5269C14.494 11.6199 16.2617 9.86687 18.1819 8.29114C18.0657 7.90197 18.0473 7.49011 18.1284 7.09213C18.2095 6.69415 18.3876 6.32235 18.6469 6.00973L18.729 5.93313C17.3388 4.03235 15.7606 2.27641 14.0185 0.691895C10.7288 1.20394 7.68264 2.7347 5.30859 5.06871C5.76816 10.2188 6.8496 14.5846 8.55291 18.1663C8.88331 18.125 9.2187 18.1529 9.53769 18.2484Z" fill="#F05423"/>
                        <path d="M22.5195 9.04066C23.6676 11.2608 24.5526 13.6073 25.1566 16.0326C25.7709 16.0057 26.3746 16.1998 26.858 16.5797C27.8074 16.0529 28.7212 15.4644 29.5936 14.8181C30.4615 14.1651 31.2858 13.456 32.061 12.6953C31.2856 9.51 29.5425 6.6431 27.0714 4.48877C25.6423 5.20624 24.2542 6.00259 22.9134 6.87413C23.0213 7.24096 23.0419 7.62793 22.9735 8.00412C22.9051 8.38031 22.7496 8.73529 22.5195 9.04066Z" fill="#F05423"/>
                        <path d="M9.51053 22.9316C9.29011 22.9954 9.06158 23.0267 8.83213 23.0246C7.95633 24.9987 7.24808 27.043 6.71484 29.1358C9.00809 30.9103 11.7407 32.028 14.6202 32.3691C17.4997 32.7103 20.4178 32.2621 23.0623 31.0725C19.8507 30.5947 16.7942 29.3773 14.1335 27.5164C12.3584 26.2439 10.7977 24.6962 9.51053 22.9316Z" fill="#F05423"/>
                        <path d="M22.6471 18.4674C22.676 17.9136 22.8833 17.3839 23.238 16.9574C23.3595 16.8111 23.4971 16.679 23.6483 16.5635C23.0956 14.2706 22.2709 12.0519 21.1918 9.95454C20.8487 10.0477 20.4895 10.0652 20.139 10.0057C19.7885 9.94613 19.4551 9.81108 19.1621 9.60986C15.8507 12.3044 13.03 15.5509 10.8242 19.206C11.0289 19.502 11.1636 19.8406 11.2181 20.1963C15.0989 20.2826 18.9655 19.6977 22.6471 18.4674Z" fill="#F05423"/>
                        <path d="M7.23069 22.4884C6.91335 22.2295 6.66678 21.8945 6.51399 21.5145C4.62102 21.3066 2.78275 21.0002 1.04297 20.6392C1.78361 23.431 3.27236 25.9678 5.34866 27.9758C5.87339 26.1194 6.52787 24.3022 7.30729 22.5376L7.23069 22.4884Z" fill="#F05423"/>
                        <path d="M6.91834 19.0199C6.96848 18.9644 7.02144 18.9114 7.077 18.8613C5.33835 15.021 4.24056 10.9218 3.82722 6.72656C2.50799 8.43395 1.54817 10.3908 1.00563 12.4792C0.463094 14.5675 0.349071 16.7441 0.670439 18.8777C2.58219 19.3026 4.51407 19.6313 6.45878 19.8625C6.55482 19.554 6.71101 19.2677 6.91834 19.0199Z" fill="#F05423"/>
                        <path d="M27.7454 18.0076C27.8475 18.4049 27.8542 18.8207 27.7648 19.221C27.6754 19.6213 27.4925 19.9948 27.2311 20.3109C26.9072 20.6947 26.48 20.9777 26.0001 21.1261C26.2514 23.9516 26.1595 26.7972 25.7266 29.6007C28.0751 27.9382 29.9327 25.6741 31.1043 23.046C32.2758 20.4179 32.7182 17.5228 32.3848 14.6648C31.8377 15.1517 31.2578 15.6386 30.6341 16.1091C29.7135 16.8042 28.7486 17.4383 27.7454 18.0076Z" fill="#F05423"/>
                        <path d="M25.6227 3.36176C22.8591 1.42858 19.5515 0.426318 16.1797 0.500413C17.6323 1.9383 18.9593 3.49775 20.1462 5.16172C20.759 5.0607 21.3873 5.1977 21.9024 5.54469C23.1826 4.7131 24.43 3.98545 25.6227 3.36176Z" fill="#F05423"/>
                        <path d="M23.574 20.612C23.3853 20.455 23.2212 20.2706 23.0871 20.0649C19.1735 21.3438 15.0678 21.9343 10.9524 21.8102C10.9141 21.8704 10.8703 21.9251 10.832 21.9798C12.0124 23.6068 13.4435 25.0361 15.0721 26.2144C17.7493 28.0732 20.8486 29.2336 24.0883 29.59C24.5628 26.7763 24.6695 23.9128 24.4056 21.0716C24.1016 20.9731 23.8192 20.8171 23.574 20.612Z" fill="#F05423"/>
                    </svg>
                </div>
                <h3>Check Rates</h3>
            </div>
            <div class="mukuru-calculator__send">
                <div class="mukuru-calculator__label">
                    You pay
                </div>
                <div class="inputs-wrapper">
                    <div class="currency_amount">
                        <input type="number" lang="en" name="send-amount" placeholder="Enter amount" >
                        <div class="selected_currency">
                            <input class="hidden-currency" type="hidden" name="send-currency" value="<?= $pay_in_currency[1]; ?>">
                            <input class="hidden-code" type="hidden" name="send-code" value="<?= $pay_in_currency[0]; ?>">
                            <span class="calculator-pipe"></span>
                            <span class="text">
                                <?php if (array_key_exists(1, $pay_in_currency)) {echo $pay_in_currency[1];}; ?>
                            </span>
                            <span class="calculator-pipe"></span>
                            <span class="flag <?php echo $pay_in_currency[0]; ?>"></span>
                            <span class="dropdown-arrow">
                                <icon>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13px" height="9px" viewBox="0 0 13 9" fill="none">
                                        <path d="M11.713,0.633l-5.116,5.23L1.405,0.748L0.328,1.863l6.308,6.192l6.193-6.346L11.713,0.633z"/>
                                    </svg>
                                </icon>
                            </span>
                        </div>
                    </div>
                    <div class="select_country hidden">
                        <div class="country_search">
                            <input type="text" name="country-search" placeholder="Search Country">
                            <span class="dropdown-arrow">
                                <icon></icon>
                            </span>
                        </div>
                        <div class="currency_dropdown">
                            <?php foreach($sendCurrencies as $key => $value): ?>
                                <span class="currency__option <?php echo $key.' '.$value[array_key_first($value)]; ?>
                                <?php echo ($key == $pay_in_currency[1]) ? " selected" : "" ?>" data-id="<?= $value['id']; ?>" data-channel="<?= $value['channel']; ?>" data-currency="<?php echo $value[array_key_first($value)]; ?>" data-code="<?= $key; ?>">

                                    <span class="flag select <?= $key; ?>" data-os-flag="<?= $key; ?>"></span>
                                    <?php echo array_key_first($value); ?>
                                </span>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mukuru-calculator__switch">
                <svg width="40" height="41" viewBox="0 0 47 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.3496 16.2004L14.0101 20.5399L15.7137 22.2435L17.9572 20L17.8526 31.178L20.286 31.1552L20.3906 19.9772L22.5925 22.1791L24.3283 20.4433L20.0693 16.1843C19.8434 15.9584 19.5353 15.8332 19.2128 15.8362C18.8903 15.8392 18.5798 15.9703 18.3496 16.2004Z" fill="currentColor"/>
                    <path d="M26.7017 27.807L24.4998 25.6051L22.764 27.3409L27.023 31.5999C27.2489 31.8258 27.557 31.951 27.8795 31.948C28.202 31.945 28.5125 31.814 28.7427 31.5838L33.0822 27.2443L31.3786 25.5407L29.135 27.7842L29.2397 16.6062L26.8063 16.629L26.7017 27.807Z" fill="currentColor"/>
                </svg>
                <div class="switch-loader"></div>
            </div>

            <div class="mukuru-calculator__receive">
                <div class="mukuru-calculator__label">
                    They receive
                </div>
                <div class="inputs-wrapper">
                    <div class="currency_amount <?php echo $currency2 == "" ? 'hidden' : ''; ?>">
                        <input type="number" lang="en" name="receive-amount" placeholder="Enter amount">
                        <div class="selected_currency">
                            <input class="hidden-currency" type="hidden" name="receive-currency" value="<?php echo $out_currency; ?>">
                            <input class="hidden-code" type="hidden" name="receive-code" value="<?php echo $out_code; ?>">
                            <span class="calculator-pipe"></span>
                            <span class="text">
                                <?= $out_currency; ?>
                            </span>
                            <span class="calculator-pipe"></span>
                            <span class="flag <?php echo $out_code; ?>"></span>
                            <span class="dropdown-arrow">
                                <icon>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13px" height="9px" viewBox="0 0 13 9" fill="none">
                                        <path d="M11.713,0.633l-5.116,5.23L1.405,0.748L0.328,1.863l6.308,6.192l6.193-6.346L11.713,0.633z"></path>
                                    </svg>
                                </icon>
                            </span>
                        </div>
                    </div>
                    <div class="select_country <?php echo $currency2 != "" ? 'hidden' : ''; ?>">
                        <div class="country_search">
                            <input type="text" name="country-search" placeholder="Search Country">
                            <span class="dropdown-arrow">
                                <icon>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13px" height="9px" viewBox="0 0 13 9" fill="none">
                                        <path d="M11.713,0.633l-5.116,5.23L1.405,0.748L0.328,1.863l6.308,6.192l6.193-6.346L11.713,0.633z"/>
                                    </svg>
                                </icon>
                            </span>
                        </div>
                        <div class="currency_dropdown">
                            <?php
                                $payoutCountries = []; 
                                if (isset($receive_countries->items) && is_array($receive_countries->items)) {
                                    foreach($receive_countries->items as $key => $country):
                                        ?>
                                        <span class="currency__option <?php echo $key; ?> <?php echo $country->code; ?>" data-currency="<?php echo $country->baseCurrencyCode; ?>" data-code="<?php echo $country->code; ?>">
                                                <span class="flag select <?php echo $country->code; ?>" data-os-flag="<?php echo $country->code; ?>"></span>
                                                <?php echo $country->name; ?>
                                        </span>
                                        <?php   
                                    endforeach;  
                                }
                            ?>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mukuru-calculator__currency">
                <div class="mukuru-calculator__label">
                    Receive method
                </div>
                <div class="currency-options-wrapper" >
                    <ul class="selected-out-option">
                        <?php if (!empty($out_rates['items'])): ?>
                            <li class="payout-method" data-calculator-type="<?= $out_rates['items'][0]['calculatorType']; ?>" data-type="<?= $out_rates['items'][0]['type']; ?>" data-payout-currency="<?= $out_rates['items'][0]['rate']['payOutCurrencyCode']; ?>">
                                <?= $out_rates['items'][0]['payoutName']; ?>
                            </li>
                        <?php endif; ?>
                        <span class="dropdown-arrow">
                            <icon>
                                <svg xmlns="http://www.w3.org/2000/svg" width="13px" height="9px" viewBox="0 0 13 9" fill="#fff">
                                    <path d="M11.713,0.633l-5.116,5.23L1.405,0.748L0.328,1.863l6.308,6.192l6.193-6.346L11.713,0.633z"/>
                                </svg>
                            </icon>
                        </span>
                    </ul>
                    <ul class="currency-out-options">
                        <?php 
                            if (!empty($out_rates['items'])) {
                                foreach ($out_rates['items'] as $key => $product) {
                                    echo '<li class="payout-method" data-calculator-type="'.$product['calculatorType'].'" data-type="'.$product['type'].'" data-payout-currency="'.$product['rate']['payOutCurrencyCode'].'" >'.$product['payoutName'].'</li>';
                                }
                            }
                        ?>
                    </ul>
                </div>              
            </div>

            <div class="calculate-results"></div>

            <div class="wp-container-22 wp-block-buttons">
                <div class="wp-block-button is-style-big-white-outline-button">
                    <a href="#calculate" class="wp-block-button__link" data-wp-on--click="actions.doCalculation">Calculate</a>
                </div>
            </div>
        </div>
    </div>
</div>