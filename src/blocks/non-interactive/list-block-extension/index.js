/* Add custom attribute to List block, in Sidebar */
const { __ } = wp.i18n;

// Enable custom attributes on List block
const enableSidebarSelectOnBlocks = [
    'core/list'
];

const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, SelectControl } = wp.components;

import classnames from 'classnames'

/**
 * Declare our custom attribute
 */
const setSidebarSelectAttribute = ( settings, name ) => {
    // Do nothing if it's another block than our defined ones.
    if ( ! enableSidebarSelectOnBlocks.includes( name ) ) {
        return settings;
    }

    return Object.assign( {}, settings, {
        attributes: Object.assign( {}, settings.attributes, {
            listStyleAttribute: { type: 'string' }
        } ),
    } );
};

wp.hooks.addFilter(
    'blocks.registerBlockType',
    'custom-attributes/set-sidebar-select-attribute',
    setSidebarSelectAttribute
);

/**
 * Add Custom Select to listStyle Sidebar
 */
const withSidebarSelect = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {

        // If current block is not allowed
    	if ( ! enableSidebarSelectOnBlocks.includes( props.name ) ) {
            return (
                <BlockEdit { ...props } />
            );
        }

        const { attributes, setAttributes } = props;
        const { listStyleAttribute } = attributes;

        return (
            <Fragment>
                <BlockEdit { ...props } />
                <InspectorControls>
                	<PanelBody
    	                title={ __( 'List Styles' ) }
    	            >
	                    <SelectControl
                            label={ __( 'Select Style' ) }
                            value={ listStyleAttribute }
                            options={ [
                                {
                                    label: __( 'None' ),
                                    value: ''
                                },
                                {
                                    label: __( 'Tick Icon' ),
                                    value: 'tick-icon'
                                },
                                {
                                    label: __( 'Tick Icon Rounded' ),
                                    value: 'tick-icon-rounded'
                                },
                                {
                                    label: __( 'Number Rounded' ),
                                    value: 'number-rounded'
                                },
                            ] }
                            onChange={ ( value ) => {
                                setAttributes( {
                                    listStyleAttribute: value,
                                } );
                            } }
                        /> 
	                </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withSidebarSelect' );

wp.hooks.addFilter(
    'editor.BlockEdit',
    'custom-attributes/with-sidebar-select',
    withSidebarSelect
);


/**
 * Add custom class to block in Edit
 */
const withSidebarSelectProp = createHigherOrderComponent( ( BlockListBlock ) => {
    return ( props ) => {

        // If current block is not allowed
        if ( ! enableSidebarSelectOnBlocks.includes( props.name ) ) {
            return (
                <BlockListBlock { ...props } />
            );
        }

        const { attributes } = props;
        const { listStyleAttribute } = attributes;

        if ( listStyleAttribute ) {
            return <BlockListBlock { ...props } className={ 'has-list-icon style-' + listStyleAttribute } />
        } else {
            return <BlockListBlock { ...props } />
        }
    };
}, 'withSidebarSelectProp' );

wp.hooks.addFilter(
    'editor.BlockListBlock',
    'custom-attributes/with-sidebar-select-prop',
    withSidebarSelectProp
);


/**
 * Save our custom attribute
 */
const saveSidebarSelectAttribute = ( extraProps, blockType, attributes ) => {
    // Do nothing if it's another block than our defined ones.
    if ( enableSidebarSelectOnBlocks.includes( blockType.name ) ) {
        const { listStyleAttribute } = attributes;
        if ( listStyleAttribute ) {
            extraProps.className = classnames( extraProps.className, 'has-list-icon style-' + listStyleAttribute )
        }
    }    

    return extraProps;

};
wp.hooks.addFilter(
    'blocks.getSaveContent.extraProps',
    'custom-attributes/save-sidebar-select-attribute',
    saveSidebarSelectAttribute
);