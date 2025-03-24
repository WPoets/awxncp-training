(function(blocks, element, blockEditor, components) {
    var el = element.createElement;
    var useBlockProps = blockEditor.useBlockProps;
    var TextControl = components.TextControl;
    var TextareaControl = components.TextareaControl;
    var ToggleControl = components.ToggleControl;
    var SelectControl = components.SelectControl;
    var Icon = components.Icon;

    // Field type definitions
    const FIELD_TYPES = {
// Add to FIELD_TYPES in blocks.js
innerblocks: {
    component: function InnerBlocksField({ value, onChange }) {
        const { InnerBlocks } = wp.blockEditor;
        
        return el('div', { className: 'awesome-inner-blocks' },
            el(InnerBlocks, {
                renderAppender: InnerBlocks.ButtonBlockAppender
            })
        );
    },
    getDefault: () => ''
},

        query: {
            component: TextareaControl,
            getDefault: () => '',
            props: {
                className: 'awesome-query-field'
            }
        },
        service: {
            component: TextControl,
            getDefault: () => '',
            props: {
                maxLength: 100,
                className: 'awesome-service-field'
            }
        },
        text: {
            component: TextControl,
            getDefault: () => ''
        },
        'small-number': {
            component: TextControl,
            props: { type: 'number' },
            getDefault: (field) => field.default || 0
        },
        textarea: {
            component: TextareaControl,
            getDefault: () => ''
        },
        toggle: {
            component: ToggleControl,
            getDefault: (field) => field.default || false
        },
        select: {
            component: SelectControl,
            getDefault: (field) => field.default || '',
            props: field => ({
                options: field.options || []
            })
        },
        title: {
            component: TextControl,
            getDefault: () => '',
            props: {
                maxLength: 100
            },
            fixed: {
                name: 'title-field',
                label: 'Title',
                validation: {
                    required: true,
                    max_length: 100
                }
            }
        },
        purpose: {
            component: TextareaControl,
            getDefault: () => '',
            fixed: {
                name: 'purpose-field',
                label: 'Purpose',
                validation: {
                    required: false
                }
            }
        }
    };

    // Simple Field renderer component
    function FieldRenderer({ field, value, onChange }) {
        console.log('FieldRenderer');
        console.log(field);
        console.log(value);
        console.log(onChange);

        const fieldConfig = FIELD_TYPES[field.type];
        if (!fieldConfig) {
            console.warn(`Unknown field type: ${field.type}`);
            return null;
        }

    // Special handling for innerblocks
    if (field.type === 'innerblocks') {
        return el(fieldConfig.component);
    }
    
    // Merge with fixed settings if any
        const finalField = {
            ...field,
            ...(fieldConfig.fixed || {})
        };

        const fieldProps = {
            label: finalField.label || finalField.name,
            value: value || fieldConfig.getDefault(field),
            onChange: onChange,
            ...(typeof fieldConfig.props === 'function' ? fieldConfig.props(finalField) : fieldConfig.props || {}),
            ...(finalField.validation?.required && { required: true })
        };

        // For toggle fields, we need to handle the checked prop
        if (field.type === 'toggle') {
            fieldProps.checked = value || fieldConfig.getDefault(field);
            delete fieldProps.value;
        }

        return el(fieldConfig.component, fieldProps);
    }

    // Tab selector component
    function TabSelector({ tabs, activeTab, onSelect }) {
        return el('div', { className: 'awesome-tab-buttons' },
            tabs.map(tab => 
                el('button', {
                    key: tab.name,
                    className: `awesome-tab-button ${activeTab === tab.name ? 'active' : ''}`,
                    onClick: () => onSelect(tab.name)
                },
                    el('span', { className: 'awesome-tab-button-content' },
                        el(Icon, { icon: tab.icon }),
                        el('span', { className: 'awesome-tab-button-text' }, tab.title)
                    )
                )
            )
        );
    }

    // Block Edit component
    function BlockEdit({ attributes, setAttributes, config }) {
        console.log('BlockEdit');
        console.log(attributes);
        console.log(setAttributes);
        console.log(config);
        const [activeTab, setActiveTab] = wp.element.useState(config.tabs[0].name);
        const blockProps = useBlockProps();

        function updateAttribute(path, value) {
            const newAttributes = { ...attributes };
            newAttributes[path] = value;
            setAttributes(newAttributes);
        }

        function getAttributeValue(path) {
            return attributes[path];
        }

        // Render all tabs at once, control visibility with CSS
        return el('div', blockProps,
            el(TabSelector, {
                tabs: config.tabs,
                activeTab: activeTab,
                onSelect: setActiveTab
            }),
            el('div', { className: 'awesome-tabs-content' },
                config.tabs.map(tab =>
                    el('div', {
                        key: tab.name,
                        className: `awesome-tab-panel ${activeTab === tab.name ? 'active' : ''}`,
                        style: {
                            display: activeTab === tab.name ? 'block' : 'none'
                        }
                    },
                        tab.fields.map((field, index) =>
                            el('div', {
                                key: index,
                                className: 'awesome-field'
                            },
                                el(FieldRenderer, {
                                    field: field,
                                    value: getAttributeValue(field.attr_name),
                                    onChange: value => updateAttribute(field.attr_name, value)
                                })
                            )
                        )
                    )
                )
            )
        );
    }

    // Helper to get attribute configuration based on field type
    function getAttributeConfig(field) {
        const fieldConfig = FIELD_TYPES[field.type];
        const defaultValue = fieldConfig.getDefault(field);
        
        switch (field.type) {
            case 'small-number':
                return {
                    type: 'number',
                    default: defaultValue
                };
            default:
                return {
                    type: 'string',
                    default: defaultValue
                };
        }
    }

    // Generate block attributes from config - only called once during registration
    function generateAttributes(config) {
        console.log('generateAttributes');
        const attributes = {};
        
        config.tabs.forEach(tab => {
            tab.fields.forEach(field => {
                attributes[field.attr_name] = getAttributeConfig(field);
            });
        });
        
        return attributes;
    }

    // Register blocks from config
    const { blockConfigs } = window.awesomeMultiBlocks;
    console.log('blockConfigs');
    Object.entries(blockConfigs).forEach(([name, config]) => {
        console.log(generateAttributes(config));

        blocks.registerBlockType('awesome-multi-blocks/' + name, {
            title: config.title,
            icon: config.icon,
            category: config.category,
            attributes: generateAttributes(config),
            
            edit: function(props) {
                return el(BlockEdit, {
                    ...props,
                    config: config
                });
            },

            save: function({ attributes }) {
                const { InnerBlocks } = wp.blockEditor;
                return el(InnerBlocks.Content);
            }
        });
    });

}(
    window.wp.blocks,
    window.wp.element,
    wp.blockEditor,
    window.wp.components
));