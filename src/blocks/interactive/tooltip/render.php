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

$wrapper_attributes = get_block_wrapper_attributes();

$tooltipsImage = $attributes['tooltipsImage'];
$tooltips = $attributes['tooltips'];

?>

<div 
    <?php echo $wrapper_attributes; ?>
    data-wp-interactive="image-tooltips" >

    <div class="wp-block-group pulsing-tooltip-wrapper">
        <div class="wp-block-group__inner-container is-layout-constrained wp-block-group-is-layout-constrained">
        
            <?php if ($tooltipsImage) : ?>
                <div class="wp-block-image">
                    <figure class="aligncenter size-full is-resized">
                        <picture>
                            <img loading="lazy" decoding="async" src="<?php echo esc_url($tooltipsImage); ?>" alt="">
                        </picture>
                    </figure>
                </div>
            <?php endif; ?>

            <?php if ($tooltips) : ?>
                <?php foreach ($tooltips as $tooltip) : ?>
                    <?php 
                    $topPosition = $tooltip['topPosition'];
                    $leftPosition = $tooltip['leftPosition'];
                    ?>
                    <div class="wp-block-group pulsing-tooltip" style="<?php echo $topPosition ? 'top: ' . $topPosition . ';' : ''; ?><?php echo $leftPosition ? 'left: ' . $leftPosition . ';' : ''; ?>">
                        <div class="wp-block-group__inner-container is-layout-constrained wp-block-group-is-layout-constrained">
                            <div class="tooltip-icon"></div>
                            <p class="tooltip"><?php echo esc_html($tooltip['text']); ?></p>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
            
        </div>
    </div>
    
</div>