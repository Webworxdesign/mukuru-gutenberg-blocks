import { getElement, store, getContext, useState, useEffect } from '@wordpress/interactivity';

const useEleHeight = () => {
	const [ EleHeight, setEleHeight ] = useState( '' );
	useEffect( () => {
		const { ref } = getElement();
		setEleHeight( ref.scrollHeight );
	}, []);
	return EleHeight;
};


store( 'services-dropdown', {
	actions: {
		toggle: () => {
			const context = getContext();
			context.isOpen = ! context.isOpen;
		},
	},
	callbacks: {
		logIsOpen: () => {
			const { isOpen } = getContext();
		},
		serviceList: () => { 
			const context = getContext();
			const isOpen = context.isOpen; // Ensure `isOpen` is retrieved correctly
			const isEleHeight = useEleHeight();

			if (isOpen) {
				context.dropDownHeight = `${isEleHeight}px`; // Ensure height is set as a string with 'px'
			} else {
				context.dropDownHeight = '0px';
			}
		},
		logClick(event) {
			if ( !event.target.closest('.wp-block-wwx-services-dropdown') ) {
				const context = getContext();
				context.isOpen = false;
			}
        },
	},
} );
