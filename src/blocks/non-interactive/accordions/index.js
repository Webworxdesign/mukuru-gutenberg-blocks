// Import CSS.
import './editor.scss';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, InspectorControls, MediaUpload } from '@wordpress/block-editor';
import { Toolbar, Button, PanelBody, PanelRow, ToggleControl, SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType( metadata.name, {
  attributes: {
    toggleAll: {
      type: "boolean",
      default: false
    },
    stepProgressBar: {
      type: "boolean",
      default: false
    },
  },
  edit: (props) => {

	const blockProps = useBlockProps( { 
	  className: `${props.attributes.toggleAll ? " toggle-all" : " toggle-one"} ${props.className} ${props.attributes.stepProgressBar ? " step-progress-bar" : ""}`
	} );

		const TEMPLATE = [ [ 'wwx/accordion', {}, [] ], ];

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody>
						<ToggleControl
							label={ __( 'Opening an accordion closes the others.' ) }
							checked={ props.attributes.toggleAll }
							onChange={ (v) => props.setAttributes( { toggleAll: v } ) }
						/>
					</PanelBody>
					<PanelBody>
						<ToggleControl
							label={ __( 'Add step progress bar on the left.' ) }
							checked={ props.attributes.stepProgressBar }
							onChange={ (v) => props.setAttributes( { stepProgressBar: v } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...blockProps }>
					<InnerBlocks allowedBlocks={['wwx/accordion']}  template={ TEMPLATE } />
				</div>
			</Fragment>
		);
  },
  save: (props) => {

    const blockProps = useBlockProps.save();

		return (
			<div { ...blockProps }>
				<InnerBlocks.Content />
			</div>
		);
  },
});