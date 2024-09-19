import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useState, useEffect, Fragment } from '@wordpress/element';

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kttabUniqueIDs = [];

const Tab = (props) => {
    const { attributes, setAttributes, clientId } = props;
    const { id, uniqueID, anchor } = attributes;

    const [localUniqueID, setLocalUniqueID] = useState(uniqueID);

    useEffect(() => {
        if (!localUniqueID) {
            const newUniqueID = '_' + clientId.substr(2, 9);
            setAttributes({ uniqueID: newUniqueID });
            setLocalUniqueID(newUniqueID);
            kttabUniqueIDs.push(newUniqueID);
        } else if (kttabUniqueIDs.includes(localUniqueID)) {
            const newUniqueID = '_' + clientId.substr(2, 9);
            setAttributes({ uniqueID: newUniqueID });
            setLocalUniqueID(newUniqueID);
            kttabUniqueIDs.push(newUniqueID);
        } else {
            kttabUniqueIDs.push(localUniqueID);
        }
    }, [localUniqueID, clientId, setAttributes]);

	const blockProps = useBlockProps({
		className: `wwx-tab-inner-content wwx-inner-tab-${id} wwx-inner-tab${localUniqueID}`,
	});

    return (
        <Fragment>
            <div id={`${anchor ? anchor : 'wwx-inner-tab' + localUniqueID}`} {...blockProps}>
                <InnerBlocks templateLock={false} />
            </div>
        </Fragment>
    );
};

export default Tab;