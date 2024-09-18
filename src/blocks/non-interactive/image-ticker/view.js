/**
 * WordPress dependencies
 */
import { getElement, store, getContext } from '@wordpress/interactivity';

store( 'image-ticker', {
	callbacks: {
		imageTickerInit: () => {
			
			const { ref } = getElement();

			// find images in the ref and add class skip-lazy
			const images = ref.querySelectorAll('img');
			images.forEach(image => {
				image.classList.add('skip-lazy');
			});
		},
	},
} );
