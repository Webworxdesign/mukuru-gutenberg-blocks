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