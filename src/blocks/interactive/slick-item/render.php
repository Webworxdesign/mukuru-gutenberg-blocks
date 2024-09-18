<?php
$inner_blocks = $block->inner_blocks;
$inner_blocks_html = '';
foreach ($inner_blocks as $inner_block) {
    $inner_blocks_html .= $inner_block->render();
}

?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <?php echo $inner_blocks_html; ?>
</div>