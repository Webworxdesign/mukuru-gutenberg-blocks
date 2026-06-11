import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { TextControl, ToggleControl, PanelBody } from '@wordpress/components';

const ALLOWED_BLOCKS = ['core/image', 'core/paragraph', 'core/group'];

const TEMPLATE = [
	['core/paragraph', { placeholder: 'Ticker text...' }],
];

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();

	const { tickerSpeed, pauseOnHover, tickerSpacing } = attributes;

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
								label={__('Ticker Speed (seconds)')}
								value={tickerSpeed} 
								type="number" 
								onChange={(v) => setAttributes({ tickerSpeed: v })}
							/>
							
							<ToggleControl 
								label={__('Pause on Hover')}
								checked={pauseOnHover} 
								onChange={(v) => setAttributes({ pauseOnHover: v })}
							/>
							
							<TextControl 
								label={__('Item Spacing (px)')}
								value={tickerSpacing} 
								type="number" 
								onChange={(v) => setAttributes({ tickerSpacing: v })}
							/>
						</Fragment>
					</PanelBody>
				</InspectorControls>

				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					template={TEMPLATE}
					renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
				/>
			</Fragment>
		</div>
	);
}
