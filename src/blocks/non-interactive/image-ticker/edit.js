import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { Fragment, useEffect } from '@wordpress/element';
import { TextControl, ToggleControl, PanelBody } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();

	const { tickerSpeed, pauseOnHover } = attributes;

	const TEMPLATE = [
		['core/image', { className: 'image-ticker__image skip-lazy' }],
		['core/image', { className: 'image-ticker__image skip-lazy' }],
		['core/image', { className: 'image-ticker__image skip-lazy' }],
		['core/image', { className: 'image-ticker__image skip-lazy' }]
	];

	return (
		<div {...blockProps}>
			<Fragment>
				<InspectorControls>
					<PanelBody
						title={__('Ticker Settings')}
						initialOpen={false}
					>
						<Fragment>
							<TextControl 
								label="Ticker Speed" 
								value={tickerSpeed} 
								type="number" 
								onChange={(v) => setAttributes({ tickerSpeed: v })}
							/>
							
							<ToggleControl 
								label="Pause on Hover" 
								checked={pauseOnHover} 
								onChange={(v) => setAttributes({ pauseOnHover: v })}
							/>

						</Fragment>
					</PanelBody>
				</InspectorControls>

				<InnerBlocks
					template={TEMPLATE}
					allowedBlocks={['core/image']}
					renderAppender={() => <InnerBlocks.ButtonBlockAppender className="your-custom-class"/>}
				/>

			</Fragment>
		</div>
	);
}
