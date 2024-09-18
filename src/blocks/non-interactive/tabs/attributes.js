/**
 * BLOCK:  Tabs Attributes
 */
const { __ } = wp.i18n;
const attributes = {
	uniqueID: {
		type: 'string',
		default: '',
	},
	tabCount: {
		type: 'number',
		default: 3,
	},
	layout: {
		type: 'string',
		default: 'tabs',
	},
	mobileLayout: {
		type: 'string',
		default: 'inherit',
	},
	tabletLayout: {
		type: 'string',
		default: 'inherit',
	},
	currentTab: {
		type: 'number',
		default: 1,
	},
	tabAlignment: {
		type: 'string',
		default: 'left',
	},
	blockAlignment: {
		type: 'string',
		default: 'none',
	},
	titles: {
		type: 'array',
		default: [ 
			{
				text: __( 'Tab 1' ),
				anchor: '',
			}, 
			{
				text: __( 'Tab 2' ),
				anchor: '',
			}, 
			{
				text: __( 'Tab 3' ),
				anchor: '',
			} , 
			{
				text: __( 'Tab 4' ),
				anchor: '',
			}, 
			{
				text: __( 'Tab 5' ),
				anchor: '',
			}, 
			{
				text: __( 'Tab 6' ),
				anchor: '',
			}, 
			{
				text: __( 'Tab 7' ),
				anchor: '',
			}, 
			{
				text: __( 'Tab 8' ),
				anchor: '',
			}, 
			{
				text: __( 'Tab 9' ),
				anchor: '',
			}, 
			{
				text: __( 'Tab 10' ),
				anchor: '',
			}
		],
	},
	startTab: {
		type: 'number',
		default: '',
	},
	tabsColor: {
		type: 'string'
	},
	customTabsColor: {
		type: 'string',
		default: ""
	},
	tabsBackground: {
		type: 'string',
	},
	customTabsBackground: {
		type: 'string',
		default: ""
	},
};
export default attributes;
