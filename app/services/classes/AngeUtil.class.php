<?php
class AngeUtil extends Ange {

    function initHeader() {

    }

    //REQUEST 값을 찍어 볼때
    function _r() {
        $a = $_REQUEST;
        AngeUtil::_c("########################################################################################\n################################ REQUEST LOG BEGIN #####################################");
        foreach ($a as $k => $v) {
            AngeUtil::_c("[$k] => $v");
        }
        AngeUtil::_c("################################ REQUEST LOG END #######################################\n########################################################################################");
    }
    
    function randomString() {
    	return base_convert(mt_rand(0x1D39D3E06400000, 0x41C21CB8E0FFFFFF), 10, 36);
    }

    /*top logo url 가져온다 없으면 기본 이미지*/
    function getTopLogo() {
    	$logopath = $_SERVER['DOCUMENT_ROOT']."/files/campus/image/".AngeUtil::get_session("S_USER_INST_ID")."_logo.jpg";
    	if (file_exists($logopath)) {
    		return "/files/campus/image/".AngeUtil::get_session("S_USER_INST_ID")."_logo.jpg";
    	}else{
    		return "/Ange/images/top/top_logo.gif";
    	}	
    }

    //consoleLog 길어서 만듬
    function _c($msg,$line=true) {
        $access = date("Y.m.d");
        $file_pointer = fopen($_SERVER['DOCUMENT_ROOT']."/logs/debug".$access.".log", "a");
        $text = "";
        if ($line) {
            $text = chr(10).date("Y/m/d H:i:s").":::::::::>"."\n";
            foreach (debug_backtrace() as $k => $v) {
                $text = $text.$v['file'].":line(".$v['line'].")\n";
            }
        } else {
            $text = $text."\n";
        }
        $text = $text.$msg;
        fwrite($file_pointer, $text);
        fclose($file_pointer);
    }

    //consoleLog 길어서 만듬
    function _m($msg,$line=false) {
        $access = date("Y.m.d");
        $file_pointer = fopen($_SERVER['DOCUMENT_ROOT']."/logs/marking".$access.".log", "a");

        $text = "";
        if ($line) {
            $text = chr(10).date("Y/m/d H:i:s").":::::::::>"."\n";
            foreach (debug_backtrace() as $k => $v) {
                $text = $text.$v['file'].":line(".$v['line'].")\n";
            }
        } else {
            $text = $text."\n";
        }
        $text = $text.$msg;
        fwrite($file_pointer, $text);
        fclose($file_pointer);
    }

    //consoleLog 길어서 만듬
    function _d($msg,$line=false) {
        $access = date("Y.m.d");
        $file_pointer = fopen($_SERVER['DOCUMENT_ROOT']."/logs/DATA.".$access.".log", "a");

        $text = "";
        if ($line) {
            $text = chr(10).date("Y/m/d H:i:s").":::::::::>"."\n";
            foreach (debug_backtrace() as $k => $v) {
                $text = $text.$v['file'].":line(".$v['line'].")\n";
            }
        } else {
            $text = $text."\n";
        }
        $text = $text.$msg;
        fwrite($file_pointer, $text);
        fclose($file_pointer);
    }

    //consoleLog 길어서 만듬
    function _c2($msg) {
        $access = date("Y.m.d");
        $file_pointer = fopen($_SERVER['DOCUMENT_ROOT']."/logs/flash".$access.".log", "a");
        $text = chr(10).date("Y/m/d H:i:s").":::::::::>"."\n";
        foreach (debug_backtrace() as $k => $v) {$text = $text.$v['file'].":line(".$v['line'].")\n";}
        $text = $text.$msg;
        fwrite($file_pointer, $text);
        fclose($file_pointer);
    }

    //deprecated
    function consoleLog($msg) {
//			$access = date("Y.m.d");
//			$file_pointer = fopen($_SERVER['DOCUMENT_ROOT']."/logs/debug".$access.".log", "a");
//			$text = chr(10).date("Y/m/d H:i:s").":::::::::>"."\n";
//			foreach (debug_backtrace() as $k => $v) {$text = $text.$v['file'].":line(".$v['line'].")\n";}
//			$text = $text.$msg;
//			fwrite($file_pointer, $text);
//			fclose($file_pointer);
    }

    function set_session($session_name, $value) {
        //AngeUtil::_c($session_name."=".$value);
        session_register($session_name);
        // PHP 버전별 차이를 없애기 위한 방법
        $$session_name = $_SESSION["$session_name"] = $value;
    }

    // 세션변수값 얻음
    function get_session($session_name) {
        return $_SESSION[$session_name];
    }

    function waterMark($img_path) {

        $opacity = 10; // 투명도 높을수록 불투명
        $font_path = "/usr/share/fonts/type1/gsfonts/b018032l.pfb";  //폰트 패스
        $string = "math.com";  // 찍을 워터마크

        //$image = "/home/nksoft/math/lcms/1111.JPG";
        $image = $img_path;

        $image_name = explode(".",$image);
        //$image_targ = "/home/nksoft/math/files/tmp/2222.JPG";  // 워터마크가 찍혀 저장될 이미지
        $image_targ = $img_path;



        list($width, $height, $image_type) = getimagesize($img_path);
        if ($image_type!=2) {
            return false;
        }

        $image_org = $image; // 원본 이미지를 다른 이름으로 저장

        $image = imagecreatefromjpeg($image); // JPG 이미지를 읽고

        $w = imagesx($image);
        $h = imagesy($image);

        $font_size = $w/30; // 글자 크기

        $text_color = imagecolorallocate($image,214,214,214); // 텍스트 컬러 지정

        // 적당히 워터마크가 붙을 위치를 지정

        $text_pos_x = $font_size;

        /*
        for($i=$font_size+20; $i<=$h-$font_size-20; $i+=$font_size+30) {
            $text_pos_y = $i;
            imagettftext($image, $font_size, 0, $text_pos_x, $text_pos_y, $text_color, $font_path, $string);  // 읽은 이미지에 워터마크를 찍고
        }
        */

        imagettftext($image, $font_size, 0, $w-100, $h-$font_size, $text_color, $font_path, $string);  // 읽은 이미지에 워터마크를 찍고

        $image_org = imagecreatefromjpeg($image_org); // 원본 이미지를 다시한번 읽고

        imagecopymerge($image,$image_org,0,0,0,0,$w,$h,$opacity); // 원본과 워터마크를 찍은 이미지를 적당한 투명도로 겹치기

        imagejpeg($image, $image_targ, 90); // 이미지 저장. 해상도는 90 정도

        imagedestroy($image);
        imagedestroy($image_org);
        return true;
    }
}
?>