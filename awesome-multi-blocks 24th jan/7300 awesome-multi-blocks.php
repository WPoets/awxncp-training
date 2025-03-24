<?php
/**
 * Plugin Name: Awesome Multi Blocks
 * Description: Dynamic block generator for Awesome Enterprise
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

function awesome_multi_blocks_register() {
    // Register scripts and styles
    wp_register_script(
        'awesome-multi-blocks',
        plugins_url('blocks.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'),
        time()
    );

    wp_register_style(
        'awesome-multi-blocks-editor',
        plugins_url('style.css', __FILE__),
        array(),
        time()
    );

    // Simple block configurations
    $block_configs = array(
        'simple-block-one' => array(
            'name' => 'simple-block-one', 'title' => 'Simple Block One',
            'icon' => 'admin-generic', 'category' => 'widgets',
            'tabs' => array(
                array(
                    'name' => 'basic', 'title' => 'Basic Settings', 'icon' => 'admin-settings',
                    'fields' => array(
                        array('type' => 'title', 'attr_name' => 'tab1.title'),
                        array('type' => 'purpose', 'attr_name' => 'tab1.purpose'),
                        array(
                            'type' => 'query', 'name' => 'tab1-query-field-1', 'label' => 'Query',
                            'attr_name' => 'tab1.query',
                            'validation' => array('required' => true)
                        ),
                        array(
                            'type' => 'service', 'name' => 'tab1-service-text-field-1', 'label' => 'Service',
                            'attr_name' => 'tab1.service',
                            'validation' => array('required' => true)
                        ),
                        array(
                            'type' => 'text', 'name' => 'tab1-text-field-1', 'label' => 'Text Field One',
                            'attr_name' => 'tab1.textfield1',
                            'validation' => array('required' => true)
                        ),
                        array(
                            'type' => 'select', 'name' => 'status-field', 'label' => 'Status',
                            'attr_name' => 'tab1.status', 'default' => 'active',
                            'validation' => array('required' => true),
                            'options' => array(
                                array('label' => 'Active', 'value' => 'active'),
                                array('label' => 'Inactive', 'value' => 'inactive'),
                                array('label' => 'Pending', 'value' => 'pending')
                            )
                        ),
                        array(
                            'type' => 'textarea', 'name' => 'description', 'label' => 'Description',
                            'attr_name' => 'tab1.desc.description'
                        ),
                        array(
                            'type' => 'small-number', 'name' => 'number-field-1', 'label' => 'Number Field One',
                            'attr_name' => 'tab1.numberfield1', 'default' => 0,
                            'validation' => array('required' => true)
                        ),
                        array(
                            'type' => 'toggle', 'name' => 'active-status', 'label' => 'Active Status',
                            'attr_name' => 'tab1.isactive', 'default' => true
                        ),
                        array(
                            'type' => 'innerblocks',
                            'name' => 'content-blocks',
                            'label' => 'Content Blocks',
                            'attr_name' => 'tab1.content',
                            'validation' => array(
                                'required' => false
                            )
                        )
                    )
                ),
                array(
                    'name' => 'additional', 'title' => 'Additional Settings', 'icon' => 'plus',
                    'fields' => array(
                        array(
                            'type' => 'textarea', 'name' => 'notes', 'label' => 'Additional Notes',
                            'attr_name' => 'tab2.notes'
                        ),
                        array(
                            'type' => 'select', 'name' => 'category', 'label' => 'Category',
                            'attr_name' => 'tab2.category', 'default' => 'general',
                            'options' => array(
                                array('label' => 'General', 'value' => 'general'),
                                array('label' => 'Special', 'value' => 'special'),
                                array('label' => 'Other', 'value' => 'other')
                            )
                        ),
                        array(
                            'type' => 'small-number', 'name' => 'order', 'label' => 'Display Order',
                            'attr_name' => 'tab2.order', 'default' => 1
                        ),
                        array(
                            'type' => 'toggle', 'name' => 'notify', 'label' => 'Send Notifications',
                            'attr_name' => 'tab2.sendnotify', 'default' => false
                        )
                    )
                )
            )
        ),
        'user-profile-block' => array(
            'name' => 'user-profile-block', 'title' => 'User Profile Block',
            'icon' => 'admin-users', 'category' => 'widgets',
            'tabs' => array(
                array(
                    'name' => 'profile', 'title' => 'Profile Info', 'icon' => 'admin-users',
                    'fields' => array(
                        array('type' => 'title', 'attr_name' => 'profile.title'),
                        array(
                            'type' => 'text', 'name' => 'full-name', 'label' => 'Full Name',
                            'attr_name' => 'profile.fullname',
                            'validation' => array('required' => true)
                        ),
                        array(
                            'type' => 'text', 'name' => 'email', 'label' => 'Email Address',
                            'attr_name' => 'profile.email',
                            'validation' => array('required' => true)
                        ),
                        array(
                            'type' => 'small-number', 'name' => 'age', 'label' => 'Age',
                            'attr_name' => 'profile.age', 'default' => 18
                        ),
                        array(
                            'type' => 'select', 'name' => 'role', 'label' => 'User Role',
                            'attr_name' => 'profile.role', 'default' => 'user',
                            'options' => array(
                                array('label' => 'Admin', 'value' => 'admin'),
                                array('label' => 'User', 'value' => 'user'),
                                array('label' => 'Guest', 'value' => 'guest')
                            )
                        ),
                        array(
                            'type' => 'textarea', 'name' => 'bio', 'label' => 'Biography',
                            'attr_name' => 'profile.bio'
                        )
                    )
                ),
                array(
                    'name' => 'preferences', 'title' => 'User Preferences', 'icon' => 'admin-settings',
                    'fields' => array(
                        array(
                            'type' => 'toggle', 'name' => 'email-notifications', 'label' => 'Email Notifications',
                            'attr_name' => 'prefs.emailnotify', 'default' => true
                        ),
                        array(
                            'type' => 'select', 'name' => 'theme', 'label' => 'Theme',
                            'attr_name' => 'prefs.theme', 'default' => 'light',
                            'options' => array(
                                array('label' => 'Light', 'value' => 'light'),
                                array('label' => 'Dark', 'value' => 'dark'),
                                array('label' => 'Auto', 'value' => 'auto')
                            )
                        ),
                        array(
                            'type' => 'small-number', 'name' => 'items-per-page', 'label' => 'Items Per Page',
                            'attr_name' => 'prefs.itemsperpage', 'default' => 10
                        )
                    )
                )
            )
        )
    );

    // Function to generate block attributes
    function generate_block_attributes($config) {
        $attributes = array();
        
        foreach ($config['tabs'] as $tab) {
            foreach ($tab['fields'] as $field) {
                // Determine type and default based on field type
                switch ($field['type']) {
                    case 'innerblocks':
                        $type = 'string';  // Store as HTML string
                        $default = '';
                        break;
                    case 'small-number':
                        $type = 'number';
                        $default = isset($field['default']) ? $field['default'] : 0;
                        break;
                    case 'toggle':
                        $type = 'boolean';
                        $default = isset($field['default']) ? $field['default'] : false;
                        break;
                    case 'select':
                        $type = 'string';
                        $default = isset($field['default']) ? $field['default'] : '';
                        break;
                    case 'title':
                        $type = 'string';
                        $default = '';
                        break;
                    case 'purpose':
                        $type = 'string';
                        $default = '';
                        break;
                    case 'textarea':
                    case 'text':
                    case 'query':    // Will fall through to default
                    case 'service':  // Will fall through to default
                    default:
                        $type = 'string';
                        $default = isset($field['default']) ? $field['default'] : '';
                        break;
                }

                $attributes[$field['attr_name']] = array(
                    'type' => $type,
                    'default' => $default
                );
            }
        }
        
        return $attributes;
    }
    // Pass configurations to JavaScript
    wp_localize_script(
        'awesome-multi-blocks',
        'awesomeMultiBlocks',
        array('blockConfigs' => $block_configs)
    );

    // Register each block type
    foreach ($block_configs as $name => $config) {
        register_block_type("awesome-multi-blocks/$name", array(
            'editor_script' => 'awesome-multi-blocks',
            'editor_style'  => 'awesome-multi-blocks-editor',
            'attributes' => generate_block_attributes($config),
            'render_callback' => 'awesome_multi_blocks_render'
        ));
    }
}
add_action('init', 'awesome_multi_blocks_register');

function awesome_multi_blocks_render($attributes,$content) {
    if (defined('REST_REQUEST') && REST_REQUEST) {
        return '<div class="awesome-blocks-placeholder">[Awesome Block]</div>';
    }
    
    try {
        \util::var_dump($attributes);
        \util::var_dump($content);
        return '<div class="awesome-block-render">Block Content Here</div>';
    } catch (Exception $e) {
        return '<div class="awesome-blocks-error">' . esc_html($e->getMessage()) . '</div>';
    }
}