// Import CSS.
import './editor.scss';

import { __ } from '@wordpress/i18n';

import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, MediaUpload, PlainText, InnerBlocks, PanelColorSettings } from '@wordpress/block-editor';
import { CheckboxControl, SelectControl, PanelBody, ToggleControl } from '@wordpress/components';

import './style.scss';
import './editor.scss';
import metadata from './block.json';

const blockAttributes = {
	showOn: {
		type: "string",
		default: "btn"
	},
	btnLabel: {
		type: "string",
		selector: '.ww-btn',
		source: "text",
		default: "Show"
	},
	btnBackgdColor: {
		type: "string",
		default: "rgba(0, 0, 0, 0.1)"
	},
	btnColor: {
		type: "string",
		default: "#ffffff"
	},
	triggerImageSizes: {
		type:"object",
		default: ""
	},
	triggerImageSrc: {
		type:"string",
		attribute: 'src',
		selector: '.trigger_image',
		default: ''
	},
	triggerImageAlt: {
		type:"string",
		default: ''
	},
	imgSize: {
		type: "string",
		default: "medium"
	},
	imgSizeLabels: {
		type: "array",
		default: []
	},
	triggerText: {
		type: "string",
		source: "text",
		selector: ".type_text",
		default: "Click Me"
	},
	textSize: {
		type: "string",
		default: ""
	},
	overrideLinkColor: {
		type: "boolean",
		default: false
	},
	textColor: {
		type: "string",
		default: "#000000"
	},
	textAlign: {
		type: "string",
		default: "center"
	},
	showDelay: {
		type: "string",
		default: "0"
	},
	showOnce: {
		type: "string",
		default: "no"
	},
	modalId: {
		type: "string",
		default: ""
	},
	noShowDays: {
		type: "string",
		default: ""
	},
	urlTrig: {
		type: "string",
		default: ""
	},
	triggerSelector: {
		type: "string",
		default: "triggerclass"
	},
	overlayBackgdColor: {
		type: "string",
		default: "rgba(0, 0, 0, 0.1)"
	},
	modalBackgdColor: {
		type: "string",
		default: "#ffffff"
	},
	modalPadding: {
		type: "string"
	},
	showBackgdImage: {
		type: "boolean",
		default: false
	},
	bgImageSrc: {
		type:"string",
		default: ''
	},
	showCloseBtn: {
		type: "string",
		default: "no"
	},
	btnCloseLabel: {
		type: "string",
		default: "Close"
	},
	btnCloseAlign: {
		type: "string",
		default: "center"
	}
}

// takes the style type attributes entered in the backend form and converts them to inline styles
// styles - object
const wwFormatStyles = (styles, showBackgdImage) => {

	// loop round the object of styles passed to us
	let formatedStyles = {}; // returned set of styles in an object
	for (let style in styles) {

		switch (style) {
			case 'fontSize':
			case 'padding':
			case 'borderRadius':

				// first check if any number exists in string / if not then do nothing

				if (!isNaN(parseFloat(styles[style]))) {

					// split string of values into array e.g. 10px 5px 5px 10px
					let styleValues = styles[style].split(" ");
					let formatStyleValue = '';

					let valueCount = 0;

					// loop round the array of style values formatting
					// each one depending upon %, em, rem, or px

					styleValues.forEach(function(styleValue) {

						// we have only have max of 4 values for padding 1 for everything else
						if (((style === 'padding' || style === 'borderRadius') && valueCount < 4) ||
							( style !== 'padding' && style !== 'borderRadius' && valueCount < 1 )) {
							if (styleValue.includes('%')) {
								formatStyleValue += parseInt(styleValue) + '% ';
							} else if (styleValue.includes('rem')) {
								formatStyleValue += parseFloat(styleValue) + 'rem ';
							} else if (styleValue.includes('em')) {
								formatStyleValue += parseFloat(styleValue) + 'em ';
							} else {
							// assume we are dealing with px
								formatStyleValue += parseInt(styleValue) + 'px ';
							}
							valueCount ++;
						}
					}); // end for each
					formatedStyles[style] = formatStyleValue;

				} // end NaN check
				break;

			case 'color':
			case 'backgroundColor':
				// extract rgba color from object color
				if (typeof styles[style] === 'object') {
					const {rgb} = styles[style];
					const {r,g,b,a} = rgb;
					formatedStyles[style] = "rgba("+ r + "," + g + "," + b + "," + a + ")";
				} else {
					formatedStyles[style] = styles[style];
				}
				break;

			case 'text-align':
				formatedStyles[style] = styles[style];
				break;
			case 'background-image':
				if (showBackgdImage && styles[style] != '') {
					formatedStyles[style] = "url(\"" + styles[style] + "\")";
					formatedStyles['background-position'] = "center";
					formatedStyles['background-size'] = "cover";
					formatedStyles['background-attachment'] = "fixed";
				}
				break;
		} // end switch

	} // end styles loop

	return formatedStyles;

}

const v1 = {
	attributes: blockAttributes,
	save: function( {attributes} ) {


		// format the trigger content which is either an image, link text,

		const trigger = () => {
			if (attributes.showOn === 'image') {
				return (
					<a href="javascript:void(0)" className="ww-block-popup-trigger type_image">
						<img
							className='trigger_image'
							src={attributes.triggerImageSrc}
							alt={attributes.triggerImageAlt}
						/>
					</a>
				);
			} else if (attributes.showOn === 'text') {
				let classStyles = '';
				if (attributes.overrideLinkColor) {
					classStyles = wwFormatStyles ({'fontSize': attributes.textSize, 'color' : attributes.textColor});
				} else {
					classStyles = wwFormatStyles ({'fontSize': attributes.textSize});
				}
				return (
					<a href="javascript:void(0)" style={classStyles} className="ww-block-popup-trigger type_text">
						{ attributes.triggerText }
					</a>
				);
			} else if (attributes.showOn === 'load') {
				if (attributes.showOnce !== 'no') {
				return (
					<span className = "ww-block-popup-trigger type_load" data-delay={attributes.showDelay} data-once={attributes.showOnce} data-id={attributes.modalId} data-days={attributes.noShowDays}></span>
				);
				} else {
					return (
						<span className = "ww-block-popup-trigger type_load" data-delay={attributes.showDelay}></span>
					);
				}
			} else if (attributes.showOn === 'selector') {
				return (
					<span className="ww-block-popup-trigger type_selector" data-selector={attributes.triggerSelector}></span>
				);
			} else {
				let classStyles = wwFormatStyles ({'backgroundColor': attributes.btnBackgdColor, 'color' : attributes.btnColor});
				return (
					<div class="wp-block-button">
						<span style={classStyles} className="ww-block-popup-trigger type_btn ww-btn wp-block-button__link">
							{attributes.btnLabel}
						</span>
					</div>
				);
			}

		}

		// format the close button

		const closeBtn = () => {
			if (attributes.showCloseBtn === 'yes') {
				return (
					<div className={'ww-block-close-btn' + ' align-' + attributes.btnCloseAlign}>
						<button type="button" className="type_btn ww-btn">
							{attributes.btnCloseLabel}
						</button>
					</div>
				);
			}
		}

		return (
			<div className= {'ww-block-popup ' + 'align-' + attributes.textAlign}>
				{trigger()}

				{/* Modal Overlay */}
				<div style={wwFormatStyles ({'backgroundColor': attributes.overlayBackgdColor})} className="ww-block-popup-overlay"></div>

				<div role="dialog" aria-modal="false" aria-labelledby="" aria-describedby="" className="ww-block-popup-wrap">
					<div className="ww-block-popup-wrap-inner"></div>
					{/* Modal Content */}
					<div  className="ww-block-popup">

						<div id="" style={wwFormatStyles ({'padding': attributes.modalPadding, 'backgroundColor': attributes.modalBackgdColor})} className="ww-modal-content">
							{<InnerBlocks.Content/>}
							{/* {closeBtn()} */}
						</div> {/* end content */}
						{/* end modal content */}
					<div className="ww-block-popup-closer"></div>
					</div>
				</div>

			</div>
		);
	}
};

const v2 = {
	attributes: blockAttributes,
	save: function( {attributes} ) {


		// format the trigger content which is either an image, link text,

		const trigger = () => {
			if (attributes.showOn === 'image') {
				return (
					<a href="javascript:void(0)" className="ww-block-popup-trigger type_image">
						<img
							className='trigger_image'
							src={attributes.triggerImageSrc}
							alt={attributes.triggerImageAlt}
						/>
					</a>
				);
			} else if (attributes.showOn === 'text') {
				let classStyles = '';
				if (attributes.overrideLinkColor) {
					classStyles = wwFormatStyles ({'fontSize': attributes.textSize, 'color' : attributes.textColor});
				} else {
					classStyles = wwFormatStyles ({'fontSize': attributes.textSize});
				}
				return (
					<a href="javascript:void(0)" style={classStyles} className="ww-block-popup-trigger type_text">
						{ attributes.triggerText }
					</a>
				);
			} else if (attributes.showOn === 'load') {
				if (attributes.showOnce !== 'no') {
				return (
					<span className = "ww-block-popup-trigger type_load" data-delay={attributes.showDelay} data-once={attributes.showOnce} data-id={attributes.modalId} data-days={attributes.noShowDays}></span>
				);
				} else {
					return (
						<span className = "ww-block-popup-trigger type_load" data-delay={attributes.showDelay}></span>
					);
				}
			} else if (attributes.showOn === 'selector') {
				return (
					<span className="ww-block-popup-trigger type_selector" data-selector={attributes.triggerSelector}></span>
				);
			} else {
				let classStyles = wwFormatStyles ({'backgroundColor': attributes.btnBackgdColor, 'color' : attributes.btnColor});
				return (
					<div class="wp-block-button">
						<button type="button" style={classStyles} className="ww-block-popup-trigger type_btn ww-btn wp-block-button__link">
							{attributes.btnLabel}
						</button>
					</div>
				);
			}

		}

		// format the close button

		const closeBtn = () => {
			// if (attributes.showCloseBtn === 'yes') {
			// 	return (
			// 		<div className={'ww-block-close-btn' + ' align-' + attributes.btnCloseAlign}>
			// 			<button type="button" className="type_btn ww-btn">
			// 				{attributes.btnCloseLabel}
			// 			</button>
			// 		</div>
			// 	);
			// }
		}

		return (

			<div className= {'ww-block-popup ' + 'align-' + attributes.textAlign}>
				{trigger()}

				{/* Modal Overlay */}
				<div style={wwFormatStyles ({'backgroundColor': attributes.overlayBackgdColor})} className="ww-block-popup-overlay"></div>

				<div role="dialog" aria-modal="false" aria-labelledby="" aria-describedby="" className={"ww-block-popup-wrap " + attributes.className}>
					<div className="ww-block-popup-wrap-inner"></div>
					{/* Modal Content */}
					<div className="ww-block-popup">

						<div id=""  style={wwFormatStyles ({'padding': attributes.modalPadding, 'backgroundColor': attributes.modalBackgdColor})} className="ww-modal-content">
							{<InnerBlocks.Content/>}
							{/* {closeBtn()} */}
						</div> {/* end content */} {/* end modal content */}
						<div className="ww-block-popup-closer"></div>

					</div>
				</div>

			</div>
		);
	}
};

const v3 = {
	attributes: blockAttributes,
	save: function( {attributes} ) {


		// format the trigger content which is either an image, link text,

		const trigger = () => {
			if (attributes.showOn === 'image') {
				return (
					<a href="javascript:void(0)" className="ww-block-popup-trigger type_image">
						<img
							className='trigger_image'
							src={attributes.triggerImageSrc}
							alt={attributes.triggerImageAlt}
						/>
					</a>
				);
			} else if (attributes.showOn === 'text') {
				let classStyles = '';
				if (attributes.overrideLinkColor) {
					classStyles = wwFormatStyles ({'fontSize': attributes.textSize, 'color' : attributes.textColor});
				} else {
					classStyles = wwFormatStyles ({'fontSize': attributes.textSize});
				}
				return (
					<a href="javascript:void(0)" style={classStyles} className="ww-block-popup-trigger type_text">
						{ attributes.triggerText }
					</a>
				);
			} else if (attributes.showOn === 'load') {
				if (attributes.showOnce !== 'no') {
				return (
					<span className = "ww-block-popup-trigger type_load" data-delay={attributes.showDelay} data-once={attributes.showOnce} data-id={attributes.modalId} data-days={attributes.noShowDays}></span>
				);
				} else {
					return (
						<span className = "ww-block-popup-trigger type_load" data-delay={attributes.showDelay}></span>
					);
				}
			} else if (attributes.showOn === 'selector') {
				return (
					<span className="ww-block-popup-trigger type_selector" data-selector={attributes.triggerSelector}></span>
				);
			} else {
				let classStyles = wwFormatStyles ({'backgroundColor': attributes.btnBackgdColor, 'color' : attributes.btnColor});
				return (
					<div className="ww-block-button">
						<button type="button" style={classStyles} className="ww-block-popup-trigger type_btn ww-btn wp-block-button__link">
							{attributes.btnLabel}
						</button>
					</div>
				);
			}

		}

		// format the close button

		const closeBtn = () => {
			// if (attributes.showCloseBtn === 'yes') {
			// 	return (
			// 		<div className={'ww-block-close-btn' + ' align-' + attributes.btnCloseAlign}>
			// 			<button type="button" className="type_btn ww-btn">
			// 				{attributes.btnCloseLabel}
			// 			</button>
			// 		</div>
			// 	);
			// }
		}

		return (

			<div className= {'ww-block-popup ' + 'align-' + attributes.textAlign}>
				{trigger()}

				{/* Modal Overlay */}
				<div style={wwFormatStyles ({'backgroundColor': attributes.overlayBackgdColor})} className="ww-block-popup-overlay"></div>

				<div role="dialog" aria-modal="false" aria-labelledby="" aria-describedby="" className={"ww-block-popup-wrap " + attributes.className}>
					{/* Modal Content */}
					<div  className="ww-block-popup">

						<div id=""  style={wwFormatStyles ({'padding': attributes.modalPadding, 'backgroundColor': attributes.modalBackgdColor})} className="ww-modal-content">
							{<InnerBlocks.Content/>}
							{/* {closeBtn()} */}
						</div> {/* end content */}
						{/* end modal content */}
						<div className="ww-block-popup-closer"></div>

					</div>
				</div>

			</div>
		);
	},
};


registerBlockType( metadata.name, {
	attributes: blockAttributes,
  	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function( {attributes, className, setAttributes, isSelected, clientId} ) {

		const blockProps = useBlockProps();
 
		// If innerblock is selected then we want to keep parent modal block open
		// returns true if child innerblock is selected

		function checkInnerblockSelected () {

			const select = wp.data.select('core/block-editor');
			const isParentOfSelectedBlock = select.hasSelectedInnerBlock( clientId, true );
			return (isParentOfSelectedBlock ? true : false);
		}

		// hide fields if fieldtype does not match the one passed in
		// fieldvalue string or boolean
		// trigger string - trigger field to check against
		// e.g. of use fieldvalue - image - trigger showOn
		// if the value in the field showOn is != image then hide field
		// e.g. fieldvalue true - trigger  overrideLinkColor
		// if value of overrideLinkColor != true then hide

		function hideFields(fieldvalue , trigger) {
			if (Array.isArray(fieldvalue)) {
				return !fieldvalue.includes(attributes[trigger]) ? "hide" : "";
			} else {
				return attributes[trigger] !== fieldvalue ? "hide" : "";
			}
		}

		// triggered when an image is selected

		function onImageSelect(imageObject) {

			// setAttributes({ triggerImage: imageObject.id});
			setAttributes({ triggerImageSizes: imageObject.sizes});

			// check if we have a medium size if not use the original full size

			if (imageObject.sizes.medium !== undefined) {
				setAttributes({
					imgSize: 'medium',
					triggerImageSrc: imageObject.sizes.medium.url});

			} else {
				setAttributes({
					imgSize: 'full',
					triggerImageSrc: imageObject.sizes.full.url});
			}

			setAttributes({ triggerImageAlt: imageObject.alt});

			// we need to construct the labels for the image sizes select field
			let imgSizesArray = Object.keys(imageObject.sizes); // make array of image sizes object
			let labelSizes = [];
			imgSizesArray.forEach( (value, index) => {
				labelSizes.push({ label: value  , value: value });
			});
			setAttributes({ imgSizeLabels: labelSizes });

		}

		// triggered on image size change

		function onImageSizeChange(imageSize) {

			setAttributes({
				imgSize: imageSize,
				triggerImageSrc: attributes.triggerImageSizes[imageSize].url
			});

		}

		// triggered when a background image is selected

		function bgImageSelect(imageObject) {

			setAttributes({
				bgImageSrc: imageObject.sizes.full.url});

		}

		// format the trigger content which is either an image, link text, onload, class or btn

		const trigger = () => {
			if (attributes.showOn === 'image') {
				return (
					<a href="javascript:void(0)" className="ww-block-popup-trigger type_image">
						<img
							className='trigger_image'
							src={attributes.triggerImageSrc}
							alt={attributes.triggerImageAlt}
						/>
					</a>
				);
			} else if (attributes.showOn === 'text') {
				let classStyles = '';
				if (attributes.overrideLinkColor) {
					classStyles = wwFormatStyles ({'fontSize': attributes.textSize, 'color' : attributes.textColor});
				} else {
					classStyles = wwFormatStyles ({'fontSize': attributes.textSize});
				}
				return (
					<a href="javascript:void(0)" style={classStyles} className="ww-block-popup-trigger type_text">
						{ attributes.triggerText }
					</a>
				);
			} else if (attributes.showOn === 'load') {
				return (
					<span className = "ww-block-popup-trigger type_load" data-delay={attributes.showDelay}>{__('Modal on screen load','ww-modal')}</span>
				);
			} else if (attributes.showOn === 'selector') {
				return (
					<span className="ww-block-popup-trigger type_selector" data-selector={attributes.triggerSelector}>{__('Modal on class selector','ww-modal')}</span>
				);
			} else {
				let classStyles = wwFormatStyles ({'backgroundColor': attributes.btnBackgdColor, 'color' : attributes.btnColor});
				//console.log('in trigger returned class styles are :');
				//console.log(classStyles);
				return (
					<div class="wp-block-button">
						<button type="button" style={classStyles} className="ww-block-popup-trigger type_btn ww-btn wp-block-button__link">
							{attributes.btnLabel}
						</button>
					</div>
				);
			}

		}

		// Figure out if we need to display the title and innerblocks fields
		// we only display if block is currently selected

		const dispTitleInnerBlock = (blockSelected) => {
			if (blockSelected || checkInnerblockSelected()) {
				return (
					<div>
						<label>{__('Modal Content:','ww-modal')}</label>
						<div className="ww-form-innerblock">
							<InnerBlocks />
						</div>
					</div>
				);
			} else {
				return null;
			}
		}

		return (
			<div { ...blockProps }>
				<div className= {'ww-block-popup ' + 'align-' + attributes.textAlign + ' ' + className}>
					{trigger()}
					{/* Modal Overlay */}
					<div style={wwFormatStyles ({'backgroundColor': attributes.overlayBackgdColor})} className="ww-block-popup-overlay"></div>

					{/* Modal Content */}
					<div  role="dialog" aria-modal="false" aria-labelledby="" aria-describedby=""  style={wwFormatStyles ({'backgroundColor': attributes.modalBackgdColor})} className="ww-block-popup-wrap">
						<div id=""  style={wwFormatStyles ({'padding': attributes.modalPadding})} className="ww-modal-content">
							{/*<InnerBlocks.Content/>*/}
						</div> {/* end content */}
						<div className="ww-block-popup-closer"></div>
					</div> {/* end modal content */}
				</div>
				<div className="ww-form">
					{dispTitleInnerBlock(isSelected)}
					<InspectorControls>
						<PanelBody
							title={__('Trigger','ww-modal')}
							initialOpen={false}
							className="ww-form"
						>
									{/*******************/}
									{/*    Trigger Tab  */}
									{/*******************/}

							<SelectControl
								label={__('Show On','ww-modal')}
								value={ attributes.showOn }
								className="ww-form-select"
								options= {[
									{ label: __('Button Click','ww-modal'), value: 'btn' },
									{ label: __('Text Click','ww-modal'), value: 'text' },
									{ label: __('Image Click','ww-modal'), value: 'image' },
									{ label: __('Custom Element Click','ww-modal'), value: 'selector' },
									{ label: __('Page Load','ww-modal'), value: 'load' },
								]}
								onChange={ content => setAttributes({ showOn: content }) }
								/>


							<div className={hideFields('btn','showOn')}>

								<label>{__('Button Label:','ww-modal')}</label>
								<PlainText
									onChange={ content => setAttributes({ btnLabel: content }) }
									value={ attributes.btnLabel }
									placeholder={__('Text to appear on button','ww-modal')}
								/>

								<PanelColorSettings
									initialOpen={false}
									title={'Button Color Settings'}
									colorSettings={[
										{
											value: attributes.btnBackgdColor,
											onChange: ( colorValue ) => setAttributes( { btnBackgdColor: colorValue } ),
											label: 'Button Background Color'
										},
										{
											value: attributes.btnColor,
											onChange: ( colorValue ) => setAttributes( { btnColor: colorValue } ),
											label: 'Button Text Color'
										},
									]}
								/>

							</div> {/* end button wrapper */}


							<div className={hideFields('image' , 'showOn')}>

								{/* Trigger Image */}

								<label>{__('Image: ','ww-modal')}</label>
								<MediaUpload
									onSelect={onImageSelect}
									type="image"
									value={attributes.triggerImageSrc}
									render={({open}) => (
										<a onClick={open} className="ww-trigger-image-container">
										<img src={attributes.triggerImageSrc}/>
									</a>
									)}
								/>

								{/* Trigger Image Size */}

								<SelectControl
									label={__('Image Size:','ww-modal')}
									value={ attributes.imgSize}
									options= {attributes.imgSizeLabels}
									onChange={ onImageSizeChange }
								/>

							</div> {/* end hide fields */}

							<div className={hideFields('text' , 'showOn')}>

								{/* Trigger Text */}

								<label>{__('Text:','ww-modal')}</label>
								<PlainText
									onChange={ content => setAttributes({ triggerText: content }) }
									value={ attributes.triggerText }
									placeholder={__('Trigger text','ww-modal')}
								/>

								{/* Trigger Text Size */}

								<label>{__('Text Size:','ww-modal')}</label>
								<PlainText
									onChange={ content => setAttributes({ textSize: content }) }
									value={ attributes.textSize }
									placeholder={__('Trigger link text size','ww-modal')}
								/>

								{/* Override Theme Colors */}

								<CheckboxControl
									label={__('Override Theme Text Color:','ww-modal')}
									checked={ attributes.overrideLinkColor }
									onChange={ (isChecked) =>
											setAttributes({overrideLinkColor: isChecked})
									}
								/>

								{/* Trigger Text Color */}

								<div className={hideFields(true , 'overrideLinkColor')}>
									{/* <label>{__('Text Color:','ww-modal')}</label>
									<ColorPicker
										color={ attributes.textColor }
										onChangeComplete={ ( color ) => setAttributes({ textColor: 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')'}) }
									/>	 */}

									<PanelColorSettings
										initialOpen={false}
										title={'Color Settings'}
										colorSettings={[
											{
												value: attributes.textColor,
												onChange: ( colorValue ) => setAttributes( { textColor: colorValue } ),
												label: 'Text Color'
											},
										]}
									/>
								</div>
							</div>

							<div className={hideFields(['text','image','btn'] , 'showOn')}>

								{/* Align Trigger Text / Image*/}

								<SelectControl
								label={__('Button / Text / Image Align','ww-modal')}
								value={ attributes.textAlign }
								className="ww-form-select"
								options= {[
									{ label: __('Left','ww-modal'), value: 'left' },
									{ label: __('Center','ww-modal'), value: 'center' },
									{ label: __('Right','ww-modal'), value: 'right' },
								]}
								onChange={ content => setAttributes({ textAlign: content }) }
								/>
							</div>

							<div className={hideFields('load' , 'showOn')}>

								{/* Show Delay */}

								<label>{__('Delay Before Showing Modal:','ww-modal')}</label>
								<PlainText
									onChange={ content => setAttributes({ showDelay: content }) }
									value={ attributes.showDelay }
									placeholder={__('Delay before showing modal popup','ww-modal')}
								/>

								<SelectControl
									label={__('Show Once','ww-modal')}
								value={ attributes.showOnce }
								options= {[
									{ label: __('No','ww-modal'), value: 'no' },
									{ label: __('Yes','ww-modal'), value: 'yes' },
								]}
								onChange={ content => setAttributes({ showOnce: content }) }
								/>

								{/* No Show Days */}

								<label>{__('Show Once Every X Days')}</label>
								<PlainText
									onChange={ content => setAttributes({ noShowDays: content }) }
									value={ attributes.noShowDays }
									placeholder={__('Number of Days','ww-modal')}
								/>

								{/* Modal ID */}

								<label>{__('Modal Identifier')}</label>
								<PlainText
									onChange={ content => setAttributes({ modalId: content }) }
									value={ attributes.modalId }
									placeholder={__('Modal Id','ww-modal')}
								/>

								{/* URL Trigger */}

								<label>{__('URL Content Trigger')}</label>
								<PlainText
									onChange={ content => setAttributes({ urlTrig: content }) }
									value={ attributes.urlTrig }
									placeholder={__('URL Content','ww-modal')}
								/>
							</div>

							<div className={hideFields('selector', 'showOn')}>

								{/* Trigger Class Selector */}

								<label>{__('Trigger Class Selector:','ww-modal')}</label>
								<PlainText
									onChange={ content => setAttributes({ triggerSelector: content }) }
									value={ attributes.triggerSelector }
									placeholder={__('Trigger Class Selector','ww-modal')}
								/>
							</div>

						</PanelBody>
						<PanelBody
							title={__('Modal','ww-modal')}
							initialOpen={false}
							className="ww-form"
						>
									{/*******************/}
									{/*     Style Tab   */}
									{/*******************/}

							{/* Overlay background color */}

							{/* <label>{__('Overlay Background Color:','ww-modal')}</label>
							<ColorPicker
								color={ attributes.overlayBackgdColor }
								onChangeComplete={ ( color ) => setAttributes({ overlayBackgdColor: 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')'}) }
							/>		 */}
							<PanelColorSettings
								initialOpen={false}
								title={'Color Settings'}
								colorSettings={[
									{
										value: attributes.overlayBackgdColor,
										onChange: ( colorValue ) => setAttributes( { overlayBackgdColor: colorValue } ),
										label: 'Overlay Background Color'
									},
								]}
							/>

						</PanelBody>



						<PanelBody
							title={__('Content','ww-modal')}
							initialOpen={false}
							className="ww-form"
						>
							{/*******************/}
							{/*  Modal Content   */}
							{/*******************/}

							<PanelColorSettings
								initialOpen={false}
								title={'Color Settings'}
								colorSettings={[
									{
										value: attributes.modalBackgdColor,
										onChange: ( colorValue ) => setAttributes( { modalBackgdColor: colorValue } ),
										label: 'Modal Background Color'
									},
								]}
							/>

							{/* Modal background image */}

							<CheckboxControl
								label={__('Background Image:','ww-modal')}
								checked={ attributes.showBackgdImage }
								onChange={ (isChecked) =>
										setAttributes({showBackgdImage: isChecked})
								}
							/>
							<div className={hideFields(true,'showBackgdImage')}>
								{/* Background Image */}

								<label>{__('Background Image: ','ww-modal')}</label>
								<MediaUpload
									onSelect={bgImageSelect}
									type="image"
									value={attributes.bgImageSrc}
									render={({open}) => (
										<a onClick={open} className="ww-trigger-image-container">
										<img src={attributes.bgImageSrc}/>
									</a>
									)}
								/>
							</div>

							{/* Modal Padding*/}

							<label>{__('Modal Padding:','ww-modal')}</label>
							<PlainText
								onChange={ content => setAttributes({ modalPadding: content }) }
								value={ attributes.modalPadding }
								placeholder={__('Modal padding px, em, rem, %','ww-modal')}
							/>

						</PanelBody>

					</InspectorControls>
				</div> {/* end ww-form */}


			</div>
		);

	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function( {attributes} ) {
		
		const blockProps = useBlockProps.save( {
			className: 'ww-block-popup ' + 'align-' + attributes.textAlign
		});

		// format the trigger content which is either an image, link text,

		const trigger = () => {
			if (attributes.showOn === 'image') {
				return (
					<a href="javascript:void(0)" className="ww-block-popup-trigger type_image">
						<img
							className='trigger_image'
							src={attributes.triggerImageSrc}
							alt={attributes.triggerImageAlt}
						/>
					</a>
				);
			} else if (attributes.showOn === 'text') {
				let classStyles = '';
				if (attributes.overrideLinkColor) {
					classStyles = wwFormatStyles ({'fontSize': attributes.textSize, 'color' : attributes.textColor});
				} else {
					classStyles = wwFormatStyles ({'fontSize': attributes.textSize});
				}
				return (
					<a href="javascript:void(0)" style={classStyles} className="ww-block-popup-trigger type_text">
						{ attributes.triggerText }
					</a>
				);
			} else if (attributes.showOn === 'load') {

				if (attributes.showOnce !== 'no') {
					return (
						<span className = "ww-block-popup-trigger type_load" data-delay={attributes.showDelay} data-once={attributes.showOnce} data-id={attributes.modalId} data-days={attributes.noShowDays} data-urltrig = {attributes.urlTrig && attributes.urlTrig}></span>
					);
				} else {
					return (
						<span className = "ww-block-popup-trigger type_load" data-delay={attributes.showDelay} data-urltrig = {attributes.urlTrig && attributes.urlTrig}></span>
					);
				}
			} else if (attributes.showOn === 'selector') {
				return (
					<span className="ww-block-popup-trigger type_selector" data-selector={attributes.triggerSelector}></span>
				);
			} else {
				let classStyles = wwFormatStyles ({'backgroundColor': attributes.btnBackgdColor, 'color' : attributes.btnColor});
				return (
					<div class="wp-block-button">
						<button type="button" style={classStyles} className="ww-block-popup-trigger type_btn ww-btn wp-block-button__link">
							{attributes.btnLabel}
						</button>
					</div>
				);
			}

		}

		// format the close button

		const closeBtn = () => {
			if (attributes.showCloseBtn === 'yes') {
				return (
					<div className={'ww-block-close-btn' + ' align-' + attributes.btnCloseAlign}>
						<button type="button" className="type_btn ww-btn">
							{attributes.btnCloseLabel}
						</button>
					</div>
				);
			}
		}

		// format the modal closer x

		const modalCloser = () => {
		return (
			<div className="ww-block-popup-closer"></div>
		);
		}


		return (

			<div { ...blockProps }>
				{trigger()}

				{/* Modal Overlay */}
				<div style={wwFormatStyles ({'backgroundColor': attributes.overlayBackgdColor})} className="ww-block-popup-overlay"></div>

				<div role="dialog" aria-modal="false" aria-labelledby="" aria-describedby="" className={"ww-block-popup-wrap " + attributes.className}>
					<div className="ww-block-popup-wrap-inner"></div>
					{/* Modal Content */}
					<div  className="ww-block-popup">
						<div id=""  style={wwFormatStyles ({'padding': attributes.modalPadding, 'background-image': attributes.bgImageSrc, 'backgroundColor': attributes.modalBackgdColor}, attributes.showBackgdImage )} className="ww-modal-content">
							{<InnerBlocks.Content/>}
							{/* {closeBtn()} */}
						</div> {/* end content */}
						{/* end modal content */}
						{modalCloser()}
					</div>
				</div>

			</div>
		);
	},
	deprecated: [ v3, v2, v1],
});