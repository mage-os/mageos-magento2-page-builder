<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Wysiwyg;

/**
 * This DefaultConfigProvider overrides existing configuration provided from the cms module
 */
class DefaultConfigProvider implements \Magento\Framework\Data\Wysiwyg\ConfigProviderInterface
{
    /**
     * @var \Magento\Framework\View\Asset\Repository
     */
    private $assetRepo;
    /**
     * @var array
     */
    private $additionalSettings;
    /**
     * @param \Magento\Framework\View\Asset\Repository $assetRepo
     * @param array $additionalSettings
     */
    public function __construct(
        \Magento\Framework\View\Asset\Repository $assetRepo,
        array $additionalSettings
    ) {
        $this->assetRepo = $assetRepo;
        $this->additionalSettings = $additionalSettings;
    }
    /**
     * Returns configuration data
     *
     * @param \Magento\Framework\DataObject $config
     * @return \Magento\Framework\DataObject
     */
    public function getConfig(\Magento\Framework\DataObject $config): \Magento\Framework\DataObject
    {
        $defaultSettings = [
            'menubar' => 'edit insert view format table help',
            'statusbar' => false,
            'image_advtab' => true,
            'promotion' => false,
        ];

        $config->addData(
            [
                'tinymce' => [
                    'toolbar' => 'blocks | fontfamily fontsizeinput lineheight | forecolor backcolor | '
                        . 'bold italic underline | alignleft aligncenter alignright alignjustify | '
                        . 'bullist numlist | link image',

                    'plugins' => implode(
                        ' ',
                        [
                            'advlist',
                            'anchor',
                            'autolink',
                            'charmap',
                            'code',
                            'codesample',
                            'directionality',
                            'emoticons',
                            'help',
                            'image',
                            'link',
                            'lists',
                            'media',
                            'nonbreaking',
                            'preview',
                            'table',
                            'visualblocks',
                            'visualchars',
                        ]
                    ),
                    'content_css' => [
                        $this->assetRepo->getUrl('mage/adminhtml/wysiwyg/tiny_mce/themes/ui.css'),
                        $this->assetRepo->getUrl('Magento_PageBuilder::css/source/form/element/tinymce.css')
                    ]
                ],
                'settings' => array_replace_recursive($defaultSettings, $this->additionalSettings),
            ]
        );
        return $config;
    }
}
