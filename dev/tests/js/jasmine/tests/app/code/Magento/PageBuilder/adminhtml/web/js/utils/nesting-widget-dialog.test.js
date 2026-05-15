/**
 * Copyright 2025 Adobe
 * All Rights Reserved.
 */
define([
    'squire',
    'jquery'
], function (Squire, $) {
    'use strict';

    var nestingWidgetDialog,
        injector = new Squire(),
        mocks = {
            'mage/translate': function (text) {
                return text; // Simple mock that returns the input text
            },
            'Magento_PageBuilder/js/modal/dismissible-confirm': jasmine.createSpy('dismissibleConfirm')
        };

    beforeEach(function (done) {
        injector.mock(mocks);
        injector.require(['Magento_PageBuilder/js/utils/nesting-widget-dialog'], function (module) {
            nestingWidgetDialog = module;
            done();
        });
    });

    afterEach(function () {
        injector.clean();
    });

    describe('Magento_PageBuilder/js/utils/nesting-widget-dialog', function () {
        var mockDataStore, mockWysiwyg, mockElement;

        beforeEach(function () {
            // Create mock element
            mockElement = $('<div id="test-wysiwyg">Test content</div>');
            $('body').append(mockElement);

            mockDataStore = {
                getState: jasmine.createSpy('getState'),
                set: jasmine.createSpy('set')
            };

            mockWysiwyg = {
                elementId: 'test-wysiwyg'
            };

            // Reset the spy
            mocks['Magento_PageBuilder/js/modal/dismissible-confirm'].calls.reset();
        });

        afterEach(function () {
            mockElement.remove();
        });

        describe('Multiline Widget Detection - WYSIWYG Content Issue', function () {
            it('Should detect custom widget with multiline WYSIWYG content containing links', function () {
                // Simulates the reported issue: custom widget with WYSIWYG field containing links
                var inlineMessage = 'Page content {{widget type="Custom\\Widget\\Test"\n' +
                                   'wysiwyg_content="<h2>Sample Product Title</h2>\n' +
                                   '<p>Description with <a href=\\"/product/sample\\">product link</a></p>"\n' +
                                   'template="widget/wysiwyg_test.phtml"}} more content',
                    linkUrl = {
                        type: 'page',
                        page: ['page-1']
                    },
                    dialogConfig;

                mockDataStore.getState.and.returnValue({
                    'inline_message': inlineMessage,
                    'link_url': linkUrl
                });

                nestingWidgetDialog(mockDataStore, mockWysiwyg, 'inline_message', 'link_url');

                // With old regex (.*?): multiline widget won't be detected, no dialog
                // With new regex ([\S\s]*?): multiline widget will be detected, dialog shown
                expect(mocks['Magento_PageBuilder/js/modal/dismissible-confirm']).toHaveBeenCalled();

                // Test widget removal functionality
                dialogConfig = mocks['Magento_PageBuilder/js/modal/dismissible-confirm'].calls.mostRecent().args[0];
                dialogConfig.actions.always();

                // Verify widget is removed from content
                expect(mockDataStore.set).toHaveBeenCalledWith('inline_message', 'Page content  more content');
            });
        });
    });
});
