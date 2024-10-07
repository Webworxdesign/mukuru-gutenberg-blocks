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

$style = $attributes['style'];
$tooltipsImage = $attributes['tooltipsImage'];
$tooltips = $attributes['tooltips'];

?>

<div 
    <?php echo $wrapper_attributes; ?>
    data-wp-interactive="image-tooltips" >

    <div class="pulsing-tooltip-wrapper <?php echo $style === 'sidebar' ? 'has-sidebar' : ''; ?>">
        
        <?php if ($tooltipsImage) : ?>
            <div class="tooltip-image wp-block-image">
                <figure class="aligncenter size-full is-resized">
                    <picture>
                        <img class="skip-lazy" decoding="async" src="<?php echo esc_url($tooltipsImage); ?>" alt="">
                    </picture>
                </figure>
                
                <!-- Loop through the tooltips and render them -->
                <?php $tooltip_index = 1; ?>
                <?php foreach ($tooltips as $tooltip) : ?>
                    <?php 
                    $topPosition = $tooltip['topPosition'];
                    $leftPosition = $tooltip['leftPosition']; 
                    ?>
                    <div 
                        class="wp-block-group pulsing-tooltip <?php echo $style === 'sidebar' && $tooltip_index === 1 ? 'active' : ''; ?>" 
                        style="<?php echo $topPosition ? 'top: ' . $topPosition . ';' : ''; ?><?php echo $leftPosition ? 'left: ' . $leftPosition . ';' : ''; ?>" 
                        data-wp-on--mouseenter="actions.toggleEnter" 
                        data-wp-on--mouseleave="actions.toggleLeave" 
                        data-tooltip-index="<?php echo $tooltip_index; ?>" >
                        <div class="wp-block-group__inner-container is-layout-constrained wp-block-group-is-layout-constrained">
                            <div class="wp-block-safe-svg-svg-icon safe-svg-cover" style="text-align: left;">
                                <div class="tooltip-icon"></div>
                            </div>
                            <?php if ($style === 'default' ) : ?>
                                <p class="tooltip"><?php echo esc_html($tooltip['text']); ?></p>
                            <?php endif; ?>  
                        </div>
                    </div>
                    <?php $tooltip_index++; ?>
                <?php endforeach; ?>
                
            </div>
        <?php endif; ?>


        <?php if ($tooltips && $style === 'sidebar' ) : ?>
            <div class="sidebar-tooltip">
                <?php $sidebar_tooltip_index = 1; ?>
                <?php foreach ($tooltips as $tooltip) : ?>
                    <?php 
                    $topPosition = $tooltip['topPosition'];
                    $leftPosition = $tooltip['leftPosition']; 
                    ?>
                    <div class="tooltip-sidebar__item">
                        <p class="tooltip <?php if ($sidebar_tooltip_index === 1) { echo 'active'; } ?>" data-wp-on--click="actions.sidebarTooltip" data-sidebar-tooltip-index="<?php echo $sidebar_tooltip_index; ?>"><?php echo esc_html($tooltip['text']); ?></p>
                    </div>
                    <?php $sidebar_tooltip_index++; ?>
                    
                <?php endforeach; ?>
            </div>
        <?php endif; ?>       
    </div>
    
</div>