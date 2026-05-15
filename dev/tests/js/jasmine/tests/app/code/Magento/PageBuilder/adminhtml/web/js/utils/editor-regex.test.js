/**
 * Copyright 2025 Adobe
 * All Rights Reserved.
 */

/* eslint-disable max-nested-callbacks */
define([
    'Magento_PageBuilder/js/utils/editor'
], function (utils) {
    'use strict';

    describe('Magento_PageBuilder/js/utils/editor.js - Multiline Widget Tests', function () {

        describe('escapeDoubleQuoteWithinWidgetDirective', function () {
            it('Should process multiline widget with WYSIWYG content containing links', function () {
                // Simulates the issue: custom widget with WYSIWYG field containing multiline content with links
                var content = 'Page content {{widget type="Custom\\Widget\\Test"\n' +
                             'wysiwyg_content="<h2>Sample Product Title</h2>\n' +
                             '<p>Description with <a href=&quot;/product/sample&quot;>product link</a></p>"\n' +
                             'template="widget/wysiwyg_test.phtml"}} more content',
                    result = utils.escapeDoubleQuoteWithinWidgetDirective(content);

                // With old regex (.*?): widget won't be found, quotes won't be escaped
                // With new regex ([\S\s]*?): widget will be found and quotes properly escaped
                expect(result).toContain('href=\\"');
                expect(result).not.toContain('&quot;');
            });
        });

        describe('unescapeDoubleQuoteWithinWidgetDirective', function () {
            it('Should process multiline widget with escaped quotes in WYSIWYG content', function () {
                var content = 'Page content {{widget type="Custom\\Widget\\Test"\n' +
                             'wysiwyg_content="<h2>Sample Product Title</h2>\n' +
                             '<p>Description with <a href=\\"product/sample\\">product link</a></p>"\n' +
                             'template="widget/wysiwyg_test.phtml"}} more content',
                    result = utils.unescapeDoubleQuoteWithinWidgetDirective(content);

                // With old regex: multiline widget won't be processed
                // With new regex: quotes will be properly unescaped
                expect(result).toContain('href=&quot;');
                expect(result).not.toContain('\\"');
            });
        });
    });
});

