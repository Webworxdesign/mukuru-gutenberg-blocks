/**
 * BLOCK:  Tab
 *
 * Registering a basic block with Gutenberg.
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { Component, Fragment } from '@wordpress/element';

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kttabUniqueIDs = [];
/**
 * Build the spacer edit
 */
class Tab extends Component {
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kttabUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( kttabUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kttabUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			kttabUniqueIDs.push( this.props.attributes.uniqueID );
		}
	}
	render() {
		const { attributes: { id, uniqueID, anchor } } = this.props;
		return (
			<Fragment>
				<div id={`${ anchor ? anchor : 'wwx-inner-tab'+uniqueID}`} className={ `wwx-tab-inner-content wwx-inner-tab-${ id } wwx-inner-tab${ uniqueID }` } >
					<InnerBlocks templateLock={ false } />
				</div>
			</Fragment>
		);
	}
}
export default ( Tab );