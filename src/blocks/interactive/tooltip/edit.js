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
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { MediaUpload, MediaUploadCheck } from '@wordpress/editor';
import { Fragment } from '@wordpress/element';
import { PanelBody, TextControl, Flex, FlexItem, FormFileUpload } from '@wordpress/components';

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
export default function Edit({ attributes, setAttributes }) {
    const { tooltipsImage, tooltips } = attributes;

    // Add class to blockProps 
    const blockProps = useBlockProps();

    // Removed unused handleFileUpload function

    return (
        <div {...blockProps}>
            <Fragment>
                <InspectorControls>
                    <PanelBody
                        title={__('Image Tooltips', 'mukuru-gutenberg-blocks')}
                        initialOpen={false}
                    >
                        <Fragment>
                            {/* Tooltips with descriptions and positions top and left */}
                            {tooltips.map((tooltip, index) => (
                                <div key={index}>
									<h5>{__('Tooltip', 'mukuru-gutenberg-blocks')} {index + 1}</h5>
                                    <TextControl
                                        label={__('Tooltip', 'mukuru-gutenberg-blocks')}
                                        value={tooltip.text}
                                        onChange={(text) => {
                                            const newTooltips = [...tooltips];
                                            newTooltips[index].text = text;
                                            setAttributes({ tooltips: newTooltips });
                                        }} 
										className='mb-0'
                                    />
                                    <Flex>
                                        <FlexItem>
                                            <TextControl
                                                label={__('Top', 'mukuru-gutenberg-blocks')}
                                                value={tooltip.topPosition}
                                                onChange={(topPosition) => {
                                                    const newTooltips = [...tooltips];
                                                    newTooltips[index].topPosition = topPosition;
                                                    setAttributes({ tooltips: newTooltips });
                                                }}
                                            />
                                        </FlexItem>
                                        <FlexItem>
                                            <TextControl
                                                label={__('Left', 'mukuru-gutenberg-blocks')}
                                                value={tooltip.leftPosition}
                                                onChange={(leftPosition) => {
                                                    const newTooltips = [...tooltips];
                                                    newTooltips[index].leftPosition = leftPosition;
                                                    setAttributes({ tooltips: newTooltips });
                                                }}
                                            />
                                        </FlexItem>
                                    </Flex>
									{/* Add remove tooltip button */}
									<button
										className="button"
										onClick={() => {
											const newTooltips = [...tooltips];
											newTooltips.splice(index, 1);
											setAttributes({ tooltips: newTooltips });
										}}
									> 
										{__('Remove Tooltip', 'mukuru-gutenberg-blocks')}
									</button>
                                    <br />
									{ index !== tooltips.length - 1 && <hr /> }
                                </div>
                            ))}
                            <br />
                            {/* Add new tooltip */}
                            <button
                                className="button"
                                onClick={() => {
                                    setAttributes({
                                        tooltips: [
                                            ...tooltips,
                                            {
                                                text: '',
                                                topPosition: '',
                                                leftPosition: '',
                                            },
                                        ],
                                    });
                                }}
                            >
                                {__('Add Tooltip', 'mukuru-gutenberg-blocks')}
                            </button>
                        </Fragment>
                    </PanelBody>
                </InspectorControls>
            </Fragment>

			<h4>Image Tooltips</h4>
            <div className="pulsing-tooltip-wrapper">

				<div className="tooltip-image">
                    <MediaUploadCheck>
						<MediaUpload 
							onSelect={(media) => setAttributes({ tooltipsImage: media.url })} 
							value={tooltipsImage} 
							render={({ open }) => ( 
								!!tooltipsImage ? ( 
									<div> 
										<div className="image-tooltip-actions"> 
											<button className="removebtn" onClick={() => setAttributes({ tooltipsImage: null })}> 
												Remove Image
											</button> 
										</div> 
										<img src={tooltipsImage} alt="Tooltips Image" />
									</div> 
								) : ( 
									<button className="image-tooltip-actions" onClick={open}> 
										Select/Upload Image 
									</button> 
								) 
							)}
						/>
					</MediaUploadCheck>
				</div>

                {/* Loop through the tooltips and render them */}
                {tooltips.map((tooltip, index) => (
                    <div key={index} className="pulsing-tooltip" style={{ top: tooltip.topPosition, left: tooltip.leftPosition }}>
                        <div className="wp-block-group__inner-container is-layout-constrained wp-block-group-is-layout-constrained">
                            <div className="wp-block-safe-svg-svg-icon safe-svg-cover" style={{ textAlign: 'left' }}>
                                <div className="tooltip-icon"></div>
                            </div>
                            <p className="tooltip">{tooltip.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}