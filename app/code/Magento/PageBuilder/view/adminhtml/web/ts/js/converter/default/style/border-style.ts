/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../../component/data-store";
import {ElementConverterInterface} from "../../element-converter-interface";

export default class BorderStyleDefault implements ElementConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        if (!value) {
            return "_default";
        }
        return value;
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string}
     */
    public toDom(name: string, data: DataObject): string {
        if (data[name]) {
            return data[name].toString();
        }
    }
}
