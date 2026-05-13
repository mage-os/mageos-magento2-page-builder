/**
 * Copyright 2025 Adobe
 * All Rights Reserved.
 */
define([
    'squire'
], function (Squire) {
    'use strict';

    var WidgetDirectiveAbstract,
        injector = new Squire(),
        mocks = {
            'Magento_PageBuilder/js/utils/object': {
                get: function (data, key) {
                    return data[key];
                },
                set: function (data, key, value) {
                    data[key] = value;
                }
            }
        };

    beforeEach(function (done) {
        injector.mock(mocks);
        injector.require(['Magento_PageBuilder/js/mass-converter/widget-directive-abstract'], function (module) {
            WidgetDirectiveAbstract = module;
            done();
        });
    });

    afterEach(function () {
        injector.clean();
    });

    describe('Magento_PageBuilder/js/mass-converter/widget-directive-abstract', function () {
        var model;

        beforeEach(function () {
            model = new WidgetDirectiveAbstract();
        });

        describe('fromDom - Multiline Widget with WYSIWYG Content', function () {
            it('Should parse custom widget with multiline WYSIWYG content containing links', function () {
                // Simulates the reported issue: custom widget with WYSIWYG field containing links
                var data = {
                        content: '{{widget type="Custom\\Widget\\Test"\n' +
                                'wysiwyg_content="<h2>Sample Product Title</h2>\n' +
                                '<p>Description with <a href=\\"/product/sample\\">product link</a></p>"\n' +
                                'template="widget/wysiwyg_test.phtml"}}'
                    },
                    config = {
                        html_variable: 'content'
                    },
                    result = model.fromDom(data, config);

                // With old regex (.*?): widget won't be parsed, returns empty object
                // With new regex ([\S\s]*?): widget will be parsed correctly
                expect(result.type).toBe('Custom\\Widget\\Test');
                expect(result.wysiwyg_content).toContain('Sample Product Title');
                expect(result.wysiwyg_content).toContain('href=\\"');
                expect(result.template).toBe('widget/wysiwyg_test.phtml');
            });
        });
    });
});

