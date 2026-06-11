<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Generate unique id for scoped styles.
$unique_id = wp_unique_id( 'custom-ticker-' );

$ticker_speed   = ( isset( $attributes['tickerSpeed'] ) && $attributes['tickerSpeed'] !== '' ) ? $attributes['tickerSpeed'] : '45';
$ticker_spacing = ( isset( $attributes['tickerSpacing'] ) && $attributes['tickerSpacing'] !== '' ) ? $attributes['tickerSpacing'] : '40';
$pause_on_hover = ! empty( $attributes['pauseOnHover'] );

// Render inner blocks
$inner_blocks_html = '';
foreach ( $block->inner_blocks as $inner_block ) {
	$rendered = $inner_block->render();
	$rendered = str_replace( '<img', '<img class="skip-lazy"', $rendered );
	$inner_blocks_html .= $rendered;
}

?>

<div 
  id="<?php echo esc_attr( $unique_id ); ?>"
	<?php echo get_block_wrapper_attributes( array( 'class' => 'is-initializing' ) ); ?>
>
	<div class="ticker-track">
		<div class="track">
			<div class="track-set"><?php echo $inner_blocks_html; ?></div>
			<div class="track-set"><?php echo $inner_blocks_html; ?></div> 
		</div>
	</div>
	<style>
		#<?php echo esc_attr( $unique_id ); ?> .ticker-track .track {
			animation-duration: <?php echo esc_html( $ticker_speed ); ?>s;
		}
		#<?php echo esc_attr( $unique_id ); ?> .ticker-track .track-set {
			gap: <?php echo esc_html( $ticker_spacing ); ?>px;
			padding-right: <?php echo esc_html( $ticker_spacing ); ?>px;
		}
		<?php if ( $pause_on_hover ) : ?>
		#<?php echo esc_attr( $unique_id ); ?> .ticker-track:hover .track {
			animation-play-state: paused;
		}
		<?php endif; ?>
	</style>
</div>
