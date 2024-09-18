/**
 * BLOCK: Tabs
 */

import attributes from './attributes';

/**
 * Import edit
 */
import Edit from './edit';
/**
 * Import save
 */
import save from './save';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { withColors } = wp.blockEditor;

// Removed unused function kt_stripStringRender

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'wwx/tabs', {
	title: __( 'Tabs' ), // Block title.
	icon: 'welcome-widgets-menus', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'layout', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'mukuru' ),
		__( 'tabs' ),
		__( 'tab' ),
	],
	supports: {
		anchor: true,
	},
	attributes,
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'full' === blockAlignment || 'wide' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	}, 
	edit: withColors({ tabsColor: 'color', tabsBackground: 'background-color' })(Edit),
	save,
} );
