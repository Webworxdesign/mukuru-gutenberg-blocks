// Import CSS.
import './editor.scss';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, BlockControls, InspectorControls, AlignmentToolbar, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
const { __experimentalLinkControl: LinkControl } = wp.blockEditor;

import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType( metadata.name, {
  attributes: {
    hoverBoxAlign: {
      type: "string",
      default: "center"
    },
    url: {
      type: "object",
      default: {}
    },
    buttonIn: {
      type: "boolean",
      default: false
    },
    buttonText: {
      type: "string",
      default: "Read More"
    }
  },
  edit: (props) => {
    const blockProps = useBlockProps();
    const {
      attributes: {
        hoverBoxAlign,
        url,
        buttonIn,
        buttonText
      },
      setAttributes,
      className
    } = props;

    return (
      <Fragment>
        <InspectorControls key="setting">
          <p>Hover box, a card with a link and hover styles</p>
          <PanelBody title="Link Settings" initialOpen={true}>
            <div className="hoverbox-link-control">
              <LinkControl
                value={url}
                onChange={(v) => setAttributes({ url: v })}
              />
              <ToggleControl
                label="Enable Button"
                checked={buttonIn}
                onChange={(v) => setAttributes({ buttonIn: v })}
              />
              {buttonIn && (
                <Fragment>
                  <TextControl
                    label="Button Text"
                    value={buttonText}
                    onChange={(v) => setAttributes({ buttonText: v })}
                  />
                </Fragment>
              )}
            </div>
          </PanelBody>
        </InspectorControls>
        <BlockControls>
          <AlignmentToolbar
            value={hoverBoxAlign}
            onChange={(v) => setAttributes({ hoverBoxAlign: v })}
          />
        </BlockControls>
        <div {...blockProps}>
            <div className={`hoverbox-inner ${hoverBoxAlign ? "has-text-align-" + hoverBoxAlign : ""} `}>
				<InnerBlocks />
				{buttonIn && (
					<div className={`wp-block-buttons d-none d-lg-flex is-layout-flex ${hoverBoxAlign ? "is-content-justification-" + hoverBoxAlign : ""}`}>
					<div className="wp-block-button">
						<div className="wp-block-button__link wp-element-button">{buttonText}</div>
					</div>
					</div>
				)}
			</div>
        </div>
      </Fragment>
    );
  },
  save: (props) => {
    const blockProps = useBlockProps.save();
    const { attributes: { hoverBoxAlign, url, buttonIn, buttonText }, className } = props;

    const newTab = url.opensInNewTab !== undefined ? url.opensInNewTab : false;

    return (
      <div {...blockProps}>
        {url.url ? (
          <a href={url.url} target={newTab ? "_blank" : "_self"} className={`hoverbox-inner ${className} ${hoverBoxAlign ? "has-text-align-" + hoverBoxAlign : ""}`} rel="noopener">
            <InnerBlocks.Content />
            {buttonIn && (
              <div className={`wp-block-buttons d-none d-lg-flex is-layout-flex ${hoverBoxAlign ? "is-content-justification-" + hoverBoxAlign : ""}`}>
                <div className="wp-block-button">
                  <div className="wp-block-button__link wp-element-button">{buttonText}</div>
                </div>
              </div>
            )}
          </a>
        ) : (
          <div className={`hoverbox-inner ${className} ${hoverBoxAlign ? "has-text-align-" + hoverBoxAlign : ""}`}>
            <InnerBlocks.Content />
          </div>
        )}
      </div>
    );
  },
});