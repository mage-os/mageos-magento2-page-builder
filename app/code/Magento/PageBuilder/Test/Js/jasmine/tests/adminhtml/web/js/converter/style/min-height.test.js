/**
 * Copyright 2025 Adobe
 * All Rights Reserved.
 */

/* eslint-disable max-nested-callbacks */
define([
    'Magento_PageBuilder/js/converter/style/min-height'
], function (MinHeight) {
    'use strict'; // eslint-disable-line strict

    describe('Magento_PageBuilder/js/converter/style/min-height', function () {
        var model;

        beforeEach(function () {
            model = new MinHeight();
        });

        describe('toDom', function () {
            it('Should return empty string when value is undefined', function () {
                var data = {},
                    result = model.toDom('min_height', data);

                expect(result).toBe('');
            });

            it('Should return empty string when value is null', function () {
                var data = {
                        min_height: null
                    },
                    result = model.toDom('min_height', data);

                expect(result).toBe('');
            });

            it('Should return the value when it is a simple string', function () {
                var data = {
                        min_height: '300px'
                    },
                    result = model.toDom('min_height', data);

                expect(result).toBe('300px');
            });

            it('Should wrap calculation expressions with calc()', function () {
                var data = {
                        min_height: '50% + 50px'
                    },
                    result = model.toDom('min_height', data);

                expect(result).toBe('calc(50% + 50px)');
            });

            it('Should handle subtraction in calculations', function () {
                var data = {
                        min_height: '100vh - 20px'
                    },
                    result = model.toDom('min_height', data);

                expect(result).toBe('calc(100vh - 20px)');
            });

            it('Should handle multiplication in calculations', function () {
                var data = {
                        min_height: '2 * 150px'
                    },
                    result = model.toDom('min_height', data);

                expect(result).toBe('calc(2 * 150px)');
            });

            it('Should handle division in calculations', function () {
                var data = {
                        min_height: '600px / 2'
                    },
                    result = model.toDom('min_height', data);

                expect(result).toBe('calc(600px / 2)');
            });

            it('Should return empty string when value is empty string', function () {
                var data = {
                        min_height: ''
                    },
                    result = model.toDom('min_height', data);

                expect(result).toBe('');
            });
        });

        describe('fromDom', function () {
            it('Should remove calc() wrapper from value', function () {
                var result = model.fromDom('calc(50% + 50px)');

                expect(result).toBe('50% + 50px');
            });

            it('Should return value as-is when it does not contain calc()', function () {
                var result = model.fromDom('300px');

                expect(result).toBe('300px');
            });

            it('Should handle calc() with subtraction', function () {
                var result = model.fromDom('calc(100vh - 20px)');

                expect(result).toBe('100vh - 20px');
            });
        });
    });
});

