<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Component\Form\Element;

use Magento\Framework\Data\FormFactory;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Ui\Component\Wysiwyg\ConfigInterface;
use Magento\Catalog\Api\CategoryAttributeRepositoryInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\App\Config\ScopeConfigInterface;

class Wysiwyg extends \Magento\Ui\Component\Form\Element\Wysiwyg
{
    /**
     * Wysiwyg constructor.
     *
     * @param ContextInterface $context
     * @param FormFactory $formFactory
     * @param ConfigInterface $wysiwygConfig
     * @param CategoryAttributeRepositoryInterface $attrRepository
     * @param ScopeConfigInterface $scopeConfig
     * @param array $components
     * @param array $data
     * @param array $config
     */
    public function __construct(
        ContextInterface $context,
        FormFactory $formFactory,
        ConfigInterface $wysiwygConfig,
        CategoryAttributeRepositoryInterface $attrRepository,
        ScopeConfigInterface $scopeConfig,
        array $components = [],
        array $data = [],
        array $config = []
    ) {
        // If a dataType is present we're dealing with an attribute
        if (isset($config['dataType'])) {
            try {
                if ($attribute = $attrRepository->get($data['name'])) {
                    $config['wysiwyg'] = (bool)$attribute->getIsWysiwygEnabled();
                }
            } catch (NoSuchEntityException $e) {
                // This model is used by non product attributes
            }
        }
        $wysiwygConfigData = isset($config['wysiwygConfigData']) ? $config['wysiwygConfigData'] : [];
        $isEditorNameBlueFoot = (int)$scopeConfig->getValue(
            \Magento\PageBuilder\Model\Wysiwyg\Config::IS_PAGEBUILDER_ENABLED
        );
        if ($this->isRenderBluefoot($isEditorNameBlueFoot, $wysiwygConfigData)) {
            // This is not done using definition.xml due to https://github.com/magento/magento2/issues/5647
            $data['config']['component'] = 'Magento_PageBuilder/js/form/element/wysiwyg';

            // Override the templates to include our KnockoutJS code
            $data['config']['template'] = 'Magento_PageBuilder/wysiwyg';
            $data['config']['elementTmpl'] = 'Magento_PageBuilder/wysiwyg';
            $wysiwygConfigData['activeEditorPath'] = 'Magento_PageBuilder/pageBuilderAdapter';
            $config['wysiwygConfigData'] = $wysiwygConfigData;
        }

        parent::__construct($context, $formFactory, $wysiwygConfig, $components, $data, $config);
    }

    /**
     * Return information if we need add/update page builder specific settings.
     *
     * @param bool $isActiveEditorInConfigBluefoot
     * @param array $wysiwygConfigData
     * @return bool
     */
    private function isRenderBluefoot($isActiveEditorInConfigBluefoot, $wysiwygConfigData)
    {
        if (
            isset($wysiwygConfigData['enable_pagebuilder'])
            && !$wysiwygConfigData['enable_pagebuilder']
            && $isActiveEditorInConfigBluefoot
        ) {
            return false;
        } elseif ($isActiveEditorInConfigBluefoot) {
            return true;
        }
        return false;
    }
}
