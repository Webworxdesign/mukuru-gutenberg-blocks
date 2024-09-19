/**
 * External dependencies
 */
import { assign } from 'lodash';

import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import './style.scss';
import './editor.scss';

// Enable attribute control on the following blocks
const enableControlOnBlocks = [
   'core/spacer',
];

/**
 * Add spacer controls attribute to block.
 *
 * @param {object} settings Current block settings.
 * @param {string} name Name of block.
 *
 * @returns {object} Modified block settings.
 */
const addControlAttribute = ( settings, name ) => {
	// Do nothing if it's another block than our defined ones.
	if ( ! enableControlOnBlocks.includes( name ) ) {
		return settings;
	}

	// Use Lodash's assign to gracefully handle if attributes are undefined
	settings.attributes = assign( settings.attributes, {
		responsiveLarge: {
			type: 'number',
		},
		responsiveMedium: {
			type: 'number',
		},
		responsiveSmall: {
			type: 'number',
		},
		enableLarge: {
			type: 'boolean',
			default: false
		},
		enableMedium: {
			type: 'boolean',
			default: false
		},
		enableSmall: {
			type: 'boolean',
			default: false
		}
	} );

	return settings;
};

addFilter( 'blocks.registerBlockType', 'sim/attribute/responsivespacer', addControlAttribute );

/**
 * Create HOC to add spacer control to inspector controls of block.
 */
const withSpacerResponsiveContol = createHigherOrderComponent((BlockEdit) => {

    return (props) => {
        // Do nothing if it's another block than our defined ones.
        if (!enableControlOnBlocks.includes(props.name)) {
            return (
                <BlockEdit {...props} />
            );
        }

        const blockProps = useBlockProps();

        const { height, responsiveLarge, responsiveMedium, responsiveSmall, enableLarge, enableMedium, enableSmall } = props.attributes;

        // Generate the inline styles
        const inlineStyles = {
            '--desktop-height': height ? `${height}` : '',
            '--tablet-height': responsiveLarge ? `${responsiveLarge}px` : '',
            '--mobile-medium-height': responsiveMedium ? `${responsiveMedium}px` : '',
            '--mobile-small-height': responsiveSmall ? `${responsiveSmall}px` : '' 
        };

        let newStyles = {...props.style};
        newStyles = inlineStyles;
        
        
        const newProps = {
            ...props,
            style: newStyles
        }

        return (
            <Fragment>
                <div {...blockProps} style={newStyles} >
                <BlockEdit {...newProps} />
                </div>
                <InspectorControls>
                    <PanelBody
                        title={__('Responsive Settings')}
                        initialOpen={true}
                    >
                        <ToggleControl
                            label={'Tablet'}
                            checked={enableLarge}
                            onChange={(v) => {
                                if (!v) {
                                    props.setAttributes({ responsiveLarge: 0 })
                                }
                                props.setAttributes({ enableLarge: v })
                            }}
                        />
                        {enableLarge && (
                            <RangeControl
                                label="Height below 1080px"
                                value={responsiveLarge}
                                onChange={(v) => {
                                    props.setAttributes({
                                        responsiveLarge: v,
                                    });
                                }}
                                min={0}
                                max={500}
                            />
                        )}
                        <ToggleControl
                            label={'Mobile Medium'}
                            checked={enableMedium}
                            onChange={(v) => {
                                if (!v) {
                                    props.setAttributes({ responsiveMedium: 0 })
                                }
                                props.setAttributes({ enableMedium: v })
                            }}
                        />
                        {enableMedium && (
                            <RangeControl
                                label="Height below 767px"
                                value={responsiveMedium}
                                onChange={(v) => {
                                    props.setAttributes({
                                        responsiveMedium: v,
                                    });
                                }}
                                min={0}
                                max={500}
                            />
                        )}
                        <ToggleControl
                            label={'Mobile Small'}
                            checked={enableSmall}
                            onChange={(v) => {
                                if (!v) {
                                    props.setAttributes({ responsiveSmall: 0 })
                                }
                                props.setAttributes({ enableSmall: v })
                            }}
                        />
                        {enableSmall && (
                            <RangeControl
                                label="Height below 480px"
                                value={responsiveSmall}
                                onChange={(v) => {
                                    props.setAttributes({
                                        responsiveSmall: v,
                                    });
                                }}
                                min={0}
                                max={500}
                            />
                        )}
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withSpacerResponsiveContol');

addFilter('editor.BlockEdit', 'sim/with-responsive-spacer-control', withSpacerResponsiveContol);

/**
 * Add inline style attribute to save element of block.
 *
 * @param {object} saveElementProps Props of save element.
 * @param {Object} blockType Block type information.
 * @param {Object} attributes Attributes of block.
 *
 * @returns {object} Modified props of save element.
 */
const addExtraProps = ( saveElementProps, blockType, attributes ) => {

	// Do nothing if it's another block than our defined ones.
	if ( ! enableControlOnBlocks.includes( blockType.name ) ) {
		return saveElementProps;
	}

	var propsObj = {};
	const { height, responsiveLarge, responsiveMedium, responsiveSmall } = attributes;

	propsObj['style'] = height ? '--desktop-height: ' + height + ';' : '';
	propsObj['style'] += responsiveLarge ? '--tablet-height: ' + responsiveLarge + 'px;' : '';
	propsObj['style'] += responsiveMedium ? '--mobile-medium-height: ' + responsiveMedium + 'px;' : '';
	propsObj['style'] += responsiveSmall ? '--mobile-small-height: ' + responsiveSmall + 'px;' : '';

	assign( saveElementProps, propsObj );

	return saveElementProps;

};

addFilter( 'blocks.getSaveContent.extraProps', 'sim/get-save-content/extra-spacing-props', addExtraProps );