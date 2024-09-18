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

// Generate unique id for aria-controls.
$unique_id = wp_unique_id( 'image-ticker-' );

// Render inner blocks
$inner_blocks = $block->inner_blocks;
$inner_blocks_html = '';
foreach ($inner_blocks as $inner_block) {
    $inner_blocks_html .= $inner_block->render();
    // echo '<pre>' . print_r($inner_blocks_html, true) . '</pre>';
    // add a class to the $inner_blocks_html images
    $inner_blocks_html = str_replace('<img', '<img class="skip-lazy"', $inner_blocks_html);

    
}
?>

<div 
  id="<?php echo $unique_id; ?>"
  <?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="image-ticker" 
  <?php echo wp_interactivity_data_wp_context( array( 'id' => $unique_id ) ); ?> > 
    <div class="ticker-track">
      <?php echo '<div class="ticker-track-list" data-wp-init="callbacks.imageTickerInit">' . $inner_blocks_html . '</div>'; ?>
      <?php echo '<div class="ticker-track-list" data-wp-init="callbacks.imageTickerInit">' . $inner_blocks_html . '</div>'; ?>
    </div>
    <style>
      <?php 
        echo '#'.$unique_id. ' .ticker-track .ticker-track-list {';
        echo 'animation-duration: ' . ($attributes['tickerSpeed'] != '' ? $attributes['tickerSpeed'] : '10') . 's;';
        echo '}';
        if ($attributes['pauseOnHover']) {
          echo '#'.$unique_id. ' .ticker-track:hover .ticker-track-list {';
          echo 'animation-play-state: paused;';
          echo '}';
        }
      ?>
    </style>
</div>
