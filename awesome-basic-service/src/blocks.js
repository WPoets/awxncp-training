(function(blocks, element, blockEditor, components) {
    var el = element.createElement;
    var useBlockProps = blockEditor.useBlockProps;
    var TextControl = components.TextControl;
    var SelectControl = components.SelectControl;
    var TextareaControl = components.TextareaControl;
    var Button = components.Button;
    var TabPanel = components.TabPanel;
    var Icon = components.Icon;

    // Define available types
    const ATTRIBUTE_TYPES = [
        { label: 'String', value: 'str' },
        { label: 'Integer', value: 'int' },
        { label: 'Number', value: 'num' },
        { label: 'Path', value: 'path' },
        { label: 'Boolean', value: 'bool' },
        { label: 'Comma Separated', value: 'comma' }
    ];

    // Define tab icons
    const TAB_ICONS = {
        service: 'admin-generic',
        when: 'filter',
        pipes: 'networking',
        out: 'external'
    };

    blocks.registerBlockType('awesome-basic-service/block', {
        title: 'Awesome Basic Service',
        icon: 'admin-tools',
        category: 'widgets',

        attributes: {
            title: {
                type: 'string',
                default: ''
            },
            purpose: {
                type: 'string',
                default: ''
            },
            do: {
                type: 'object',
                default: {
                    service: '',
                    content: '',
                    attributes: []
                }
            },
            when: {
                type: 'object',
                default: {
                    service: '',
                    attributes: [],
                    and: {
                        service: '',
                        attributes: []
                    },
                    or: {
                        service: '',
                        attributes: []
                    }
                }
            },
            pipe: {
                type: 'object',
                default: {
                    service: '',
                    attributes: []
                }
            },
            pipe_1: {
                type: 'object',
                default: {
                    service: '',
                    attributes: []
                }
            },
            out: {
                type: 'object',
                default: {
                    service: '',
                    attributes: []
                }
            },
            out_1: {
                type: 'object',
                default: {
                    service: '',
                    attributes: []
                }
            }
        },

        edit: function(props) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;
            var blockProps = useBlockProps();

            // Helper functions for attributes management
            function updateSection(section, field, value, subsection = null) {
                if (subsection) {
                    const newSection = { ...attributes[section] };
                    newSection[subsection] = {
                        ...newSection[subsection],
                        [field]: value
                    };
                    setAttributes({ [section]: newSection });
                } else {
                    const newSection = { ...attributes[section] };
                    newSection[field] = value;
                    setAttributes({ [section]: newSection });
                }
            }

            function updateAttributes(section, index, field, value, subsection = null) {
                const currentSection = subsection ? attributes[section][subsection] : attributes[section];
                const newAttributes = [...currentSection.attributes];
                newAttributes[index] = { ...newAttributes[index], [field]: value };

                if (subsection) {
                    const newSection = { ...attributes[section] };
                    newSection[subsection] = {
                        ...newSection[subsection],
                        attributes: newAttributes
                    };
                    setAttributes({ [section]: newSection });
                } else {
                    setAttributes({
                        [section]: {
                            ...attributes[section],
                            attributes: newAttributes
                        }
                    });
                }
            }

            function addAttribute(section, subsection = null) {
                const currentSection = subsection ? attributes[section][subsection] : attributes[section];
                const newAttributes = [
                    ...currentSection.attributes,
                    { name: '', type: 'str', value: '' }
                ];

                if (subsection) {
                    const newSection = { ...attributes[section] };
                    newSection[subsection] = {
                        ...newSection[subsection],
                        attributes: newAttributes
                    };
                    setAttributes({ [section]: newSection });
                } else {
                    setAttributes({
                        [section]: {
                            ...attributes[section],
                            attributes: newAttributes
                        }
                    });
                }
            }

            function removeAttribute(section, index, subsection = null) {
                const currentSection = subsection ? attributes[section][subsection] : attributes[section];
                const newAttributes = currentSection.attributes.filter((_, i) => i !== index);

                if (subsection) {
                    const newSection = { ...attributes[section] };
                    newSection[subsection] = {
                        ...newSection[subsection],
                        attributes: newAttributes
                    };
                    setAttributes({ [section]: newSection });
                } else {
                    setAttributes({
                        [section]: {
                            ...attributes[section],
                            attributes: newAttributes
                        }
                    });
                }
            }

            // Render attribute rows
            function renderAttributeRows(section, subsection = null) {
                const currentSection = subsection ? attributes[section][subsection] : attributes[section];
                
                return el('div', { className: 'awesome-attributes-container' },
                    el('h4', {}, 'Attributes'),
                    currentSection.attributes.map((attr, index) => 
                        el('div', { 
                            key: index,
                            className: 'awesome-attribute-row'
                        },
                            el('div', { className: 'awesome-attribute-inputs' },
                                el(TextControl, {
                                    className: 'awesome-attribute-name',
                                    label: 'Name',
                                    value: attr.name,
                                    onChange: value => updateAttributes(section, index, 'name', value, subsection)
                                }),
                                el(SelectControl, {
                                    className: 'awesome-attribute-type',
                                    label: 'Type',
                                    value: attr.type || 'str',
                                    options: ATTRIBUTE_TYPES,
                                    onChange: value => updateAttributes(section, index, 'type', value, subsection)
                                }),
                                el(TextControl, {
                                    className: 'awesome-attribute-value',
                                    label: 'Value',
                                    value: attr.value,
                                    onChange: value => updateAttributes(section, index, 'value', value, subsection)
                                }),
                                el(Button, {
                                    className: 'awesome-attribute-remove',
                                    isDestructive: true,
                                    onClick: () => removeAttribute(section, index, subsection)
                                }, '×')
                            )
                        )
                    ),
                    el(Button, {
                        className: 'awesome-add-attribute',
                        variant: 'secondary',
                        onClick: () => addAttribute(section, subsection)
                    }, '+ Add Attribute')
                );
            }

            // Tab content renderers
            function renderServiceTab() {
                return el('div', { className: 'awesome-tab-content' },
                    el(TextControl, {
                        label: 'Title',
                        value: attributes.title,
                        onChange: value => setAttributes({ title: value })
                    }),
                    el(TextareaControl, {
                        label: 'Purpose',
                        value: attributes.purpose,
                        onChange: value => setAttributes({ purpose: value })
                    }),
                    el(TextControl, {
                        label: 'Service',
                        value: attributes.do.service,
                        onChange: value => updateSection('do', 'service', value)
                    }),
                    el(TextareaControl, {
                        label: 'Content',
                        value: attributes.do.content,
                        onChange: value => updateSection('do', 'content', value)
                    }),
                    renderAttributeRows('do')
                );
            }

            function renderWhenTab() {
                return el('div', { className: 'awesome-tab-content' },
                    el('div', { className: 'awesome-condition-section' },
                        el('h3', {}, 'Primary Condition'),
                        el(TextControl, {
                            label: 'Service',
                            value: attributes.when.service,
                            onChange: value => updateSection('when', 'service', value)
                        }),
                        renderAttributeRows('when')
                    ),
                    el('div', { className: 'awesome-condition-section' },
                        el('h3', {}, 'AND Condition'),
                        el(TextControl, {
                            label: 'Service',
                            value: attributes.when.and.service,
                            onChange: value => updateSection('when', 'service', value, 'and')
                        }),
                        renderAttributeRows('when', 'and')
                    ),
                    el('div', { className: 'awesome-condition-section' },
                        el('h3', {}, 'OR Condition'),
                        el(TextControl, {
                            label: 'Service',
                            value: attributes.when.or.service,
                            onChange: value => updateSection('when', 'service', value, 'or')
                        }),
                        renderAttributeRows('when', 'or')
                    )
                );
            }

            function renderPipesTab() {
                return el('div', { className: 'awesome-tab-content' },
                    el('div', { className: 'awesome-pipe-section' },
                        el('h3', {}, 'Pipe'),
                        el(TextControl, {
                            label: 'Service',
                            value: attributes.pipe.service,
                            onChange: value => updateSection('pipe', 'service', value)
                        }),
                        renderAttributeRows('pipe')
                    ),
                    el('div', { className: 'awesome-pipe-section' },
                        el('h3', {}, 'Pipe.1'),
                        el(TextControl, {
                            label: 'Service',
                            value: attributes.pipe_1.service,
                            onChange: value => updateSection('pipe_1', 'service', value)
                        }),
                        renderAttributeRows('pipe_1')
                    )
                );
            }

            function renderOutTab() {
                return el('div', { className: 'awesome-tab-content' },
                    el('div', { className: 'awesome-out-section' },
                        el('h3', {}, 'Out'),
                        el(TextControl, {
                            label: 'Service',
                            value: attributes.out.service,
                            onChange: value => updateSection('out', 'service', value)
                        }),
                        renderAttributeRows('out')
                    ),
                    el('div', { className: 'awesome-out-section' },
                        el('h3', {}, 'Out.1'),
                        el(TextControl, {
                            label: 'Service',
                            value: attributes.out_1.service,
                            onChange: value => updateSection('out_1', 'service', value)
                        }),
                        renderAttributeRows('out_1')
                    )
                );
            }

            const tabs = [
                {
                    name: 'service',
                    title: el('span', { className: 'awesome-tab-title' },
                        el(Icon, { icon: TAB_ICONS.service }),
                        'Service'
                    ),
                    className: 'awesome-tab awesome-tab-service',
                },
                {
                    name: 'when',
                    title: el('span', { className: 'awesome-tab-title' },
                        el(Icon, { icon: TAB_ICONS.when }),
                        'When'
                    ),
                    className: 'awesome-tab awesome-tab-when',
                },
                {
                    name: 'pipes',
                    title: el('span', { className: 'awesome-tab-title' },
                        el(Icon, { icon: TAB_ICONS.pipes }),
                        'Pipes'
                    ),
                    className: 'awesome-tab awesome-tab-pipes',
                },
                {
                    name: 'out',
                    title: el('span', { className: 'awesome-tab-title' },
                        el(Icon, { icon: TAB_ICONS.out }),
                        'Out'
                    ),
                    className: 'awesome-tab awesome-tab-out',
                }
            ];

            return el('div', blockProps,
                el(TabPanel, {
                    className: 'awesome-tabs',
                    activeClass: 'active-tab',
                    tabs: tabs
                }, function(tab) {
                    switch (tab.name) {
                        case 'service':
                            return renderServiceTab();
                        case 'when':
                            return renderWhenTab();
                        case 'pipes':
                            return renderPipesTab();
                        case 'out':
                            return renderOutTab();
                        default:
                            return el('p', {}, 'Unknown tab');
                    }
                })
            );
        },

        save: function() {
            return null; // Using PHP render callback
        }
    });
}(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor,
    window.wp.components
));