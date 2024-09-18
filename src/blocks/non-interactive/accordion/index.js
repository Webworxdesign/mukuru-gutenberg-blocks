// Import CSS.
import './editor.scss';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, withColors, getColorClassName, RichText, RawHTML } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import AccordionEdit from './edit'
import './style.scss';
import './editor.scss';
import metadata from './block.json';

const { Icon } = wp.components;

const MyIcon = () => <Icon icon="screenoptions" />;

registerBlockType( metadata.name, {
	attributes: {
		title: {
			type: "string",
			default: 'Heading / Title goes here',
		},
		descriptionIn: {
			type: "boolean",
			default: false
		},
		description: { 
			type: "string", 
			default: 'Description goes here',
		}, 
		addIcon: {
			type: "boolean",
			default: false
		}, 
		imgUrl: {
			type: 'string',
			default: ''
		}, 
		wrapper: {
			type: 'string',
			default: 'h3',
		},
		open: {
			type: "boolean",
			default: false
		},
		textColor: {
			type: 'string'
		},
		textOpenStateColor: {
			type: 'string'
		},
		accordionBackground: {
			type: 'string',
		},
		accordionOpenStateBackground: {
			type: 'string',
		},
		bodyBackground: {
			type: 'string',
		}, 
		mediaId: {
			type: 'number',
			default: 0
		},
		mediaUrl: {
			type: 'string',
			default: ''
		}
	},
  	edit: withColors({
		textColor: 'color',
		textOpenStateColor: 'color',
		accordionBackground: 'background-color',
		accordionOpenStateBackground: 'background-color',
		bodyBackground: 'background-color'
	})(AccordionEdit), 
	save: (props) => {

		const {
			title,
			descriptionIn, 
			description, 
			addIcon, 
			open,
			wrapper,
			textColor,
			textOpenStateColor,
			accordionBackground,
			accordionOpenStateBackground,
			bodyBackground,
		} = props.attributes;

		let textColorClass = "";
		let textOpenStateColorClass = "";
		let accordionBackgroundClass = "";
		let accordionOpenStateBackgroundClass = "";
		let titleStyles = {};

		let bodyBackgroundClass = "";
		let bodyStyles = {};
		let descriptionStyles = {};

		let iconStyles = {};


		if (textColor !== undefined) {
			textColorClass = getColorClassName('color', textColor);
		}
		if (textOpenStateColor !== undefined) {
			textOpenStateColorClass = `open-state-${getColorClassName('color', textOpenStateColor)}`;
		}

		if (accordionBackground !== undefined) {
			accordionBackgroundClass = getColorClassName('background-color', accordionBackground);
		}

		if (accordionOpenStateBackground !== undefined) {
			accordionOpenStateBackgroundClass = `open-state-${getColorClassName('background-color', accordionOpenStateBackground)}`;
		}

		if (bodyBackground !== undefined) {
			bodyBackgroundClass = getColorClassName('background-color', bodyBackground);
		}

		if(open){
			bodyStyles.display = "block";
		}else{
			bodyStyles.display = "none";
		}

		if(description){
			descriptionStyles.display = "block";
		}else{
			descriptionStyles.display = "none";
		}

		return (
			<div className={`wp-block-wwx-accordion ${open ? "active" : ""} ${accordionBackgroundClass} ${accordionOpenStateBackgroundClass ? accordionOpenStateBackgroundClass : ""}`}>
				<div className={`accordion-title`}>
                    {addIcon && (
                    <div className="accordion-icon-left">
                        <img src={props.attributes.imgUrl} />
                    </div>
                    )}
					<RichText.Content
						tagName={wrapper}
						style={titleStyles}
						className={`accordion-title-text ${textColorClass} ${textOpenStateColorClass}`}
						value={title}
					/>
					<span className={`accordion-icon ${textColorClass} ${textOpenStateColorClass}`} style={iconStyles}>
						<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="17px" height="17px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" aria-labelledby="title">
							<title>Chevron Icon</title>
							<path fill="currentColor" d="M278.939,1003.002c-14.789,0-29.637-5.633-40.967-16.99c-22.628-22.627-22.628-59.246,0-81.875 l401.159-401.131l-401.159-401.16c-22.628-22.628-22.628-59.279,0-81.875c22.628-22.628,59.279-22.628,81.902,0L761.94,462.038 c22.629,22.629,22.629,59.279,0,81.875L319.874,986.008C308.581,997.338,293.76,1003.002,278.939,1003.002z"/>
						</svg>
					</span>
				</div>
				{descriptionIn && (
				<div className={`accordion-description`} style={descriptionStyles}>
					<RichText.Content
						tagName="p"
						style={titleStyles}
						className={`accordion-description-text ${textColorClass} ${textOpenStateColorClass}`}
						value={description}
					/>
				</div>
				)}
				<div className={`accordion-content ${textColorClass} ${textOpenStateColorClass} ${bodyBackgroundClass}`} style={bodyStyles}>
					<InnerBlocks.Content />
				</div>
			</div>

		);
	},
});