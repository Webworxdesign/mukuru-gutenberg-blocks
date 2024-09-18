/**
 * External dependencies
 */
//  import './style.scss';

import { assign } from 'lodash';

const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, ToggleControl } = wp.components;


// Enable attribute control on the following blocks
const enableControlOnBlocks = [
    'core/group',
    'core/cover',
    'core/column',
    'core/columns',
    'core/coverImage',
];


/**
 * Add scroll controls attribute to block.
 *
 * @param {object} settings Current block settings.
 * @param {string} name Name of block.
 *
 * @returns {object} Modified block settings.
 */
const addControlAttribute = (settings, name) => {
    // Do nothing if it's another block than our defined ones.
    if (!enableControlOnBlocks.includes(name)) {
        return settings;
    }

    // Use Lodash's assign to gracefully handle if attributes are undefined
    settings.attributes = assign(settings.attributes, {
        desktopHidden: {
            type: 'boolean',
        },
        tabletHidden: {
            type: 'boolean',
        },
        mobileHidden: {
            type: 'boolean',
        },

    });

    return settings;
};

/**
 * Create HOC to add hover and scroll control to inspector controls of block.
 */
const withResponsiveControl = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        // Do nothing if it's another block than our defined ones.
        if (!enableControlOnBlocks.includes(props.name)) {
            return (
                <BlockEdit {...props} />
            );
        }

        const {
            desktopHidden,
            tabletHidden,
            mobileHidden
        } = props.attributes;


        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody
                        title={__('Responsive Settings')}
                        initialOpen={false}
                    >
                        <ToggleControl
                            label="Hidden On Desktop"
                            checked={desktopHidden}
                            onChange={(v) => {
                                props.setAttributes({
                                    desktopHidden: v,
                                });
                            }}
                        />
                        <ToggleControl
                            label="Hidden On Tablet"
                            checked={tabletHidden}
                            onChange={(v) => {
                                props.setAttributes({
                                    tabletHidden: v,
                                });
                            }}
                        />
                        <ToggleControl
                            label="Hidden On Mobile"
                            checked={mobileHidden}
                            onChange={(v) => {
                                props.setAttributes({
                                    mobileHidden: v,
                                });
                            }}
                        />


                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withResponsiveControl');


/**
 * Add inline style attribute to save element of block.
 *
 * @param {object} saveElementProps Props of save element.
 * @param {Object} blockType Block type information.
 * @param {Object} attributes Attributes of block.
 *
 * @returns {object} Modified props of save element.
 */
const addExtraProps = (saveElementProps, blockType, attributes) => {
    // Do nothing if it's another block than our defined ones.
    if (!enableControlOnBlocks.includes(blockType.name)) {
        return saveElementProps;
    }

    const {
        desktopHidden,
        tabletHidden,
        mobileHidden,
    } = attributes;

    let hideIn = "";
    let propsObj = {};
    //propsObj['className'] = className;
    if (desktopHidden) {
        hideIn = 'desktop';
    }
    if (tabletHidden) {
        hideIn += " " + 'tablet';
    }
    if (mobileHidden) {
        hideIn += " " + 'mobile';
    }

    if (hideIn) {
        propsObj['hidden-on'] = hideIn;
    }

    if (propsObj) {
        assign(saveElementProps, propsObj);
    }



    return saveElementProps;
};

//add filters

addFilter(
    'blocks.registerBlockType', 
    'wwx/attribute/responsive', 
    addControlAttribute
);

addFilter(
    'editor.BlockEdit', 
    'wwx/with-responsive-control', 
    withResponsiveControl
);

addFilter(
    'blocks.getSaveContent.extraProps', 
    'wwx/get-save-content/extra-responsive-props', 
    addExtraProps
);