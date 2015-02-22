<?php
/*
 * jQuery File Upload Plugin PHP Example 5.14
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

//include_once($_SERVER['DOCUMENT_ROOT']."/serverscript/classes/ImportClasses.php");
//
//MtUtil::_d("### [FILEUPLOAD]");

error_reporting(E_ALL | E_STRICT);
require('UploadHandler.php');
//$upload_handler = new UploadHandler();

//echo dirname($_SERVER['SCRIPT_FILENAME']);
//echo substr($_SERVER['SCRIPT_NAME'],0, strrpos($_SERVER['SCRIPT_NAME'], '/'));

//$newDir = null;
//
//if (isset($_REQUEST['newDir'])) {
//    $newDir = $_REQUEST['newDir'];
//}
//
//$options = array(
//    'upload_dir' => dirname($this->get_server_var('SCRIPT_FILENAME')).'/../../upload/files/'.$newDir,
//    'upload_url' => $this->get_full_url().'/../../upload/files/'.$newDir
//);


$options = array();

if (isset($_REQUEST['version'])) {
    $version = $_REQUEST['version'];

    switch ($version) {
        case 1:
            $options['image_versions'] = array('' => array('auto_orient' => true));
            break;
        case 2:
            $options['image_versions'] = array('' => array('max_width' => 750, 'max_height' => 600));
            break;
        case 3:
            $options['image_versions'] = array('' => array('max_width' => 100, 'max_height' => 100));
            break;
        case 4:
            $options['image_versions'] = array('' => array('auto_orient' => true), 'medium' => array('max_width' => 750, 'max_height' => 600));
            break;
        case 5:
            $options['image_versions'] = array('' => array('auto_orient' => true), 'thumbnail' => array('max_width' => 100, 'max_height' => 100));
            break;
        case 6:
            $options['image_versions'] = array('' => array('max_width' => 750, 'max_height' => 600), 'thumbnail' => array('max_width' => 400, 'max_height' => 400));
            break;
        case 7:
            $options['image_versions'] = array('' => array('auto_orient' => true), 'medium' => array('max_width' => 750, 'max_height' => 600), 'thumbnail' => array('max_width' => 400, 'max_height' => 400));
            break;
    }
}

$upload_handler = new UploadHandler($options);
