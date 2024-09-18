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

$wrapper_attributes = get_block_wrapper_attributes(
    array(
      'class' => $attributes['dropdownType'], 
    )
);
?>

<div 
    <?php echo $wrapper_attributes; ?>
    data-wp-interactive="services-dropdown"
    <?php echo wp_interactivity_data_wp_context( array( 'isOpen' => false, 'dropDownHeight' => '0px' ) ); ?>
    data-wp-watch="callbacks.dropdownIsOpen" >

    <div class="services-dropdown <?php echo $attributes['dropdownType']; ?>">
        <div class="service-dropdown-selector" style="background-color: <?php echo $attributes['dropdownBackground']; ?>; border-color: <?php echo $attributes['dropdownBackground']; ?>" data-wp-on--click="actions.toggle" data-wp-bind--aria-expanded="context.isOpen">
            <span><?php echo $attributes['dropdownPlaceholder']; ?></span>
            <span class="divider"></span>
            <svg width="20" height="10" viewBox="0 0 27 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.0044 14.1119C13.0044 14.1119 14.2532 14.6328 14.6695 14.1119L26.7417 2.02677C26.7417 2.02677 27.2621 0.77652 26.7417 0.359782C26.2214 -0.0569567 25.4929 -0.161141 25.0766 0.359782L13.8368 11.6116L2.59731 0.359782C2.59731 0.359782 1.34843 -0.161141 0.932149 0.359782C0.515867 0.880705 0.411797 1.61004 0.932149 2.02677L13.0044 14.1119Z" fill="#A5A5A5"/>
            </svg>
            <?php if ( ! empty( $attributes['services'] ) ) : ?>
        <div class="services-list" data-wp-run="callbacks.serviceList" data-wp-class--show-dropdown="context.isOpen" data-wp-style--height="context.dropDownHeight" >
            <?php foreach ( $attributes['services'] as $service ) : ?>
                <div class="service-item">
                    
                    <?php 

                    echo '<a href="' . esc_url( $service['link'] ) . '" target="_blank" class="service-link">';

                    echo '<div class="service-fields">';
                        
                        if ( ! empty( $service['image'] ) ) : 
                            echo '<div class="service-icon">';
                            // echo '<div class="service-icon__image" style="background-image: url(' . esc_url( $service['image'] ) . ');"></div>';
                            echo '<div class="service-icon__image">' . file_get_contents( $service['image'] ) . '</div>';
                            echo '</div>';
                        endif; 
                        
                        echo '<div class="title-description">';
                        if ( ! empty( $service['title'] ) ) : 
                            echo '<div class="title-plain-text">' . esc_html( $service['title'] ) .' </div>';
                        endif;
                        if ( ! empty( $service['description'] ) ) : 
                            echo '<div class="description-plain-text">' . esc_html( $service['description'] ) . '</div>';
                        endif;
                        echo '</div>';

                    echo '</div>';

                    echo '</a>'; // Ensure this closing tag is present
                    ?>

                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
        </div>
        <div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
            <div class="wp-block-button">
                <a class="wp-block-button__link wp-element-button" href="<?php echo $attributes['bookServiceLink']; ?>" target="_blank">Book a Service</a>
            </div>
            <?php if($attributes['dropdownType'] == 'seperated') { ?>
                <div class="wp-block-button is-style-outline">
                    <a class="wp-block-button__link wp-element-button" href="<?php echo $attributes['applyForWorkLink']; ?>" target="_blank">Apply for Work</a>
                </div>
            <?php } ?>
        </div>
    </div>
    <a data-wp-on-document--click="callbacks.logClick"></a>
    
</div>