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
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, PlainText } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
const { Fragment } = wp.element;
const { PanelBody, SelectControl, ColorPalette, TextControl } = wp.components;

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
export default function Edit( { attributes, setAttributes } ) {
	const { dropdownType, bookServiceLink, applyForWorkLink, dropdownPlaceholder, dropdownBackground, services, id } = attributes;

	if (!id) {
		const newId = `service${Math.floor(Math.random() * 100)}`;
		setAttributes({ id: newId });
	}

	const updateService = (index, updatedService) => {
		const newServices = services.map((service, i) => (i === index ? updatedService : service));
		setAttributes({ services: newServices });
	};

	const removeService = (index) => {
		const newServices = services.filter((_, i) => i !== index).map((service, i) => ({ ...service, index: i }));
		setAttributes({ services: newServices });
	};

	const addService = () => {
		const newService = {
			index: services.length,
			title: "",
			description: "",
			link: ""
		};
		setAttributes({ services: [...services, newService] });
	};

	// add class to blockProps 
	const blockProps = useBlockProps( {
		className: dropdownType,
	});

	// Retrieve the themes color settings from the block editors' data
	const colors = useSelect('core/block-editor').getSettings().colors;

	return (
		<div {...blockProps}>
			
			<Fragment>
                <InspectorControls>
                    <PanelBody
                        title={__('Dropdown Settings')}
                        initialOpen={false}
                    >
						<Fragment>
							<SelectControl
								label="Dropdown Type"
								value={dropdownType}
								options={[
									{ label: 'Contained', value: 'contained' }, 
									{ label: 'Seperated', value: 'seperated' },
								]}
								onChange={(v) => {
									setAttributes({ 
										dropdownType: v,
									});
								}}
							/>
							<TextControl
								label="Book a Service Link" 
								value={bookServiceLink}
								onChange={(v) => setAttributes({ bookServiceLink: v })}
							/>
							{ dropdownType == 'seperated' && 
								<TextControl
									label="Apply for Work Link" 
									value={applyForWorkLink}
									onChange={(v) => setAttributes({ applyForWorkLink: v })}
								/>
							}
							<TextControl
								label="Dropdown Placeholder Text" 
								value={dropdownPlaceholder}
								onChange={(v) => setAttributes({ dropdownPlaceholder: v })}
							/>

							<label className="components-base-control__label">Dropdown Background Color</label>
							<br />

							<ColorPalette
								colors={colors} 
								value={dropdownBackground} 
								onChange={(color) => setAttributes({ dropdownBackground: color })} 
							/>

						</Fragment>
                    </PanelBody>
                </InspectorControls>
            </Fragment>

			<div className={`services-dropdown ${dropdownType}`}>
				<div className="service-dropdown-selector" style={{ backgroundColor: dropdownBackground, borderColor: dropdownBackground }}>
					<span>{dropdownPlaceholder}</span>
					<svg width="20" height="10" viewBox="0 0 27 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M13.0044 14.1119C13.0044 14.1119 14.2532 14.6328 14.6695 14.1119L26.7417 2.02677C26.7417 2.02677 27.2621 0.77652 26.7417 0.359782C26.2214 -0.0569567 25.4929 -0.161141 25.0766 0.359782L13.8368 11.6116L2.59731 0.359782C2.59731 0.359782 1.34843 -0.161141 0.932149 0.359782C0.515867 0.880705 0.411797 1.61004 0.932149 2.02677L13.0044 14.1119Z" fill="#A5A5A5"/>
					</svg>
				</div>
				<div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
					<div class="wp-block-button">
						<a class="wp-block-button__link wp-element-button" href="#">Book a Service</a>
					</div>
					{ dropdownType == 'seperated' && 
						<div class="wp-block-button is-style-outline">
							<a class="wp-block-button__link wp-element-button" href="#" target="_blank">Apply for Work</a>
						</div>
					}
				</div>
			</div>
			<div className="services-list">
				{services.map((service, index) => (
					<div className="service-item" key={index}>
						<div className="insert-wrapper">
							<span>
								Insert Service {index + 1} Here:
							</span>
							<span className="remove-service" onClick={() => removeService(index)}>
							×
							</span>
						</div>
						<div className="service-fields">
							<div className="service-icon">
								<MediaUploadCheck>
									<MediaUpload
										onSelect={media => {
											const image = media.sizes?.medium?.url || media.url;
											updateService(index, { ...service, image });
										}} 
										value={service.image} 
										description={__("Only SVG files are allowed.")} 
										render={({ open }) => (
											!!service.image ? (
												<div>
													<div className="service-icon__actions">
														<a
															href="#"
															className="removebtn"
															onClick={() => updateService(index, { ...service, image: null })}
														>
															×
														</a>
													</div>
													<div
														className="service-icon__image"
														style={{ backgroundImage: `url(${service.image})` }}
														onClick={open}
													/>
												</div>
											) : (
												<a href="#" className="service-icon__image" onClick={open}>
													Select/Upload Image
												</a>
											)
										)}
									/>
								</MediaUploadCheck>
								<span>Only SVG files are allowed.</span>
							</div>
							<div className="title-description">
								<PlainText
									className="title-plain-text" 
									placeholder="Add Service Title"
									value={service.title}
									autoFocus
									onChange={title => updateService(index, { ...service, title })}
								/>
								<PlainText
									className="description-plain-text" 
									placeholder="Service Description"
									value={service.description}
									onChange={description => updateService(index, { ...service, description })}
								/>
								<PlainText
									className="link-plain-text"
									placeholder="Add Link"
									value={service.link}
									onChange={link => updateService(index, { ...service, link })}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
			<button className="add-more-service" onClick={addService}>
				Add Service
			</button>
		</div>
	);
}
