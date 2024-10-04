import { getElement, store, getContext } from '@wordpress/interactivity';

store( 'image-tooltips', {
	actions: {
		toggleEnter: () => {
			const context = getContext();
			const tooltipEle = getElement( context );
			tooltipEle.ref.parentElement.querySelector('.tooltip').classList.add('active');
		},
		toggleLeave: () => {
			const context = getContext();
			const tooltipEle = getElement( context );
			tooltipEle.ref.parentElement.querySelector('.tooltip').classList.remove('active');
		}
	},
} );
