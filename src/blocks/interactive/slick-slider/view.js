/**
 * WordPress dependencies
 */
import { getElement, store, getContext, useState, useEffect } from '@wordpress/interactivity';

store( 'slick-slider-block', {
	callbacks: {
		slickSlider: () => {
			// console.log('slickSlider');
		},
	},
} );
