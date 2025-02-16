/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { SelectControl, PanelBody, TextControl, Flex, FlexItem } from '@wordpress/components';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */

import s_field from './group_62d93cf4af21c.json';

import CalculatorIcon from './icons/calculator-icon';
import DropdownIcon from './icons/dropdown-icon';
import SwitchIcon from './icons/switch-icon';

export default function Edit({ attributes, setAttributes }) {
    const { payIn, payOutCountries } = attributes;

    // Add class to blockProps 
    const blockProps = useBlockProps();
    
    const payInCountry = payIn.split(',')[0];
    const payInCurrency = payIn.split(',')[1];

    const sendOptions = s_field.fields.find(field => field.name === 'pay_in').choices;
    const payOutOptions = s_field.fields.find(field => field.name === 'pay_out_countries').choices;


    return (
        <div {...blockProps}>
            <Fragment>
                <InspectorControls>
                    <PanelBody
                        title={__('Check Rates Calculator', 'mukuru-gutenberg-blocks')}
                        initialOpen={false}
                        >
                        <Fragment>
                            <SelectControl 
                                label={__('Pay In', 'mukuru-gutenberg-blocks')} 
                                value={payIn} 
                                options={[
                                    { label: __('Botswana', 'mukuru-gutenberg-blocks'), value: 'BW,BWP,13,1659425266983' },
                                    { label: __('eSwatini', 'mukuru-gutenberg-blocks'), value: 'SZ,SZL,24,1659425522362' },
                                    { label: __('Kenya', 'mukuru-gutenberg-blocks'), value: 'KE,KES,19,1659425465039' },
                                    { label: __('Lesotho', 'mukuru-gutenberg-blocks'), value: 'LS,LSL,19,1659425465039' },
                                    { label: __('Malawi', 'mukuru-gutenberg-blocks'), value: 'MW,MWK,15,1659425361319' },
                                    { label: __('South Africa', 'mukuru-gutenberg-blocks'), value: 'ZA,ZAR,1,1659425159068' },
                                    { label: __('United Kingdom', 'mukuru-gutenberg-blocks'), value: 'GB,GBP,24,1659425522362' },
                                    { label: __('Uganda', 'mukuru-gutenberg-blocks'), value: 'UG,UGX,24,1659425522362' },
                                    { label: __('Zimbabwe', 'mukuru-gutenberg-blocks'), value: 'ZW,USD,6,1659424979188' },
                                    { label: __('Zambia', 'mukuru-gutenberg-blocks'), value: 'ZM,ZMW,14,1659425314819' },
                                ]}
                                onChange={(payIn) => setAttributes({ payIn })}
                                />

                            <SelectControl 
                                label={__('Pay Out', 'mukuru-gutenberg-blocks')} 
                                value={payOutCountries} 
                                options={[
                                    { label: __('Austria', 'mukuru-gutenberg-blocks'), value: 'AT,EUR' },
                                    { label: __('Bangladesh', 'mukuru-gutenberg-blocks'), value: 'BD,BDT' },
                                    { label: __('Belgium', 'mukuru-gutenberg-blocks'), value: 'BE,EUR' },
                                    { label: __('Botswana', 'mukuru-gutenberg-blocks'), value: 'BW,BWP' },
                                    { label: __('Bulgaria', 'mukuru-gutenberg-blocks'), value: 'BG,EUR' },
                                    { label: __('Burundi', 'mukuru-gutenberg-blocks'), value: 'BI,BIF' },
                                    { label: __('Cameroon', 'mukuru-gutenberg-blocks'), value: 'CM,XAF' },
                                    { label: __('China', 'mukuru-gutenberg-blocks'), value: 'CN,CNY' },
                                    { label: __('Croatia', 'mukuru-gutenberg-blocks'), value: 'HR,EUR' },
                                    { label: __('Cyprus', 'mukuru-gutenberg-blocks'), value: 'CY,EUR' },
                                    { label: __('Czech Republic', 'mukuru-gutenberg-blocks'), value: 'CZ,EUR' },
                                    { label: __('DR Congo', 'mukuru-gutenberg-blocks'), value: 'CD,USD' },
                                    { label: __('Denmark', 'mukuru-gutenberg-blocks'), value: 'DK,EUR' },
                                    { label: __('Estonia', 'mukuru-gutenberg-blocks'), value: 'EE,EUR' },
                                    { label: __('eSwatini', 'mukuru-gutenberg-blocks'), value: 'SZ,SZL' },
                                    { label: __('Ethiopia', 'mukuru-gutenberg-blocks'), value: 'ET,ETB' },
                                    { label: __('Finland', 'mukuru-gutenberg-blocks'), value: 'FI,EUR' },
                                    { label: __('France', 'mukuru-gutenberg-blocks'), value: 'FR,EUR' },
                                    { label: __('Germany', 'mukuru-gutenberg-blocks'), value: 'DE,EUR' },
                                    { label: __('Ghana', 'mukuru-gutenberg-blocks'), value: 'GH,GHS' },
                                    { label: __('Greece', 'mukuru-gutenberg-blocks'), value: 'GR,EUR' }, 
                                    { label: __('Hungary', 'mukuru-gutenberg-blocks'), value: 'HU,EUR' },
                                    { label: __('India', 'mukuru-gutenberg-blocks'), value: 'IN,INR' },
                                    { label: __('Ireland', 'mukuru-gutenberg-blocks'), value: 'IE,EUR' },
                                    { label: __('Italy', 'mukuru-gutenberg-blocks'), value: 'IT,EUR' },
                                    { label: __('Kenya', 'mukuru-gutenberg-blocks'), value: 'KE,KES' },
                                    { label: __('Latvia', 'mukuru-gutenberg-blocks'), value: 'LV,EUR' },
                                    { label: __('Lesotho', 'mukuru-gutenberg-blocks'), value: 'LS,LSL' },
                                    { label: __('Lithuania', 'mukuru-gutenberg-blocks'), value: 'LT,EUR' },
                                    { label: __('Luxembourg', 'mukuru-gutenberg-blocks'), value: 'LU,EUR' },
                                    { label: __('Malawi', 'mukuru-gutenberg-blocks'), value: 'MW,MWK' },
                                    { label: __('Malta', 'mukuru-gutenberg-blocks'), value: 'MT,EUR' },
                                    { label: __('Mozambique', 'mukuru-gutenberg-blocks'), value: 'MZ,MZN' },
                                    { label: __('Netherlands', 'mukuru-gutenberg-blocks'), value: 'NL,EUR' },
                                    { label: __('Nigeria', 'mukuru-gutenberg-blocks'), value: 'NG,USD' },
                                    { label: __('Pakistan', 'mukuru-gutenberg-blocks'), value: 'PK,PKR' },
                                    { label: __('Poland', 'mukuru-gutenberg-blocks'), value: 'PL,EUR' },
                                    { label: __('Portugal', 'mukuru-gutenberg-blocks'), value: 'PT,EUR' },
                                    { label: __('Romania', 'mukuru-gutenberg-blocks'), value: 'RO,EUR' },
                                    { label: __('Rwanda', 'mukuru-gutenberg-blocks'), value: 'RW,RWF' },
                                    { label: __('Slovakia', 'mukuru-gutenberg-blocks'), value: 'SK,EUR' },
                                    { label: __('Slovenia', 'mukuru-gutenberg-blocks'), value: 'SI,EUR' },
                                    { label: __('Somalia', 'mukuru-gutenberg-blocks'), value: 'SO,SOS' },
                                    { label: __('South Africa', 'mukuru-gutenberg-blocks'), value: 'ZA,ZAR' },
                                    { label: __('Spain', 'mukuru-gutenberg-blocks'), value: 'ES,EUR' },
                                    { label: __('Sweden', 'mukuru-gutenberg-blocks'), value: 'SE,EUR' },
                                    { label: __('Tanzania', 'mukuru-gutenberg-blocks'), value: 'TZ,TZS' },
                                    { label: __('Uganda', 'mukuru-gutenberg-blocks'), value: 'UG,UGX' },
                                    { label: __('United Kingdom', 'mukuru-gutenberg-blocks'), value: 'GB,GBP' },
                                    { label: __('Zambia', 'mukuru-gutenberg-blocks'), value: 'ZM,ZMW' },
                                    { label: __('Zimbabwe', 'mukuru-gutenberg-blocks'), value: 'ZW,USD' },
                                    { label: __('United States', 'mukuru-gutenberg-blocks'), value: 'US,USD' },
                                    { label: __('Côte d\'Ivoire', 'mukuru-gutenberg-blocks'), value: 'CI,XOF' },
                                ]} 
                                onChange={(payOutCountries) => setAttributes({ payOutCountries })} 
                                /> 
                            
                        </Fragment>
                    </PanelBody>
                </InspectorControls>
            </Fragment>
            
            <div className="calculator-wrapper">

                <div className="mukuru-calculator " data-preferred-out="ZW">
                    <div className="calculator-header">
                        <div className="calculator-icon">
                            <CalculatorIcon />
                        </div>
                        <h3>Check Rates</h3>
                    </div>
                    <div className="mukuru-calculator__send">
                        <div className="mukuru-calculator__label">You pay</div>
                        <div className="inputs-wrapper">
                            <div className="currency_amount">
                                <input type="number" lang="en" name="send-amount" placeholder="Enter amount" />
                                <div className="selected_currency">
                                    <input className="hidden-currency" type="hidden" name="send-currency" value="" />
                                    <input className="hidden-code" type="hidden" name="send-code" value={payInCountry} />
                                    <span className="calculator-pipe"></span>
                                    <span className="text">{payInCurrency}</span>
                                    <span className="calculator-pipe"></span>
                                    <span className={`flag ${payInCountry}`}></span>
                                    <span className="dropdown-arrow">
                                        <DropdownIcon />
                                    </span>
                                </div>
                            </div>
                            <div className="select_country hidden">
                                <div className="country_search">
                                    <input type="text" name="country-search" placeholder="Search Country" />
                                    <span className="dropdown-arrow">
                                        <DropdownIcon />
                                    </span>
                                </div>
                                    <div className="currency_dropdown">
                                        { 
                                            Object.keys(sendOptions).map((key, index) => {
                                                const [countryCode, currency, id, channel] = key.split(',');
                                                const countryName = sendOptions[key];
                                                return (
                                                    <span key={index} className={`currency__option ${countryCode} ${currency}`} data-id={id} data-channel={channel} data-currency={currency} data-code={countryCode}>
                                                        <span className={`flag select ${countryCode}`} data-os-flag={countryCode}></span>
                                                        {countryName}
                                                    </span>
                                                );
                                            })
                                        }
                                    </div>
                            </div>
                        </div>
                    </div>

                    <div className="mukuru-calculator__switch">
                        <SwitchIcon />
                        <div className="switch-loader"></div>
                    </div>

                    <div className="mukuru-calculator__receive">
                        <div className="mukuru-calculator__label">
                            They receive
                        </div>
                        <div className="inputs-wrapper">
                            <div className="currency_amount ">
                                <input type="number" lang="en" name="receive-amount" placeholder="Enter amount" />
                                <div className="selected_currency">
                                    <input className="hidden-currency" type="hidden" name="receive-currency" value="USD" />
                                    <input className="hidden-code" type="hidden" name="receive-code" value="ZW" />
                                    <span className="calculator-pipe"></span>
                                    <span className="text">USD</span>
                                    <span className="calculator-pipe"></span>
                                    <span className="flag ZW"></span>
                                    <span className="dropdown-arrow">
                                        <DropdownIcon />
                                    </span>
                                </div>
                            </div>
                            <div className="select_country hidden">
                                <div className="country_search">
                                    <input type="text" name="country-search" placeholder="Search Country" />
                                    <span className="dropdown-arrow">
                                        <DropdownIcon />
                                    </span>
                                </div>
                                <div className="currency_dropdown">
                                    {
                                        Object.keys(payOutOptions).map((key, index) => {
                                            const [countryCode, currency] = key.split(',');
                                            const countryName = payOutOptions[key];
                                            return (
                                                <span key={index} className={`currency__option ${index} ${countryCode}`} data-currency={currency} data-code={countryCode}>
                                                    <span className={`flag select ${countryCode}`} data-os-flag={countryCode}></span>
                                                    {countryName}
                                                </span>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mukuru-calculator__currency">
                        <div className="mukuru-calculator__label">
                            Receive method
                        </div>
                        <div className="currency-options-wrapper">
                            <ul className="selected-out-option">
                                <li className="payout-method" data-calculator-type="you-send" data-type="cash-collection" data-payout-currency="USD">Cash USD</li>
                                <span className="dropdown-arrow">
                                    <DropdownIcon />
                                </span>
                            </ul>
                            <ul className="currency-out-options">
                                <li className="payout-method" data-calculator-type="you-send" data-type="cash-collection" data-payout-currency="USD">Cash USD</li>
                                <li className="payout-method" data-calculator-type="you-send" data-type="cash-collection" data-payout-currency="ZAR">Cash ZAR</li>
                                <li className="payout-method" data-calculator-type="you-pay" data-type="mobile-wallet" data-payout-currency="USD">Mukuru Wallet USD</li>
                            </ul>
                        </div>              
                    </div>

                    <div className="calculate-results"></div>

                    <div className="wp-container-22 wp-block-buttons">
                        <div className="wp-block-button is-style-big-white-outline-button">
                            <a href="#calculate" className="wp-block-button__link">Calculate</a>
                        </div>
                    </div>
                </div>
                    
            </div>

        </div>
    );
}