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

error_reporting(E_ALL | E_STRICT);
require('UploadHandler.php');
$upload_handler = new UploadHandler();

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
//$upload_handler = new UploadHandler($options);
