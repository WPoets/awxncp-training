<?php
/**
 * Plugin Name: Minimal Awesome FAQ Pattern
 * Description: Minimal pattern registration for testing
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the minimal FAQ pattern block
 */
function minimal_awesome_faq_register() {
    // Register scripts and styles
    wp_register_script(
        'awesome-faq-editor-script',
        plugins_url('faq-block.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n', 'wp-block-editor'),
        time()
    );

    // Register the custom block
    register_block_type('awesome-patterns/faq-container', array(
        'editor_script' => 'awesome-faq-editor-script',
        'render_callback' => 'minimal_awesome_faq_render',
        'attributes' => array(), // No attributes needed for this test
    ));

    // Register the pattern
    if (function_exists('register_block_pattern')) {
        // Register pattern category if not exists
        if (function_exists('register_block_pattern_category')) {
            register_block_pattern_category('awesome-patterns', array(
                'label' => __('Awesome Enterprise Patterns', 'awesome-patterns')
            ));
        }

        // Register the FAQ pattern
        register_block_pattern('awesome-patterns/faq', array(
            'title' => __('FAQ Pattern', 'awesome-patterns'),
            'description' => __('A pattern for creating FAQ sections', 'awesome-patterns'),
            'categories' => array('awesome-patterns'),
            'content' => '<!-- wp:awesome-patterns/faq-container -->
<div class="wp-block-awesome-patterns-faq-container">
    <!-- wp:heading {"level":2,"className":"awesome-ignore"} -->
    <h2 class="wp-block-heading awesome-ignore">Frequently Asked Questions</h2>
    <!-- /wp:heading -->
    <!-- wp:paragraph {"className":"awesome-ignore"} -->
    <p class="awesome-ignore">This is where FAQ content will go</p>
    <!-- /wp:paragraph -->
</div>
<!-- /wp:awesome-patterns/faq-container -->',
        ));
    }
}
add_action('init', 'minimal_awesome_faq_register');

/**
 * Server-side rendering for the faq-container block
 */
function minimal_awesome_faq_render($attributes, $content, $block) {
    // Don't render in the editor/REST API
    if (defined('REST_REQUEST') && REST_REQUEST) {
        return '<div class="wp-block-awesome-patterns-faq-container">' . $content . '</div>';
    }
    
    try {
       // \util::var_dump($content);
       // gives a critical error \util::var_dump($block);
       //var_dump($block);
      // \util::var_dump($block->parsed_block['innerBlocks']);
      // \util::var_dump($attributes);
        return $content;
    } catch (Exception $e) {
        return '<div class="wp-block-awesome-patterns-faq-container error">' . esc_html($e->getMessage()) . '</div>';
    }
}

