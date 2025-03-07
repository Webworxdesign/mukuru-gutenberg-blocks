<?php
/**
 * Plugin Name:       Mukuru Gutenberg Blocks
 * Description:       An interactive block with the Interactivity API
 * Version:           0.1.0
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mukuru-gutenberg-blocks
 *
 * @package           wwx
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
// function create_block_mukuru_gutenberg_blocks_block_init() {
// 	register_block_type_from_metadata( __DIR__ . '/build' );
// }
// add_action( 'init', 'create_block_mukuru_gutenberg_blocks_block_init' );
add_action( 'init', 'auto_register_mukuru_block_types' );

/**
 * Auto register all blocks found in the `build/blocks` folder.
 */
function auto_register_mukuru_block_types() {
	if ( file_exists( __DIR__ . '/build/blocks/' ) ) {
		$interactive_block_json_files     = glob( __DIR__ . '/build/blocks/interactive/*/block.json' );
		$non_interactive_block_json_files = glob( __DIR__ . '/build/blocks/non-interactive/*/block.json' );
		$block_json_files                 = array_merge( $interactive_block_json_files, $non_interactive_block_json_files );

		// auto register all blocks that were found.
		foreach ( $block_json_files as $filename ) {
			$block_folder = dirname( $filename );
			register_block_type( $block_folder );
		};
	};
}

/**
 * Add slick slider scripts and style.
 */
function slick_slider_scripts_styles() {
	if ( ! is_admin() ) {
		wp_enqueue_script( 
			'slick-slider-block-script', 
			plugin_dir_url( __DIR__ ) . 'mukuru-gutenberg-blocks/vendor/slick/slick.min.js',
			array(), 
			null,
			true
		);
		wp_enqueue_style( 
			'slick-slider-block-style', 
			plugin_dir_url( __DIR__ ) . 'mukuru-gutenberg-blocks/vendor/slick/slick.min.css' 
		);
		wp_enqueue_style( 
			'slick-slider-block-theme-style', 
			plugin_dir_url( __DIR__ ) . 'mukuru-gutenberg-blocks/vendor/slick/slick-theme.css' 
		);
		wp_enqueue_script( 
			'slick-slider-block-init', 
			plugin_dir_url( __DIR__ ) . 'mukuru-gutenberg-blocks/vendor/slick/init.js',
			array(), 
			null,
			true
		);
	}
}
add_action( 'enqueue_block_assets', 'slick_slider_scripts_styles' );

function calculator_callback() {  
	
    //Get Country List from api    
    if( isset($_POST['selected_code']) && $_POST['payout_countries_ajax'] ) {
        $payout_countries_get = json_decode(file_get_contents(__DIR__ . '/payout-countries.json'));
        $receive_countries = $payout_countries_get->{$_POST['selected_code']}; 
        $payoutData = array();
        
        //Collect data we want to return as ajax response
        foreach($receive_countries->items as $key => $country) {
            $payoutData[$country->name] = array(
                "payInCountryCode" => $country->code, 
                "payOutCurrencyCode" => $country->baseCurrencyCode, 
                "payInCurrencyCode" => $pay_in_currency[0], 
                "payOutCountryCode" => $country->code
            );
        }
       echo json_encode($payoutData);    
    } else {
        $payout_countries_get = json_decode(file_get_contents(__DIR__ . '/payout-countries.json'));
        $receive_countries = $payout_countries_get->{$pay_in_currency[0]};    
		
		echo json_encode($receive_countries);
    }

	wp_die();
}

add_action( 'wp_ajax_calculator_callback', 'calculator_callback' );
add_action( 'wp_ajax_nopriv_calculator_callback', 'calculator_callback' );

function calculator_product_callback() {
	if (isset($_POST['in_code']) && isset($_POST['out_code'])) {
		$productUrl = 'https://api.mukuru.com/taurus/v1/products/price-check?pay_out_country=' . sanitize_text_field($_POST['out_code']) . '&pay_in_country=' . sanitize_text_field($_POST['in_code']);
		
		// Generate a unique cache key based on the request parameters
		$cache_key = 'mukuru_product_' . md5($productUrl);
		$cached_response = get_transient($cache_key);

		if ($cached_response !== false) {
			echo $cached_response;
			wp_die();
		}

		$productResponse = wp_remote_get($productUrl);
		if (is_wp_error($productResponse)) {
			echo json_encode(array('error' => 'Request failed'));
			wp_die();
		}

		$productBody = wp_remote_retrieve_body($productResponse);

		// Cache the response for 1 hour
		set_transient($cache_key, $productBody, HOUR_IN_SECONDS);

		echo $productBody;
	}
	wp_die();
}
add_action('wp_ajax_calculator_product_callback', 'calculator_product_callback');
add_action('wp_ajax_nopriv_calculator_product_callback', 'calculator_product_callback');

function mukuru_get_calc(){
	$inCode = isset($_POST['inCode']) ? sanitize_text_field($_POST['inCode']) : '';
	$inCurrency = isset($_POST['inCurrency']) ? sanitize_text_field($_POST['inCurrency']) : '';
	$inAmount = isset($_POST['inAmount']) ? sanitize_text_field($_POST['inAmount']) : '';
	$OutCode = isset($_POST['OutCode']) ? sanitize_text_field($_POST['OutCode']) : '';
	$OutCurrency = isset($_POST['OutCurrency']) ? sanitize_text_field($_POST['OutCurrency']) : '';
	$payOutType = isset($_POST['payOutType']) ? sanitize_text_field($_POST['payOutType']) : '';
	$payingIn = isset($_POST['payingIn']) ? sanitize_text_field($_POST['payingIn']) : '';

	if ($payingIn == 'true') {
		$url = 'https://api.mukuru.com/taurus/v1/products/price-check?pay_in_country='.$inCode.'&pay_out_country='.$OutCode.'&pay_in_currency='.$inCurrency.'&pay_in_amount='.$inAmount.'&pay_out_currency='.$OutCurrency.'&type='.$payOutType;
	} elseif ($payingIn == 'false') {
		$url = 'https://api.mukuru.com/taurus/v1/products/price-check?pay_in_country='.$inCode.'&pay_out_country='.$OutCode.'&pay_out_amount='.$inAmount.'&pay_out_currency='.$OutCurrency.'&type='.$payOutType;
	} else {
		$url = 'https://api.mukuru.com/taurus/v1/products/price-check?pay_in_country='.$inCode.'&pay_out_country='.$OutCode.'&pay_in_currency='.$inCurrency.'&pay_in_amount='.$inAmount.'&type='.$payOutType;
	}

	// Generate a unique cache key based on the request parameters
	$cache_key = 'mukuru_calc_' . md5($url);
	$cached_response = get_transient($cache_key);

	if ($cached_response !== false) {
		echo $cached_response;
		wp_die();
	}

	$response = wp_remote_get($url);
	if (is_wp_error($response)) {
		echo json_encode(array('error' => 'Request failed'));
		wp_die();
	}

	$body = wp_remote_retrieve_body($response);

	// Cache the response for 1 hour
	set_transient($cache_key, $body, HOUR_IN_SECONDS);

	echo $body;
	wp_die();
}

add_action( 'wp_ajax_mukuru_get_calc', 'mukuru_get_calc' );
add_action( 'wp_ajax_nopriv_mukuru_get_calc', 'mukuru_get_calc' );