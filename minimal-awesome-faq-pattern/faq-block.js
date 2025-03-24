(function (wp) {
    var registerBlockType = wp.blocks.registerBlockType;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var InnerBlocks = wp.blockEditor.InnerBlocks;
    var __ = wp.i18n.__;
    var el = wp.element.createElement;
    
    /**
     * Register the FAQ Container block for the editor
     */
    registerBlockType('awesome-patterns/faq-container', {
        title: __('FAQ Container', 'awesome-patterns'),
        icon: 'format-chat',
        category: 'design',
        
        // No custom attributes needed for this test
        attributes: {},
        
        // Simple example for block library preview
        example: {},
        
        // Editor interface
        edit: function (props) {
            var blockProps = useBlockProps({
                className: 'wp-block-awesome-patterns-faq-container',
                style: {
                    border: '1px dashed #ccc',
                    padding: '20px',
                    backgroundColor: '#f9f9f9'
                }
            });
            
            return el('div', blockProps,
                el('div', {
                    style: {
                        marginBottom: '15px',
                        backgroundColor: '#eee',
                        padding: '8px 12px',
                        fontSize: '13px'
                    }
                }, 'FAQ Container - Will be rendered by AwesomeEnterprise'),
                el(InnerBlocks)
            );
        },
        
        // Save function - this just stores the inner blocks
        save: function () {
            var blockProps = useBlockProps.save({
                className: 'wp-block-awesome-patterns-faq-container'
            });
            
            return el('div', blockProps,
                el(InnerBlocks.Content)
            );
        }
    });
})(window.wp);