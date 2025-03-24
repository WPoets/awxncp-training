<?php
/**
 * Plugin Name: Awesome Basic Service
 * Description: Basic service block for Awesome Enterprise
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

function awesome_basic_service_register_block() {
    wp_register_script(
        'awesome-basic-service',
        plugins_url('src/blocks.js', __FILE__),
        array(
            'wp-blocks',
            'wp-element',
            'wp-editor',
            'wp-components',
            'wp-i18n'
        ),
        time()
    );

    wp_register_style(
        'awesome-basic-service-editor',
        plugins_url('src/style.css', __FILE__),
        array(),
        time()
    );

    register_block_type('awesome-basic-service/block', array(
        'editor_script' => 'awesome-basic-service',
        'editor_style'  => 'awesome-basic-service-editor',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => ''
            ),
            'purpose' => array(
                'type' => 'string',
                'default' => ''
            ),
            'do' => array(
                'type' => 'object',
                'default' => array(
                    'service' => '',
                    'content' => '',
                    'attributes' => array()
                )
            ),
            'when' => array(
                'type' => 'object',
                'default' => array(
                    'service' => '',
                    'attributes' => array(),
                    'and' => array(
                        'service' => '',
                        'attributes' => array()
                    ),
                    'or' => array(
                        'service' => '',
                        'attributes' => array()
                    )
                )
            ),
            'pipe' => array(
                'type' => 'object',
                'default' => array(
                    'service' => '',
                    'attributes' => array()
                )
            ),
            'pipe_1' => array(
                'type' => 'object',
                'default' => array(
                    'service' => '',
                    'attributes' => array()
                )
            ),
            'out' => array(
                'type' => 'object',
                'default' => array(
                    'service' => '',
                    'attributes' => array()
                )
            ),
            'out_1' => array(
                'type' => 'object',
                'default' => array(
                    'service' => '',
                    'attributes' => array()
                )
            )
        ),
        'render_callback' => 'awesome_basic_service_render'
    ));
}
add_action('init', 'awesome_basic_service_register_block');

function awesome_basic_service_render($attributes) {
    if (defined('REST_REQUEST') && REST_REQUEST) {
        return '<div class="awesome-basic-service-placeholder">[Awesome Basic Service]</div>';
    }

    try {
        \util::var_dump($attributes);
        //return \aw2\parser\parse_array($attributes);
    } catch (Exception $e) {
        return '<div class="awesome-basic-service-error">Error executing service: ' . esc_html($e->getMessage()) . '</div>';
    }
}