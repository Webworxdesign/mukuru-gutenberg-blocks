/**
 * BLOCK:  Tabs
 */
import times from 'lodash/times';
import { useBlockProps, InnerBlocks, RichText, getColorClassName } from '@wordpress/block-editor'; // Ensure compatibility with older versions of WordPress
import { __, sprintf } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

const WwxTabsSave = (props) => {
    const { attributes: { tabCount, blockAlignment, currentTab, mobileLayout, layout, tabletLayout, uniqueID, titles, tabAlignment, startTab, tabsColor,
        customTabsColor,
        tabsBackground,
        customTabsBackground, } } = props;

    var tabsColorClass = "";
    var tabsBackgroundClass = "";
    var tabsStyles = {};

    if (tabsColor !== undefined) {
        tabsColorClass = getColorClassName('color', tabsColor);
    } else if (customTabsColor !== undefined) {
        tabsStyles.color = customTabsColor;
    }

    if (tabsBackground !== undefined) {
        tabsBackgroundClass = getColorClassName('background-color', tabsBackground);
    } else if (customTabsBackground !== undefined) {
        tabsStyles.background = customTabsBackground;
    }

    const layoutClass = (!layout ? 'tabs' : layout);
    const tabLayoutClass = (!tabletLayout ? 'inherit' : tabletLayout);
    const mobileLayoutClass = (!mobileLayout ? 'inherit' : mobileLayout);
    const accordionClass = ((mobileLayout && 'accordion' === mobileLayout) || (tabletLayout && 'accordion' === tabletLayout) ? 'wwx-create-accordion' : '');
    const classId = (!uniqueID ? 'notset' : uniqueID);
    const activeTab = (startTab ? startTab : currentTab);
    const innerClasses = `wwx-tabs-wrap wwx-tabs-id${classId} wwx-tabs-has-${tabCount}-tabs wwx-active-tab-${activeTab} wwx-tabs-layout-${layoutClass} wwx-tabs-tablet-layout-${tabLayoutClass} wwx-tabs-mobile-layout-${mobileLayoutClass} wwx-tab-alignment-${tabAlignment} ${accordionClass}`;

    const blockProps = useBlockProps.save({
        className: `align${blockAlignment} ${tabsColorClass} ${tabsBackgroundClass}`,
        style: tabsStyles,
    });

    const stripStringRender = (string) => {
        return string.toLowerCase().replace(/[^0-9a-z-]/g, '');
    };

    const renderTitles = (index) => {
        const backupAnchor = `tab-${(titles[index] && titles[index].text ? stripStringRender(titles[index].text.toString()) : stripStringRender(__('Tab') + (1 + index)))}`;
        return (
            <Fragment>
                <li id={(titles[index] && titles[index].anchor ? titles[index].anchor : backupAnchor)} className={`wwx-title-item wwx-title-item-${1 + index} wwx-tab-title-${(1 + index === activeTab ? 'active' : 'inactive')}`}>
                    <a href={`#${(titles[index] && titles[index].anchor ? titles[index].anchor : backupAnchor)}`} style={tabsStyles} data-tab={1 + index} className={`wwx-tab-title ${tabsColorClass} ${tabsBackgroundClass} wwx-tab-title-${1 + index}`}>
                        <RichText.Content
                            tagName="span"
                            value={(titles[index] && titles[index].text ? titles[index].text : sprintf(__('Tab %d'), (1 + index)))}
                            className={'wwx-title-text'}
                        />
                    </a>
                </li>
            </Fragment>
        );
    };

    return (
        <div {...blockProps}>
            <div className={innerClasses}>
                <ul className={`wwx-tabs-title-list lists`}>
                    {times(tabCount, n => renderTitles(n))}
                </ul>
                <div className="wwx-tabs-content-wrap">
                    <InnerBlocks.Content />
                </div>
            </div>
        </div>
    );
};

export default WwxTabsSave;