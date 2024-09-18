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
$unique_id = wp_unique_id( 'p-' );

// loop through the attributes and create a string of classes
$attributes_classes = '';
foreach ($attributes as $key => $value) {
    if($key === 'slickOptions') {
        continue;
    }
    $attributes_classes .= ' ' . $value;
}

// Convert the slickOptions array to a JSON string
$slick_options_json = json_encode($attributes['slickOptions']);

// Render inner blocks
$inner_blocks = $block->inner_blocks;
$inner_blocks_html = '';
foreach ($inner_blocks as $inner_block) {
    $inner_blocks_html .= $inner_block->render();
}
?>

<div 
	<?php echo get_block_wrapper_attributes(); ?> 
	data-slick='<?php echo esc_attr($slick_options_json); ?>' > 
	<?php echo $inner_blocks_html; ?>
</div>
