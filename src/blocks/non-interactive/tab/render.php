<?php
    // Attributes 
    $id = $attributes['id'] ?? 1;
    $uniqueID = $attributes['uniqueID'];

    // Inner Blocks
    $inner_blocks = $block->inner_blocks;
    $inner_blocks_html = '';
    foreach ($inner_blocks as $inner_block) {
        $inner_blocks_html .= $inner_block->render();
    }
    // Generate unique id for aria-controls.
    $unique_id = wp_unique_id( 'p-' );

    $wrapper_attributes = get_block_wrapper_attributes(
        array(
        'class' => 'wwx-tab-inner-content wwx-inner-tab-' . $id . ' wwx-inner-tab' . $uniqueID,
        )
    );

?>

<div <?php echo $wrapper_attributes; ?>>
    <?php echo $inner_blocks_html; ?>
</div>