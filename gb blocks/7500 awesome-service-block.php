<?php
/**
 * Plugin Name: Awesome Service Block
 * Description: Service block generator for Awesome Enterprise
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

    $module='gb_blocks';
    $arr=\aw2_library::get_module(['post_type'=>AWESOME_CORE_POST_TYPE],$module);
    if($arr)\aw2_library::module_run(['post_type'=>AWESOME_CORE_POST_TYPE],$module);
    $block_configs = array();
    $gb_blocks = \aw2_library::get('gb_blocks');
    
    // Check if gb_blocks exists and is an array
    if (!empty($gb_blocks) && is_array($gb_blocks)) {
        foreach ($gb_blocks as $block_name => $gb_block) {
            if (isset($gb_block['config'])) {
                $block_configs[$block_name] = $gb_block['config'];
            }
        }
    }


/*
    // Simple block configurations
    $backup_block_configs = array(
        'cond-block' => array(
            'name' => 'cond-block',
            'title' => 'Conditional Block',
            'icon' => 'admin-generic',
            'category' => 'widgets',
            'tabs' => array(
                array(
                    'name' => 'when-block',
                    'title' => 'When',
                    'icon' => 'filter',
                    'fields' => array(
                        array(
                            'type' => 'text',
                            'name' => 'when-service',
                            'label' => 'When Service',
                            'attr_name' => 'check.service'
                        ),
                        array(
                            'type' => 'attributes-repeater',
                            'name' => 'when-attributes',
                            'label' => 'When Attributes',
                            'attr_name' => 'check.attributes'
                        )
                    )
                ),
                array(
                    'name' => 'then-block',
                    'title' => 'Then',
                    'icon' => 'yes',
                    'fields' => array(
                        array(
                            'type' => 'innerblocks',
                            'name' => 'then-content',
                            'label' => 'Then Content',
                            'attr_name' => 'cond_then.content'
                        )
                    )
                ),
                array(
                    'name' => 'else-block',
                    'title' => 'Else',
                    'icon' => 'no',
                    'fields' => array(
                        array(
                            'type' => 'innerblocks',
                            'name' => 'else-content',
                            'label' => 'Else Content',
                            'attr_name' => 'cond_else.content'
                        )
                    )
                )
            )
        ),
        'simple-block-one' => array(
            'name' => 'simple-block-one',
            'title' => 'Simple Block One',
            'icon' => 'admin-generic',
            'category' => 'widgets',
            'tabs' => array(
                array(
                    'name' => 'basic',
                    'title' => 'Basic Settings',
                    'icon' => 'admin-settings',
                    'fields' => array(
                        array(
                            'type' => 'text',
                            'name' => 'title',
                            'label' => 'Title',
                            'attr_name' => 'tab1.title'
                        ),
                        array(
                            'type' => 'attributes-repeater',
                            'name' => 'atts1',
                            'label' => 'attributes',
                            'attr_name' => 'tab1.atts'
                        ),
                        array(
                            'type' => 'number',
                            'name' => 'amount',
                            'label' => 'Amount',
                            'attr_name' => 'tab1.amount'
                        ),
                        array(
                            'type' => 'innerblocks',
                            'name' => 'content-blocks',
                            'label' => 'Content Blocks',
                            'attr_name' => 'tab1.content'
                        )
                    )
                ),
                array(
                    'name' => 'advanced',
                    'title' => 'Advanced Settings',
                    'icon' => 'admin-tools',
                    'fields' => array(
                        array(
                            'type' => 'text',
                            'name' => 'description',
                            'label' => 'Description',
                            'attr_name' => 'tab2.description'
                        ),
                        array(
                            'type' => 'small-number',
                            'name' => 'display-order',
                            'label' => 'Display Order',
                            'attr_name' => 'tab2.display_order',
                            'default' => 0,
                            'validation' => array(
                                'required' => true,
                                'min' => 0,
                                'max' => 100
                            )
                        ),
                        array(
                            'type' => 'select',
                            'name' => 'status',
                            'label' => 'Status',
                            'attr_name' => 'tab2.status',
                            'default' => 'draft',
                            'validation' => array(
                                'required' => true
                            ),
                            'options' => array(
                                array('label' => 'Draft', 'value' => 'draft'),
                                array('label' => 'Published', 'value' => 'published'),
                                array('label' => 'Archived', 'value' => 'archived')
                            )
                        ),
                        array(
                            'type' => 'toggle',
                            'name' => 'is-featured',
                            'label' => 'Featured Item',
                            'attr_name' => 'tab2.is_featured',
                            'default' => false
                        ),
                        array(
                            'type' => 'attributes-repeater',
                            'name' => 'advanced-attributes',
                            'label' => 'Advanced Attributes',
                            'attr_name' => 'tab2.attributes'
                        ),
                        array(
                            'type' => 'innerblocks',
                            'name' => 'content-blocks-else',
                            'label' => 'Content Blocks',
                            'attr_name' => 'tab2.content'
                        )
                    )
                )
            )
        )
    );
*/
    // Pass configurations to JavaScript
    wp_localize_script(
        'awesome-multi-blocks',
        'awesomeMultiBlocks',
        array('blockConfigs' => $block_configs)
    );

// Register Field Block
register_block_type('awesome-blocks/field', array(
    'editor_script' => 'awesome-multi-blocks',
    'editor_style'  => 'awesome-multi-blocks-editor',
    'attributes' => array(
        'name' => array(
            'type' => 'string',
            'default' => ''
        ),
        'type' => array(
            'type' => 'string',
            'default' => 'text'
        ),
        'label' => array(
            'type' => 'string',
            'default' => ''
        ),
        'value' => array(
            'type' => ['string', 'array', 'object'], // Allow multiple types
            'default' => ''
        ),
        'tab' => array(
            'type' => 'string',
            'default' => ''
        ),
        'attr_name' => array(
            'type' => 'string',
            'default' => ''
        ),
        'options' => array(
            'type' => 'array',
            'default' => []
        ),
        'validation' => array(
            'type' => 'object',
            'default' => array()
        )
    ),
    'supports' => array(
        'inserter' => false,
        'html' => false,
        'reusable' => false
    )
));

    // Register each block type
    foreach ($block_configs as $name => $config) {
        register_block_type("awesome-multi-blocks/$name", array(
            'editor_script' => 'awesome-multi-blocks',
            'editor_style'  => 'awesome-multi-blocks-editor',
            'render_callback' => 'awesome_multi_blocks_render',
            'supports' => array(
                'html' => false,
                'innerBlocks' => array(
                    'allowedBlocks' => array('awesome-blocks/field')
                )
            )
        ));
    }
}
add_action('init', 'awesome_multi_blocks_register');

function awesome_multi_blocks_render($attributes, $content, $block) {
    if (defined('REST_REQUEST') && REST_REQUEST) {
        return '<div class="awesome-blocks-placeholder">[Awesome Block]</div>';
    }
    
    try {
        $fields = array();
        //\util::var_dump($block->parsed_block['innerBlocks']);
        foreach ($block->parsed_block['innerBlocks'] as $inner_block) {
            if ($inner_block['blockName'] === 'awesome-blocks/field') {
                $attrs = $inner_block['attrs'];
                if (!empty($attrs['attr_name']) ) {
                    $fields[$attrs['attr_name']] = array(
                        'type' => $attrs['type']
                    );

                  if (!empty($attrs['value']))
                    $fields[$attrs['attr_name']]['value'] = $attrs['value'];

                    if (!empty($inner_block['innerBlocks'])){
                        $fields[$attrs['attr_name']]['content'] = $inner_block['innerBlocks'];
                        /*
                        $out='';
                        foreach ( $inner_block['innerBlocks'] as $block ) {
                            $out=$out . render_block( $block );
                        } 
                            */                    
                    }
    
                }
            }

        }
        

        \util::var_dump($fields);
        //\util::var_dump($block);
        $reply=\aw2\gutenberg\call_service($fields, $block);
        if(is_array($reply))
            $reply=json_encode($reply);
        return $reply;

    } catch (Exception $e) {
        return '<div class="awesome-blocks-error">' . esc_html($e->getMessage()) . '</div>';
    }
}