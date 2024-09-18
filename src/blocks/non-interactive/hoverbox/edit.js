import { __ } from '@wordpress/i18n';
import { useBlockProps, BlockControls, InspectorControls, AlignmentToolbar, InnerBlocks, __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { Fragment, PanelBody, TextControl, ToggleControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
  const blockProps = useBlockProps();
  const { hoverBoxAlign, url, buttonIn, buttonText } = attributes;

  return (
    <div { ...blockProps }>
      <InspectorControls key="setting">
        <p>Hover box, a card with a link and hover styles</p>
        <PanelBody title="Link Settings" initialOpen={true}>
          <div className="hoverbox-link-control">
            <LinkControl
              value={url}
              onChange={(v) => setAttributes({ url: v }) }
            />
            <ToggleControl
              label="Enable Button" 
              checked={buttonIn} 
              onChange={ (v) => setAttributes({ buttonIn: v }) }
            />
            {buttonIn && (
              <Fragment>
                <TextControl
                  label="Button Text"
                  value={ buttonText }
                  onChange={ ( v ) => setAttributes({buttonText: v}) }
                />
              </Fragment>
            )}
          </div>
        </PanelBody>
      </InspectorControls>
      
      <BlockControls>
        <AlignmentToolbar
          value={ hoverBoxAlign }
          onChange={ ( v ) => setAttributes( { hoverBoxAlign: v }) }
        />
      </BlockControls>
  
      <div className={`${hoverBoxAlign ? " has-text-align-"+hoverBoxAlign : "" }`} >
        <div className="hoverbox-inner">
          <InnerBlocks />
          {buttonIn && (
            <div className={`wp-block-buttons d-none d-lg-flex is-layout-flex ${hoverBoxAlign ? " is-content-justification-"+hoverBoxAlign : "" }`}>
              <div className="wp-block-button">
                <div className="wp-block-button__link wp-element-button">{buttonText}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}