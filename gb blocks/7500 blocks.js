(function(blocks, element, blockEditor, components) {
    var el = element.createElement;
    var useBlockProps = blockEditor.useBlockProps;
    var TextControl = components.TextControl;
    var TextareaControl = components.TextareaControl;  // Add TextareaControl
    var NumberControl = components.TextControl;
    var SelectControl = components.SelectControl;
    var { InnerBlocks } = wp.blockEditor;
    var { useState } = wp.element;
    
    // Field type definitions
    const FIELD_TYPES = {
        'attributes-repeater': {
            component: function AttributesRepeater({ label, value = [], onChange }) {
                // Ensure value is an array
                const attributes = Array.isArray(value) ? value : [];
                
                const addAttribute = () => {
                    onChange([
                        ...attributes,
                        { name: '', type: 'str', value: '' }
                    ]);
                };
    
                return el('div', { className: 'awesome-attributes-container' },
                    el('h4', {}, label),
                    attributes.map((attr, index) => 
                        el('div', { 
                            key: index,
                            className: 'awesome-attribute-row'
                        },
                            el('div', { className: 'awesome-attribute-inputs' },
                                el(TextControl, {
                                    className: 'awesome-attribute-name',
                                    label: 'Name',
                                    value: attr.name || '',
                                    onChange: (val) => {
                                        const newAttributes = [...attributes];
                                        newAttributes[index] = { ...attr, name: val };
                                        onChange(newAttributes);
                                    }
                                }),
                                el(SelectControl, {
                                    className: 'awesome-attribute-type',
                                    label: 'Type',
                                    value: attr.type || 'str',
                                    options: [
                                        { label: 'String', value: 'str' },
                                        { label: 'Integer', value: 'int' },
                                        { label: 'Number', value: 'num' },
                                        { label: 'Boolean', value: 'bool' },
                                        { label: 'Path', value: 'path' }
                                    ],
                                    onChange: (val) => {
                                        const newAttributes = [...attributes];
                                        newAttributes[index] = { ...attr, type: val };
                                        onChange(newAttributes);
                                    }
                                }),
                                el(TextControl, {
                                    className: 'awesome-attribute-value',
                                    label: 'Value',
                                    value: attr.value || '',
                                    onChange: (val) => {
                                        const newAttributes = [...attributes];
                                        newAttributes[index] = { ...attr, value: val };
                                        onChange(newAttributes);
                                    }
                                }),
                                el('button', {
                                    className: 'awesome-attribute-remove',
                                    onClick: () => {
                                        onChange(attributes.filter((_, i) => i !== index));
                                    }
                                }, '×')
                            )
                        )
                    ),
                    el('button', {
                        className: 'awesome-add-attribute',
                        variant: 'secondary',
                        onClick: addAttribute
                    }, '+ Add Attribute')
                );
            },
            getDefault: () => []
        },
        text: {
            component: TextControl,
            getDefault: () => ''
        },
        textarea: {  // Add textarea type
            component: function TextareaField({ label, value, onChange }) {
                return el(TextareaControl, {
                    label: label,
                    value: value || '',
                    onChange: onChange,
                    rows: 4
                });
            },
            getDefault: () => ''
        },
        number: {
            component: NumberControl,
            getDefault: () => '',
            props: { type: 'number' }
        },
        'small-number': {
            component: function SmallNumberField({ label, value, onChange, min, max }) {
                return el(NumberControl, {
                    label: label,
                    value: value,
                    onChange: val => onChange(val !== '' ? Number(val) : ''),
                    type: 'number',
                    min: min,
                    max: max,
                    className: 'awesome-small-number'
                });
            },
            getDefault: (field) => field.default || 0
        },
        select: {
            component: SelectControl,
            getDefault: (field) => field.default || ''
        },
        toggle: {
            component: function ToggleField({ label, value, onChange }) {
                return el(components.ToggleControl, {
                    label: label,
                    checked: Boolean(value),
                    onChange: onChange
                });
            },
            getDefault: (field) => field.default || false
        },
        innerblocks: {
            component: function InnerBlocksField({ label }) {
                return el('div', { className: 'awesome-innerblocks-field' },
                    el('label', { className: 'components-base-control__label' }, label),
                    el(InnerBlocks, {
                        renderAppender: InnerBlocks.ButtonBlockAppender,
                        templateLock: false,
                        allowedBlocks: true
                    })
                );
            },
            getDefault: () => ''
        },
        title: {
            component: function TitleField({ label, value, onChange }) {
                return el(TextControl, {
                    label: label || 'Title',
                    value: value || '',
                    onChange: onChange,
                    maxLength: 100,
                    className: 'awesome-title-field',
                    required: true
                });
            },
            getDefault: () => '',
            fixed: {
                name: 'title',
                label: 'Title',
                validation: {
                    required: true
                }
            }
        },
    
        purpose: {
            component: function PurposeField({ label, value, onChange }) {
                return el(TextareaControl, {
                    label: label || 'Purpose',
                    value: value || '',
                    onChange: onChange,
                    className: 'awesome-purpose-field',
                    rows: 4
                });
            },
            getDefault: () => '',
            fixed: {
                name: 'purpose',
                label: 'Purpose'
            }
        },
    
        query: {
            component: function QueryField({ label, value, onChange }) {
                return el(TextareaControl, {
                    label: label,
                    value: value || '',
                    onChange: onChange,
                    className: 'awesome-query-field',
                    rows: 6,
                    placeholder: 'Enter SQL query'
                });
            },
            getDefault: () => ''
        },

        // Add to FIELD_TYPES in blocks.js
        date: {
            component: function DateField({ label, value, onChange }) {
                // Import DatePicker from wp.components
                const { DatePicker } = wp.components;
                const { useState } = wp.element;
                
                // State for showing/hiding the date picker
                const [isOpen, setIsOpen] = useState(false);

                // Format date for display
                const formatDate = (dateString) => {
                    if (!dateString) return '';
                    const date = new Date(dateString);
                    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
                };

                return el('div', { className: 'awesome-date-field' },
                    el('div', { className: 'awesome-date-field-label' }, 
                        el('label', { className: 'components-base-control__label' }, label)
                    ),
                    el('div', { className: 'awesome-date-field-input' },
                        el(TextControl, {
                            value: formatDate(value),
                            onChange: onChange,
                            placeholder: 'YYYY-MM-DD',
                            onClick: () => setIsOpen(true),
                            readOnly: true
                        }),
                        isOpen && el('div', { className: 'awesome-date-picker-popover' },
                            el(DatePicker, {
                                currentDate: value,
                                onChange: (newDate) => {
                                    onChange(newDate);
                                    setIsOpen(false);
                                },
                                onClose: () => setIsOpen(false)
                            })
                        )
                    )
                );
            },
            getDefault: () => ''
        },
        service: {
            component: function ServiceField({ label, value, onChange }) {
                return el(TextControl, {
                    label: label,
                    value: value || '',
                    onChange: onChange,
                    className: 'awesome-service-field',
                    placeholder: 'Enter service name (e.g., str.create)',
                    help: 'Service name with dots (e.g., str.create, env.set)'
                });
            },
            getDefault: () => '',
            props: {
                className: 'awesome-service-field'
            }
        },

        awesome_code: {
            component: function AwesomeCodeField({ label, value, onChange }) {
                return el(TextareaControl, {
                    label: label,
                    value: value || '',
                    onChange: onChange,
                    className: 'awesome-code-field',
                    rows: 8,
                    placeholder: 'Enter Awesome Enterprise code'
                });
            },
            getDefault: () => '',
            props: {
                className: 'awesome-code-field'
            }
        },

        env_path: {
            component: function EnvPathField({ label, value, onChange }) {
                return el(TextControl, {
                    label: label,
                    value: value || '',
                    onChange: onChange,
                    className: 'awesome-env-path-field',
                    placeholder: 'Enter environment path (e.g., module.settings.name)',
                    help: 'Environment path with dots (e.g., module.settings.name)'
                });
            },
            getDefault: () => '',
            props: {
                className: 'awesome-env-path-field'
            }
        }
     
    };

    // Custom Tab Buttons Component
    function TabButtons({ tabs, activeTab, onTabChange }) {
        return el('div', { className: 'awesome-tab-buttons' },
            tabs.map(tab => 
                el('button', {
                    key: tab.name,
                    type: 'button',
                    className: `awesome-tab-button ${activeTab === tab.name ? 'active' : ''}`,
                    onClick: () => onTabChange(tab.name)
                },
                    el('span', { className: 'awesome-tab-button-content' },
                        el('span', { className: `dashicons dashicons-${tab.icon}` }),
                        ' ',
                        tab.title
                    )
                )
            )
        );
    }

    // Field Block
    blocks.registerBlockType('awesome-blocks/field', {
        title: 'Awesome Field',
        parent: Object.keys(window.awesomeMultiBlocks.blockConfigs).map(name => 'awesome-multi-blocks/' + name),
        attributes: {
            name: { type: 'string', default: '' },
            type: { type: 'string' },
            label: { type: 'string', default: '' },
            value: { 
                type: ['string', 'array', 'boolean', 'number', 'object'],
                default: ''
            },
            tab: { type: 'string', default: '' },
            attr_name: { type: 'string', default: '' },
            options: { type: 'array', default: [] },
            validation: { type: 'object', default: {} },
            activeTab: { type: 'string', default: '' }
        },
        
        edit: function({ attributes, setAttributes }) {
            const { type, name, label, value, tab, attr_name, options, validation, activeTab } = attributes;
            const fieldConfig = FIELD_TYPES[type];
            
            if (!fieldConfig) return null;

            const className = `awesome-field awesome-field-${tab}${tab === activeTab ? ' awesome-field-active' : ''}`;

            if (type === 'innerblocks') {
                return el('div', { className },
                    el(fieldConfig.component, { label: label })
                );
            }

            // Handle value based on type
            let fieldValue = value;
            if (type === 'small-number' || type === 'number') {
                fieldValue = value !== '' ? Number(value) : '';
            } else if (type === 'toggle') {
                fieldValue = Boolean(value);
            }

            // Build props based on field type
            const props = {
                label: label,
                value: fieldValue,
                onChange: (newValue) => setAttributes({ value: newValue }),
                ...(validation || {}),
                ...(fieldConfig.props || {})
            };

            // Add type-specific props
            if (type === 'select') {
                props.options = options;
            }

            return el('div', { className },
                el(fieldConfig.component, props)
            );
        },
        
        save: function({ attributes }) {
            const { type } = attributes;
            if (type === 'innerblocks') {
                return el(InnerBlocks.Content);
            }
            return null;
        }
    });

    // Main Block
    Object.entries(window.awesomeMultiBlocks.blockConfigs).forEach(([name, config]) => {
        blocks.registerBlockType('awesome-multi-blocks/' + name, {
            title: config.title,
            icon: config.icon,
            category: config.category,
            
            edit: function(props) {
                const blockProps = useBlockProps();
                const [activeTab, setActiveTab] = useState(config.tabs[0].name);
                
                // Pass activeTab to all child fields
                const setFieldsActiveTab = (tab) => {
                    setActiveTab(tab);
                    const innerBlocks = wp.data.select('core/block-editor').getBlocks(props.clientId);
                    innerBlocks.forEach(block => {
                        if (block.name === 'awesome-blocks/field') {
                            wp.data.dispatch('core/block-editor').updateBlockAttributes(
                                block.clientId,
                                { activeTab: tab }
                            );
                        }
                    });
                };

                // Create unified template with all fields
                const template = [];
                config.tabs.forEach(tab => {
                    tab.fields.forEach(field => {
                        let defaultValue = field.default;
                        if (field.type === 'attributes-repeater') {
                            defaultValue = [];
                        } else if (field.type === 'toggle') {
                            defaultValue = Boolean(field.default);
                        } else if (field.type === 'small-number' || field.type === 'number') {
                            defaultValue = field.default !== undefined ? Number(field.default) : '';
                        }

                        template.push([
                            'awesome-blocks/field',
                            {
                                name: field.name,
                                type: field.type,  
                                label: field.label,
                                attr_name: field.attr_name,
                                tab: tab.name,
                                activeTab: activeTab,
                                options: field.options || [],
                                validation: field.validation || {},
                                value: defaultValue
                            }
                        ]);
                    });
                });

                return el('div', { 
                    ...blockProps,
                    'data-active-tab': activeTab
                },
                    el(TabButtons, {
                        tabs: config.tabs,
                        activeTab: activeTab,
                        onTabChange: setFieldsActiveTab
                    }),
                    el('div', { className: 'awesome-tab-content' },
                        el(InnerBlocks, {
                            template: template,
                            templateLock: 'all',
                            allowedBlocks: ['awesome-blocks/field'],
                            renderAppender: false
                        })
                    )
                );
            },

            save: function({ attributes }) {
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