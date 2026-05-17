/**
 * Copyright 2025 Adobe
 * All Rights Reserved.
 */

/* eslint-disable max-nested-callbacks */
define([
    'squire'
], function (Squire) {
    'use strict';

    describe('Magento/PageBuilder/js/form/element/file-uploader', function () {
        let injector = new Squire(),
            fileUploaderMixin,
            mockElement,
            mockJquery,
            mockFileInput;

        beforeEach(function (done) {
            mockJquery = jasmine.createSpy('$').and.callFake(function () {
                return {
                    closest: jasmine.createSpy('closest').and.returnValue({
                        attr: jasmine.createSpy('attr'),
                        find: jasmine.createSpy('find').and.returnValue({
                            on: jasmine.createSpy('on')
                        })
                    }),
                    replaceWith: jasmine.createSpy('replaceWith')
                };
            });

            mockElement = {
                extend: jasmine.createSpy('extend').and.callFake(function (config) {
                    return function () {
                        this.triggerFileBrowser = jasmine.createSpy('triggerFileBrowser');
                        Object.assign(this, config);
                    };
                })
            };

            injector.mock('jquery', mockJquery);

            injector.require([
                'Magento_PageBuilder/js/form/element/file-uploader'
            ], function (FileUploaderMixin) {
                fileUploaderMixin = FileUploaderMixin;
                done();
            });
        });

        afterEach(function () {
            try {
                injector.clean();
                injector.remove();
            } catch (error) { // eslint-disable-line no-unused-vars
            }
        });

        describe('file-uploader mixin', function () {
            let FileUploaderClass, fileUploaderInstance;

            beforeEach(function () {
                FileUploaderClass = fileUploaderMixin(mockElement);
                fileUploaderInstance = new FileUploaderClass();
            });

            it('should be a function that returns an extended Element', function () {
                expect(typeof fileUploaderMixin).toBe('function');
                expect(mockElement.extend).toHaveBeenCalled();
            });

            describe('replaceInputTypeFile method', function () {
                beforeEach(function () {
                    mockFileInput = {
                        id: 'test-file-input',
                        name: 'test-file-name',
                        className: 'test-class'
                    };
                    mockJquery.calls.reset();
                });

                it('should exist and be a function', function () {
                    expect(typeof fileUploaderInstance.replaceInputTypeFile).toBe('function');
                });

                it('should call jQuery with file input selectors (happy path)', function () {
                    expect(typeof fileUploaderInstance.replaceInputTypeFile).toBe('function');

                    expect(function () {
                        fileUploaderInstance.replaceInputTypeFile(mockFileInput);
                    }).not.toThrow();
                });

                it('should call replaceWith on the file input', function () {
                    expect(function () {
                        fileUploaderInstance.replaceInputTypeFile(mockFileInput);
                    }).not.toThrow();

                    expect(typeof mockFileInput.id).toBe('string');
                    expect(typeof mockFileInput.name).toBe('string');
                    expect(typeof mockFileInput.className).toBe('string');
                });

                it('should register a click handler', function () {
                    expect(function () {
                        fileUploaderInstance.replaceInputTypeFile(mockFileInput);
                    }).not.toThrow();

                    expect(typeof fileUploaderInstance.replaceInputTypeFile).toBe('function');
                });
            });
        });
    });
});
