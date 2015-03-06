<?php
//	header("Content-Type: text/html; charset=UTF-8");
//	header("Expires: 0");
//	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
//	header("Cache-Control: no-store, no-cache, must-revalidate");
//	header("Cache-Control: pre-check=0, post-check=0, max-age=0");
//	header("Pragma: no-cache");

    @session_start();

    @extract($_GET);
    @extract($_POST);
    @extract($_SERVER);

    date_default_timezone_set('Asia/Seoul');

	include_once($_SERVER['DOCUMENT_ROOT']."/serverscript/classes/ImportClasses.php");

    MtUtil::_d("### [START]");
	MtUtil::_d(print_r($_REQUEST,true));
/*
    if (isset($_REQUEST['_category'])) {
        $category = explode("/", $_REQUEST['_category']);

        Util::_c("FUNC[processApi] category : ".print_r($_REQUEST,true));
        Util::_c("FUNC[processApi] category.cnt : ".count($category));
    }
*/
    $_d = new MtJson(null);
/*
    if ($_d->connect_db == "") {
        $_d->failEnd("DB 연결 실패. 관리자에게 문의하세요.");
    }

    if (!isset($_type) || $_type == "") {
        $_d->failEnd("서버에 문제가 발생했습니다. 작업 유형이 없습니다.");
    }
*/
    switch ($_method) {
        case "GET":
            break;
        case "POST":
            if ($_type == 'congratulation') {
                $from_email = __SMTP_USR__;
                $from_user = __SMTP_USR_NM__;
                $to = $_model['EMAIL'];
                $to_user = $_model['USER_NM'];
                $subject = "앙쥬에 오신걸 환영합니다.";
                $message = "<html>
                            <head>
                            <title>@ange_member</title>
                            <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                            </head>
                            <body bgcolor='#FFFFFF' leftmargin='0' topmargin='0' marginwidth='0' marginheight='0'>
                            <!-- Save for Web Slices (@ange_member.psd) -->
                            <table id='Table_01' width='676' border='0' cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td width='50'>
                                        <img src='".BASE_URL."/imgs/ange/mail/@ange_member_01.jpg' width='676' height='108' alt=''></td>
                                </tr>
                                <tr>
                                    <td>
                                        <img src='".BASE_URL."/imgs/ange/mail/@ange_member_02.jpg' width='676' height='146' alt=''></td>
                                </tr>

                                <tr style='1px solid red'>
                                    <td align='center' style='background-image:url(".BASE_URL."/imgs/ange/mail/bg.jpg)'>    <table width='423' border='0' >
                                      <tr>

                                        <td><img src='".BASE_URL."/imgs/ange/mail/01.jpg' width='64' height='17'></td>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                         <th width='22%' align='left' valign='middle' style='padding: 10px 10px 10px; color: rgb(128, 135, 141); font-weight: normal; border:1px solid #CCC; background-color:#f2f2f2; font-size:12px; font:'돋움'' scope='row'>이름</th>
                                                                        <td width='78%' align='left' valign='middle' style='padding: 13px 10px 10px; border:1px solid #CCC;  font-size:12px; font:'돋움'''>".$_model['USER_NM']."</td></tr>

                                     <tr> <th align='left' valign='middle' style='padding: 13px 10px 10px; color: rgb(128, 135, 141); font-weight: normal;border:1px solid #CCC;  background-color:#f2f2f2;  font-size:12px; font:'돋움'' scope='row'>아이디</th>
                                        <td align='left' valign='middle' style='padding: 13px 10px 10px; color: rgb(57, 57, 57); border:1px solid #CCC;  font-size:12px; font:'돋움' border-bottom-style: solid;'>".$_model['USER_ID']."</td></tr>

                                       <tr> <th align='left' valign='middle' style='padding: 13px 10px 10px; color: rgb(128, 135, 141); font-weight: normal; border:1px solid #CCC;  background-color:#f2f2f2; font-size:12px; font:'돋움'' scope='row'>닉네임</th>
                                        <td align='left' valign='middle' style='padding: 13px 10px 10px; color: rgb(57, 57, 57); border:1px solid #CCC;  font-size:12px; font:'돋움'border-bottom-style: solid;'>".$_model['NICK_NM']."</td></tr>


                                    </table></td>
                                </tr>
                                <tr>
                                    <td>
                                        <img src='".BASE_URL."/imgs/ange/mail/@ange_member_04.jpg' width='676' height='177' alt=''></td>
                                </tr>
                            </table>
                            <!-- End Save for Web Slices -->
                            </body>
                            </html>";

                MtUtil::_d("------------>>>>> mail : ");
                MtUtil::smtpMail($from_email, $from_user, $subject, $message, $to, $to_user);
                $_d->succEnd('');
            }

            break;
        case "PUT":
            break;
        case "DELETE":
            break;
    }
?>