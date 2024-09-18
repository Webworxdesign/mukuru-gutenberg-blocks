import { useBlockProps, InnerBlocks, InspectorControls, BlockControls, AlignmentToolbar, BlockAlignmentToolbar, PanelColorSettings, RichText } from '@wordpress/block-editor';
import { Button, ButtonGroup, Tooltip, TabPanel, Dashicon, PanelBody, TextControl } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useState, useEffect, Fragment } from '@wordpress/element';
import { times, map, filter } from 'lodash';
import { createBlock } from '@wordpress/blocks';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import memoize from 'lodash/memoize';

const ALLOWED_BLOCKS = [ 'wwx/tab' ];
const ANCHOR_REGEX = /[\s#]/g;
const kttabsUniqueIDs = [];

const getPanesTemplate = memoize((panes) => {
    return times(panes, n => ['wwx/tab', { id: n + 1 }]);
});

const Tabs = (props) => {
    const { attributes, setAttributes, clientId, tabsBlock, realTabsCount, insertTab, removeTab, moveTab, resetOrder, className, tabsColor, setTabsColor, tabsBackground, setTabsBackground } = props;
    const { uniqueID, tabCount, blockAlignment, mobileLayout, currentTab, tabletLayout, layout, titles, tabAlignment, startTab } = attributes;
	const layoutClass = ( ! layout ? 'tabs' : layout );

    const [hovered, setHovered] = useState(false);
    const [showPreset, setShowPreset] = useState(false);
    const [user, setUser] = useState('admin');
    const [settings, setSettings] = useState({});

    useEffect(() => {
        if (!attributes.uniqueID) {
            if (attributes.showPresets) {
                setShowPreset(true);
            }
            setAttributes({
                uniqueID: '_' + clientId.substr(2, 9),
            });
            kttabsUniqueIDs.push('_' + clientId.substr(2, 9));
        } else if (kttabsUniqueIDs.includes(attributes.uniqueID)) {
            setAttributes({
                uniqueID: '_' + clientId.substr(2, 9),
            });
            kttabsUniqueIDs.push('_' + clientId.substr(2, 9));
        } else {
            kttabsUniqueIDs.push(attributes.uniqueID);
        }
    }, []);

    const showSettings = (key) => {
        if (undefined === settings[key] || 'all' === settings[key]) {
            return true;
        } else if ('contributor' === settings[key] && (['contributor', 'author', 'editor', 'admin'].includes(user))) {
            return true;
        } else if ('author' === settings[key] && (['author', 'editor', 'admin'].includes(user))) {
            return true;
        } else if ('editor' === settings[key] && (['editor', 'admin'].includes(user))) {
            return true;
        } else if ('admin' === settings[key] && 'admin' === user) {
            return true;
        }
        return false;
    };

    const saveArrayUpdate = (value, index) => {
        const newItems = titles.map((item, thisIndex) => {
            if (index === thisIndex) {
                item = { ...item, ...value };
            }
            return item;
        });
        setAttributes({
            titles: newItems,
        });
    };

    const onMove = (oldIndex, newIndex) => {
        const newTitles = [...titles];
        newTitles.splice(newIndex, 1, titles[oldIndex]);
        newTitles.splice(oldIndex, 1, titles[newIndex]);
        setAttributes({ titles: newTitles, currentTab: parseInt(newIndex + 1) });
        if (attributes.startTab === (oldIndex + 1)) {
            setAttributes({ startTab: (newIndex + 1) });
        } else if (attributes.startTab === (newIndex + 1)) {
            setAttributes({ startTab: (oldIndex + 1) });
        }
        moveTab(tabsBlock.innerBlocks[oldIndex].clientId, newIndex);
        resetOrder();
        setAttributes({ currentTab: parseInt(newIndex + 1) });
    };

    const onMoveForward = (oldIndex) => {
        return () => {
            if (oldIndex === realTabsCount - 1) {
                return;
            }
            onMove(oldIndex, oldIndex + 1);
        };
    };

    const onMoveBack = (oldIndex) => {
        return () => {
            if (oldIndex === 0) {
                return;
            }
            onMove(oldIndex, oldIndex - 1);
        };
    };

    let tabsColorClass;
	let tabsBackgroundClass;
	let tabsStyles = {};

	if (tabsColor !== undefined) {
		if (tabsColor.class != undefined) {
			tabsColorClass = tabsColor.class;
		} else {
			tabsStyles.color = tabsColor.color;
		}
	}

	if (tabsBackground !== undefined) {
		if (tabsBackground.class != undefined) {
			tabsBackgroundClass = tabsBackground.class;
		} else {
			tabsStyles.background = tabsBackground.color;
		}
	}

	const startlayoutOptions = [
		{ key: 'skip', name: __( 'Skip' ), icon: __( 'Skip' ) },
		{ key: 'simple', name: __( 'Simple' ), icon: 'welcome-widgets-menus' },
		{ key: 'boldbg', name: __( 'Boldbg' ), icon: 'welcome-widgets-menus' },
		{ key: 'center', name: __( 'Center' ), icon: 'welcome-widgets-menus' },
		{ key: 'vertical', name: __( 'Vertical' ), icon: 'welcome-widgets-menus' },
	];

	const setInitalLayout = ( key ) => {
		if ( 'skip' === key ) {
		} else if ( 'simple' === key ) {
			setAttributes( {
				layout: 'tabs',
				tabAlignment: 'left',
			} );
		} else if ( 'boldbg' === key ) {
			setAttributes( {
				layout: 'tabs',
				tabAlignment: 'left',
			} );
		} else if ( 'center' === key ) {
			setAttributes( {
				layout: 'tabs',
				tabAlignment: 'center',
			} );
		} else if ( 'vertical' === key ) {
			setAttributes( {
				layout: 'vtabs',
				mobileLayout: 'accordion',
				tabAlignment: 'left',
			} );
		}
	};

	const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );

	const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );

	const classes = `wwx-tabs-wrap ${tabsColorClass} ${tabsBackgroundClass} wwx-tabs-id${ uniqueID } wwx-tabs-has-${ tabCount }-tabs wwx-active-tab-${ currentTab } wwx-tabs-layout-${ layoutClass } wwx-tabs-block wwx-tabs-tablet-layout-${ tabLayoutClass } wwx-tabs-mobile-layout-${ mobileLayoutClass } wwx-tab-alignment-${ tabAlignment }`;

	const mLayoutOptions = [
		{ key: 'tabs', name: __( 'Tabs' ), icon: 'welcome-widgets-menus' },
		{ key: 'vtabs', name: __( 'Vertical Tabs' ), icon: 'welcome-widgets-menus' },
		{ key: 'accordion', name: __( 'Accordion' ), icon: 'welcome-widgets-menus' },
	];

	const layoutOptions = [
		{ key: 'tabs', name: __( 'Tabs' ), icon: 'welcome-widgets-menus' },
		{ key: 'vtabs', name: __( 'Vertical Tabs' ), icon: 'welcome-widgets-menus' },
	];

	const mobileControls = (
		<div>
			<PanelBody>
				<p className="components-base-control__label">{ __( 'Mobile Layout' ) }</p>
				<ButtonGroup aria-label={ __( 'Mobile Layout' ) }>
					{ map( mLayoutOptions, ( { name, key, icon } ) => (
						<Tooltip text={ name }>
							<Button
								key={ key }
								className="wwx-layout-btn wwx-tablayout"
								isSmall
								isPrimary={ mobileLayout === key }
								aria-pressed={ mobileLayout === key }
								onClick={ () => setAttributes( { mobileLayout: key } ) }
							>
								{ name }
							</Button>
						</Tooltip>
					) ) }
				</ButtonGroup>
			</PanelBody>
		</div>
	);

	const tabletControls = (
		<PanelBody>
			<p className="components-base-control__label">{ __( 'Tablet Layout' ) }</p>
			<ButtonGroup aria-label={ __( 'Tablet Layout' ) }>
				{ map( mLayoutOptions, ( { name, key, icon } ) => (
					<Tooltip text={ name }>
						<Button
							key={ key }
							className="wwx-layout-btn wwx-tablayout"
							isSmall
							isPrimary={ tabletLayout === key }
							aria-pressed={ tabletLayout === key }
							onClick={ () => setAttributes( { tabletLayout: key } ) }
						>
							{ name }
						</Button>
					</Tooltip>
				) ) }
			</ButtonGroup>
		</PanelBody>
	);

	const deskControls = (
		<Fragment>
			<PanelBody>
				<p className="components-base-control__label">{ __( 'Layout' ) }</p>
				<ButtonGroup aria-label={ __( 'Layout' ) }>
					{ map( layoutOptions, ( { name, key, icon } ) => (
						<Tooltip text={ name }>
							<Button
								key={ key }
								className="wwx-layout-btn wwx-tablayout"
								isSmall
								isPrimary={ layout === key }
								aria-pressed={ layout === key }
								onClick={ () => {
									setAttributes( {
										layout: key,
									} );
								} }
							>
								{ name }
							</Button>
						</Tooltip>
					) ) }
				</ButtonGroup>
				<h2>{ __( 'Set initial Open Tab' ) }</h2>
				<ButtonGroup aria-label={ __( 'initial Open Tab' ) }>
					{ times( tabCount, n => (
						<Button
							key={ n + 1 }
							className="wwx-init-open-tab"
							isSmall
							isPrimary={ startTab === n + 1 }
							aria-pressed={ startTab === n + 1 }
							onClick={ () => setAttributes( { startTab: n + 1 } ) }
						>
							{ __( 'Tab' ) + ' ' + ( n + 1 ) }
						</Button>
					) ) }
				</ButtonGroup>
			</PanelBody>
		</Fragment>
	);

	const tabControls = (
		<TabPanel className="wwx-inspect-tabs"
			activeClass="active-tab"
			tabs={ [
				{
					name: 'desk',
					title: <Dashicon icon="desktop" />,
					className: 'wwx-desk-tab',
				},
				{
					name: 'tablet',
					title: <Dashicon icon="tablet" />,
					className: 'wwx-tablet-tab',
				},
				{
					name: 'mobile',
					title: <Dashicon icon="smartphone" />,
					className: 'wwx-mobile-tab',
				},
			] }>
			{
				( tab ) => {
					let tabout;
					if ( tab.name ) {
						if ( 'mobile' === tab.name ) {
							tabout = mobileControls;
						} else if ( 'tablet' === tab.name ) {
							tabout = tabletControls;
						} else {
							tabout = deskControls;
						}
					}
					return <div>{ tabout }</div>;
				}
			}
		</TabPanel>
	);

    const blockProps = useBlockProps({
        className: `wwx-tabs-wrap ${tabsColorClass} ${tabsBackgroundClass} wwx-tabs-id${uniqueID} wwx-tabs-has-${tabCount}-tabs wwx-active-tab-${currentTab} wwx-tabs-layout-${layoutClass} wwx-tabs-block wwx-tabs-tablet-layout-${tabLayoutClass} wwx-tabs-mobile-layout-${mobileLayoutClass} wwx-tab-alignment-${tabAlignment}`,
    });

    const renderTitles = (index) => {
        return (
            <Fragment>
                <li className={`wwx-title-item wwx-title-item-${index}  wwx-tab-title-${(1 + index === currentTab ? 'active' : 'inactive')}`}>
                    <div className={`wwx-tab-title wwx-tab-title-${1 + index}`} onClick={() => setAttributes({ currentTab: 1 + index })} onKeyPress={() => setAttributes({ currentTab: 1 + index })} tabIndex="0" role="button">
                        <RichText
                            tagName="div"
                            placeholder={__('Tab Title')}
                            value={(titles[index] && titles[index].text ? titles[index].text : '')}
                            unstableOnFocus={() => setAttributes({ currentTab: 1 + index })}
                            onChange={value => {
                                saveArrayUpdate({ text: value }, index);
                            }}
                            formattingControls={['bold', 'italic', 'strikethrough']}
                            allowedFormats={['core/bold', 'core/italic', 'core/strikethrough']}
                            className={'wwx-title-text'}
                            keepPlaceholderOnFocus
                        />
                    </div>
                    <div className="tabs-blocks-tab-item__control-menu">
                        {index !== 0 && (
                            <Button
                                icon={('vtabs' === layout ? 'arrow-up' : 'arrow-left')}
                                onClick={index === 0 ? undefined : onMoveBack(index)}
                                className="tabs-blocks-tab-item__move-back"
                                label={('vtabs' === layout ? __('Move Item Up') : __('Move Item Back'))}
                                aria-disabled={index === 0}
                                disabled={index === 0}
                            />
                        )}
                        {(index + 1) !== tabCount && (
                            <Button
                                icon={('vtabs' === layout ? 'arrow-down' : 'arrow-right')}
                                onClick={(index + 1) === tabCount ? undefined : onMoveForward(index)}
                                className="tabs-blocks-tab-item__move-forward"
                                label={('vtabs' === layout ? __('Move Item Down') : __('Move Item Forward'))}
                                aria-disabled={(index + 1) === tabCount}
                                disabled={(index + 1) === tabCount}
                            />
                        )}
                        {tabCount > 1 && (
                            <Button
                                icon="no-alt"
                                onClick={() => {
                                    const removeClientId = tabsBlock.innerBlocks[index].clientId;
                                    const currentItems = filter(titles, (item, i) => index !== i);
                                    const newCount = tabCount - 1;
                                    let newStartTab;
                                    if (startTab === (index + 1)) {
                                        newStartTab = '';
                                    } else if (startTab > (index + 1)) {
                                        newStartTab = startTab - 1;
                                    } else {
                                        newStartTab = startTab;
                                    }
                                    setAttributes({ titles: currentItems, tabCount: newCount, currentTab: (index === 0 ? 1 : index), startTab: newStartTab });
                                    removeTab(removeClientId);
                                    resetOrder();
                                }}
                                className="tabs-blocks-tab-item__remove"
                                label={__('Remove Item')}
                                disabled={!currentTab === (index + 1)}
                            />
                        )}
                    </div>
                </li>
            </Fragment>
        );
    };

    const renderPreviewArray = (
        <Fragment>
            {times(tabCount, n => renderTitles(n))}
        </Fragment>
    );

    const renderAnchorSettings = (index) => {
        return (
            <PanelBody
                title={__('Tab') + ' ' + (index + 1) + ' ' + __('Anchor')}
                initialOpen={false}
            >
                <TextControl
                    label={__('HTML Anchor')}
                    help={__('Anchors lets you link directly to a tab.')}
                    value={titles[index] && titles[index].anchor ? titles[index].anchor : ''}
                    onChange={(nextValue) => {
                        nextValue = nextValue.replace(ANCHOR_REGEX, '-');
                        saveArrayUpdate({ anchor: nextValue }, index);
                    }} />
            </PanelBody>
        );
    };

    const renderTitleSettings = (index) => {
        return (
            <PanelBody
                title={__('Tab') + ' ' + (index + 1) + ' ' + __('Icon')}
                initialOpen={false}
            >
                Text
            </PanelBody>
        );
    };

    return (
        <Fragment>
            <BlockControls>
                <BlockAlignmentToolbar
                    value={blockAlignment}
                    controls={['center', 'wide', 'full']}
                    onChange={value => setAttributes({ blockAlignment: value })}
                />
                <AlignmentToolbar
                    label={__('Change Tabs Titles Alignment')}
                    value={tabAlignment}
                    onChange={(nextAlign) => {
                        setAttributes({ tabAlignment: nextAlign });
                    }}
                />
            </BlockControls>
            {showSettings('allSettings') && (
                <InspectorControls>
                    {showSettings('tabLayout') && (
                        tabControls
                    )}
                    {!showSettings('tabLayout') && (
                        <PanelBody>
                            <h2>{__('Set Initial Open Tab')}</h2>
                            <ButtonGroup aria-label={__('Initial Open Tab')}>
                                {times(tabCount, n => (
                                    <Button
                                        key={n + 1}
                                        className="wwx-init-open-tab"
                                        isSmall
                                        isPrimary={startTab === n + 1}
                                        aria-pressed={startTab === n + 1}
                                        onClick={() => setAttributes({ startTab: n + 1 })}
                                    >
                                        {__('Tab') + ' ' + (n + 1)}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </PanelBody>
                    )}
                    {showSettings('titleAnchor') && (
                        <PanelBody
                            title={__('Tab Anchor Settings')}
                            initialOpen={false}
                        >
                            {times(tabCount, n => renderAnchorSettings(n))}
                        </PanelBody>
                    )}
                    {showSettings('colors') && (
                        <PanelColorSettings
                            title={__('Color Settings')}
                            initialOpen={false}
                            colorSettings={[
                                {
                                    value: tabsColor.color,
                                    onChange: setTabsColor,
                                    label: 'Text color'
                                },
                                {
                                    value: tabsBackground.color,
                                    onChange: setTabsBackground,
                                    label: 'Background color'
                                }
                            ]}
                        />
                    )}
                </InspectorControls>
            )}
            <div {...blockProps}>
                {showPreset && (
                    <div className="wwx-select-starter-style-tabs">
                        <div className="wwx-select-starter-style-tabs-title">
                            {__('Select Initial Style')}
                        </div>
                        <ButtonGroup className="wwx-init-tabs-btn-group" aria-label={__('Initial Style')}>
                            {map(startlayoutOptions, ({ name, key, icon }) => (
                                <Button
                                    key={key}
                                    className="wwx-inital-tabs-style-btn"
                                    isSmall
                                    onClick={() => {
                                        setInitalLayout(key);
                                        setShowPreset(false);
                                    }}
                                >
                                    {icon}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                )}
                {!showPreset && (
                    <div className="wwx-tabs-wrap">
                        <ul className={`wwx-tabs-title-list`}>
                            {renderPreviewArray}
                            <li>
                                <div className="kb-add-new-tab-contain">
                                    <Button
                                        className="wwx-tab-add"
                                        onClick={() => {
                                            const newBlock = createBlock('wwx/tab', { id: tabCount + 1 });
                                            setAttributes({ tabCount: tabCount + 1 });
                                            insertTab(newBlock);
                                            const newtabs = titles;
                                            newtabs.push({
                                                text: sprintf(__('Tab %d'), tabCount + 1),
                                            });
                                            setAttributes({ titles: newtabs });
                                        }}
                                    >
                                        <Dashicon icon="plus" />
                                        {__('Add Tab')}
                                    </Button>
                                </div>
                            </li>
                        </ul>
                        <div className="wwx-tabs-content-wrap">
                            <InnerBlocks
                                template={getPanesTemplate(tabCount)}
                                templateLock={false}
                                allowedBlocks={ALLOWED_BLOCKS} />
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default compose([
    withSelect((select, ownProps) => {
        const { clientId } = ownProps;
        const { getBlock, getBlockOrder } = select('core/block-editor');
        const block = getBlock(clientId);
        return {
            tabsBlock: block,
            realTabsCount: block.innerBlocks.length,
            tabsInner: getBlockOrder(clientId),
        };
    }),
    withDispatch((dispatch, { clientId }, { select }) => {
        const { getBlock } = select('core/block-editor');
        const { moveBlockToPosition, removeBlock, updateBlockAttributes, insertBlock } = dispatch('core/block-editor');
        const block = getBlock(clientId);
        return {
            resetOrder() {
                times(block.innerBlocks.length, n => {
                    updateBlockAttributes(block.innerBlocks[n].clientId, {
                        id: n + 1,
                    });
                });
            },
            moveTab(tabId, newIndex) {
                moveBlockToPosition(tabId, clientId, clientId, parseInt(newIndex));
            },
            insertTab(newBlock) {
                insertBlock(newBlock, parseInt(block.innerBlocks.length), clientId);
            },
            removeTab(tabId) {
                removeBlock(tabId);
            },
        };
    }),
])(Tabs);