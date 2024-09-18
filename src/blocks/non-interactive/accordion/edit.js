const { Fragment } = wp.element;
import {IconArrow} from "./icons";
import {uploadIcon} from "./uploadIcon";

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, PanelColorSettings, getColorClassName, RichText, InnerBlocks, MediaUpload, } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';

const AccordionEdit = (props) => {

    const blockProps = useBlockProps();

    const {
        attributes:{
            title,
            descriptionIn,
            description,
            addIcon,
            imgUrl,
            open,
            wrapper,
            customAccordionBackground,
            customAccordionOpenStateBackground
        }, setAttributes, className,
            textColor, setTextColor,
            textOpenStateColor, setTextOpenStateColor,
            accordionBackground, setAccordionBackground,
            accordionOpenStateBackground, setAccordionOpenStateBackground,
        } = props;



    let accordionBackgroundClass;
    let accordionOpenStateBackgroundClass;
    let textColorClass;
    let textOpenStateColorClass;
    let titleStyles = {};
    let bodyStyles = {};

    if (accordionBackground.class !== undefined) {
        accordionBackgroundClass = accordionBackground.class;
    }else if (customAccordionBackground !== undefined ){
        titleStyles.background = customAccordionBackground;
    }

    if (accordionOpenStateBackground.class !== undefined) {
        accordionOpenStateBackgroundClass = `open-state-${accordionOpenStateBackground.class}`;
    }else if (customAccordionOpenStateBackground !== undefined ){
        titleStyles.background = customAccordionOpenStateBackground;
    }

    if (textColor.class !== undefined) {
        textColorClass = textColor.class;
    }

    if (textOpenStateColor.class !== undefined) {
        textOpenStateColorClass = `open-state-${textOpenStateColor.class}`;
    }

    const TEMPLATE = [
        [ 'core/paragraph', { placeholder: 'Add content here...' } ],
    ];

    function selectImage(value) {
        props.setAttributes({
            imgUrl: value.sizes.full.url,
        })
    }

    return (
        <Fragment>
			<InspectorControls>
                <PanelBody className="accordion-heading">
                    <SelectControl
                    label="Title Tag"
                    value={ wrapper }
                    options={ [
                        { label: 'p', value: 'p'   },
                        { label: 'div', value: 'div'  },
                        { label: 'h2', value: 'h2' },
                        { label: 'h3', value: 'h3' },
                        { label: 'h4', value: 'h4' },
                        { label: 'h5', value: 'h5' },
                        ] }
                        onChange={ ( v ) => props.setAttributes( { wrapper: v } ) }
                    />
                    <ToggleControl
                        label={ 'Open by default'}
                        checked={ open }
                        onChange={ (v) => props.setAttributes( { open: v } ) }
                    />
                    <ToggleControl
                        label="Description"
                        checked={descriptionIn}
                        onChange={(v) => {
                            props.setAttributes({
                                descriptionIn: v,
                            });
                        }}
                    />
                    <ToggleControl
                        label="Add icon left"
                        checked={addIcon}
                        onChange={(v) => {
                            props.setAttributes({
                                addIcon: v,
                            });
                        } } />
                    {addIcon && (
                        <div>
                            <MediaUpload
                                onSelect={selectImage}
                                render={({ open }) => {
                                    return <div onClick={open}>
                                        {props.attributes.imgUrl
                                        ? <div><img
                                        src={ props.attributes.imgUrl}
                                         /><br/>Replace Icon/Image</div>
                                        : 'Click here to upload an icon/image'}
                                        </div>;
                                } } />
                        </div>
                    )}
                </PanelBody>
				<PanelColorSettings
                    initialOpen={false}
					title={'Accordion Color settings'}
					colorSettings={[
                        {
							value: accordionBackground.color,
							onChange: setAccordionBackground,
							label: 'Accordion background color'
						},
                        {
							value: accordionOpenStateBackground.color,
							onChange: setAccordionOpenStateBackground,
							label: 'Accordion open-state background color'
						},
						{
							value: textColor.color,
							onChange: setTextColor,
							label: 'Text color'
						},
						{
							value: textOpenStateColor.color,
							onChange: setTextOpenStateColor,
							label: 'Open state text color'
						},
					]}
				/>


			</InspectorControls>
            
            <div { ...blockProps }>
                <div className={`className wp-block-wwx-accordion ${accordionBackgroundClass ? accordionBackgroundClass : ""} ${accordionOpenStateBackgroundClass ? accordionOpenStateBackgroundClass : ""}`}>
                    <div className={`accordion-title`}>
                        {addIcon && (
                        <div className="accordion-icon-left">
                            <img src={props.attributes.imgUrl} />
                        </div>
                        )}
                        <RichText
                            className={	`accordion-title-text  ${textColorClass ? textColorClass : ""} ${textOpenStateColorClass ? textOpenStateColorClass : ""}`}
                            style={titleStyles}
                            tagName={ wrapper }
                            onChange={ ( v ) => {
                                setAttributes( { title: v } );
                            } }
                            value={ title }
                        />
                        <span className={`accordion-icon`}>
                            <IconArrow />
                        </span>
                    </div>
                    {descriptionIn && (
                    <div className={`accordion-description`}>
                        <RichText
                            className={	`accordion-description-text  ${textColorClass ? textColorClass : ""} ${textOpenStateColorClass ? textOpenStateColorClass : ""}`}
                            style={titleStyles}
                            tagName="div"
                            onChange={ ( v ) => {
                                setAttributes( { description: v } );
                            } }
                            value={ description }
                        />
                    </div>
                    )}
                    <div className={`accordion-content ${textColorClass ? textColorClass : ""} ${textOpenStateColorClass ? textOpenStateColorClass : ""}`} style={bodyStyles}>
                        <InnerBlocks allowedBlocks={['core/paragraph', 'core/image', 'core/button', 'core/spacer', 'core/heading', 'core/list', 'core/columns', 'core/column', 'core/group', 'core/table']} template={ TEMPLATE } />
                    </div>
                </div>
            </div>
		</Fragment>
    );

}

export default AccordionEdit;
