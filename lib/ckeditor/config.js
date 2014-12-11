/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
//    config.allowedContent =
//        'div(left,right)[id,class];';
    config.enterMode = CKEDITOR.ENTER_BR;
    config.contentsCss = '../../css/editor.css';
    config.font_names = 'Nanum Gothic;' + CKEDITOR.config.font_names;
    config.font_defaultLabel = 'Nanum Gothic';
};
