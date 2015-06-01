<?php
header("Content-type: text/html; charset=utf-8");
include("../inc/easypay_config.php");  // 환경설정 파일 includ
?>
<html>
<head>
    <title>KICC EASYPAY7.0 SAMPLE</title>
    <meta name="robots" content="noindex, nofollow">
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="requiresActiveX=true">
    <meta http-equiv="Expires" content="0"/>
    <meta http-equiv="Pragma" content="no-cache"/>
    <link href="../css/style.css" rel="stylesheet" type="text/css">
    <script language="javascript" src="../js/default.js" type="text/javascript"></script>
    <!-- 테스트 스크립트 입니다. -->
    <script language="javascript" src="http://testpg.easypay.co.kr/plugin/EasyPayPlugin.js"></script>
    <!-- HTTPS -->
    <!--script language="javascript" src="https://pg.easypay.co.kr/plugin/EasyPayPlugin.js"></script-->
    <!--script language="javascript" src="https://pg.easypay.co.kr/plugin/EasyPayPlugin_utf8.js"></script-->
    <!-- HTTP -->
    <!--script language="javascript" src="http://pg.easypay.co.kr/plugin/EasyPayPlugin.js"></script-->
    <!--script language="javascript" src="http://pg.easypay.co.kr/plugin/EasyPayPlugin_utf8.js"></script-->
    <script type="text/javascript">

        /* 플러그인 설치(확인) */
        StartSmartInstall();

        /* 입력 자동 Setting */
        function f_init(){
            var frm_pay = document.frm_pay;

            var today = new Date();
            var year  = today.getFullYear();
            var month = today.getMonth() + 1;
            var date  = today.getDate();
            var time  = today.getTime();

            if(parseInt(month) < 10) {
                month = "0" + month;
            }

            if(parseInt(date) < 10) {
                date = "0" + date;
            }

            var getParam = function(key){
                var _parammap = {};
                document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
                    function decode(s) {
                        return decodeURIComponent(s.split("+").join(" "));
                    }

                    _parammap[decode(arguments[1])] = decode(arguments[2]);
                });

                return _parammap[key];
            };


//		alert("EP_order_no : " + getParam("EP_order_no"));


            // �߰�
            frm_pay.EP_tr_cd.value = getParam("EP_tr_cd");
            frm_pay.EP_pay_type.value = getParam("EP_pay_type");
            frm_pay.EP_user_id.value = getParam("EP_user_id");
            frm_pay.EP_order_no.value = getParam("EP_order_no");
            frm_pay.EP_user_mail.value = getParam("EP_user_mail");
            frm_pay.EP_user_phone1.value = getParam("EP_user_phone1");
            frm_pay.EP_user_phone2.value = getParam("EP_user_phone2");
            frm_pay.EP_user_addr.value = getParam("EP_user_addr");
            frm_pay.EP_product_nm.value = getParam("EP_product_nm");
            frm_pay.EP_product_amt.value = getParam("EP_product_amt");
            frm_pay.EP_user_nm.value = getParam("EP_user_nm");

//		frm.pay.elements['EP_pay_type'].value = 22;

            document.frm_pay.EP_product_type.value = 0;
//            document.frm_pay.EP_pay_type.value = 22;

            frm_pay.EP_mall_pwd.value = "1111";
            frm_pay.EP_vacct_end_date.value = "" + year + month + date;               //��������Աݸ�����
            //frm_pay.EP_order_no.value = "ORDER_" + year + month + date + time;   //�������ֹ���ȣ
            //frm_pay.EP_user_id.value = "USER_" + time;                           //�?ID
            //frm_pay.EP_user_nm.value = "�����";
            //frm_pay.EP_user_mail.value = "test@kicc.co.kr";
            //frm_pay.EP_user_phone1.value = "0212344567";
            //frm_pay.EP_user_phone2.value = "01012344567";
            //frm_pay.EP_user_addr.value = "���� ��õ�� ���굿 459-9 ";
            //frm_pay.EP_product_nm.value = "���׽�Ʈ��ǰ��";
            //frm_pay.EP_product_amt.value = "1004";

            f_submit();
        }

        function f_submit() {
            var frm_pay = document.frm_pay;

            var bRetVal = false;

            /* 가맹점사용카드리스트 */
            var usedcard_code = "";
            for( var i=0; i < frm_pay.usedcard_code.length; i++) {
                if (frm_pay.usedcard_code[i].checked) {
                    usedcard_code += frm_pay.usedcard_code[i].value + ":";
                }
            }
            frm_pay.EP_usedcard_code.value = usedcard_code;

            /* 가상계좌은행리스트 */
            var vacct_bank = "";
            for( var i=0; i < frm_pay.vacct_bank.length; i++) {
                if (frm_pay.vacct_bank[i].checked) {
                    vacct_bank += frm_pay.vacct_bank[i].value + ":";
                }
            }
            frm_pay.EP_vacct_bank.value = vacct_bank;

            /* Easypay Plugin 실행 */
            if ( StartPayment( frm_pay ) == true ) {
                if ( frm_pay.EP_res_cd.value == "0000" ) {
                    bRetVal = true;
                } else {
                    /* 인증 실패 메시지 */
                    alert( "응답코드:"   + frm_pay.EP_res_cd.value + "]\n" +
                        "응답메시지:" + frm_pay.EP_res_msg.value + "]\n" );
                    window.top.externalOrder(false);
                }
            } else {
                /* StartPayment false 메시지 */
                alert( "응답코드:"   + frm_pay.EP_res_cd.value + "]\n" +
                    "응답메시지:" + frm_pay.EP_res_msg.value + "]\n" );
                window.top.externalOrder(false);
            }

            if( frm_pay.EP_tax_flg.value == "TG01" )
            {
                if( !frm_pay.EP_com_tax_amt.value ) {
                    alert("과세 승인 금액을 입력하세요.!!");
                    frm_pay.EP_com_tax_amt.focus();
                    window.top.externalOrder(false);
                    return;
                }

                if( !frm_pay.EP_com_free_amt.value ) {
                    alert("비과세 승인 금액을 입력하세요.!!");
                    frm_pay.EP_com_free_amt.focus();
                    window.top.externalOrder(false);
                    return;
                }

                if( !frm_pay.EP_com_vat_amt.value ) {
                    alert("부가세 금액을 입력하세요.!!");
                    frm_pay.EP_com_vat_amt.focus();
                    window.top.externalOrder(false);
                    return;
                }
            }
            if ( bRetVal ) {
                frm_pay.submit();
            }
        }
    </script>
</head>
<body onload="f_init();">
<form name="frm_pay" method="post" action="../easypay_request.php">

<!-- [수정불가] 해외카드인증구분 //-->
<input type="hidden" name="EP_os_cert_flag"     value="2">

<!-- 플러그인으로 부터 받는 필드 [변경불가] //-->
<input type="hidden" name="EP_res_cd"           value="">     <!-- 응답코드     //-->
<input type="hidden" name="EP_res_msg"          value="">     <!-- 응답메시지   //-->
<input type="hidden" name="EP_tr_cd"            value="">     <!-- 플러그인 요청구분 //-->
<input type="hidden" name="EP_trace_no"         value="">     <!-- 거래추적번호 //-->
<input type="hidden" name="EP_sessionkey"       value="">     <!-- 암호화키     //-->
<input type="hidden" name="EP_encrypt_data"     value="">     <!-- 암호화전문   //-->

<input type="hidden" name="EP_card_code"        value="">     <!-- 인증카드코드   //-->
<input type="hidden" name="EP_ret_pay_type"     value="">     <!-- 결제수단 //-->
<input type="hidden" name="EP_ret_complex_yn"   value="">     <!-- 복합결제여부   //-->

<!-- 플러그인 이용을 위한 가맹점 여유필드 -->
<input type="hidden" name="EP_user_define1"     value="">     <!-- 가맹점 여유필드   //-->

<table border="0" width="910" cellpadding="10" cellspacing="0">
<tr>
<td>
<!-- title start -->
<table border="0" width="900" cellpadding="0" cellspacing="0">
    <tr>
        <td height="30" bgcolor="#FFFFFF" align="left">&nbsp;<img src="../img/arow3.gif" border="0" align="absmiddle">&nbsp;일반 > <b>결제</b></td>
    </tr>
    <tr>
        <td height="2" bgcolor="#2D4677"></td>
    </tr>
</table>
<!-- title end -->

<!-- mallinfo start -->
<table border="0" width="900" cellpadding="0" cellspacing="0">
    <tr>
        <td height="30" bgcolor="#FFFFFF">&nbsp;<img src="../img/arow2.gif" border="0" align="absmiddle">&nbsp;<b>가맹점정보</b>(*필수)</td>
    </tr>
</table>

<table border="0" width="900" cellpadding="0" cellspacing="1" bgcolor="#DCDCDC">
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*가맹점아이디</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_mall_id" value="T5102001" size="50" maxlength="8" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;가맹점패스워드</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_mall_pwd" value="" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;가맹점명</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_mall_nm" value="한국정보통신(주) 테스트" size="50" class="input_A"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;가맹점 CI URL</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_ci_url" value="http://testpg.easypay.co.kr/plugin/logo_kicc.png" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;영문버젼여부</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_lang_flag" class="input_A">
                <option value="" selected>한글</option>
                <option value="ENG">영문</option>
            </select></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;가맹점개발언어</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_agent_ver" class="input_A">
                <option value="JSP" >JSP</option>
                <option value="PHP" selected>PHP</option>
                <option value="ASP">ASP</option>
            </select></td>
    </tr>
</table>
<!-- mallinfo end -->

<!-- plugin start -->
<table border="0" width="900" cellpadding="0" cellspacing="0">
    <tr>
        <td height="30" bgcolor="#FFFFFF">&nbsp;<img src="../img/arow2.gif" border="0" align="absmiddle">&nbsp;<b>플러그인정보</b>(*필수)</td>
    </tr>
</table>

<table border="0" width="900" cellpadding="0" cellspacing="1" bgcolor="#DCDCDC">
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*결제수단</td>
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;
            <select name="EP_pay_type" class="input_F">
                <option value="11" selected>신용카드</option>
                <option value="21">계좌이체</option>
                <option value="22">무통장입금</option>
                <option value="31">휴대폰</option>
                <option value="32">전화결제</option>
                <option value="41">포인트</option>
                <option value="11:21:22:31:32:41">모든결제수단</option>
            </select></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*통화코드</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_currency" class="input_F">
                <option value="00" selected>원화</option>
                <option value="01">달러</option>
            </select></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;복합결제 허용여부</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_complex_yn" class="input_A">
                <option value="" selected>선택</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
            </select></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;가맹점사용<br>&nbsp;카드리스트</td>
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;<input type="checkbox" name="usedcard_code" value="" checked>전체카드
        </td>
        <!-- 가맹점에서 사용 가능한 카드만 노출하고 싶을 때 아래 코드를 삽입 하시기 바랍니다.
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;<input type="checkbox" name="usedcard_code" value="029" checked>신한(029)
            <input type="checkbox" name="usedcard_code" value="027" checked>현대(027)
            <input type="checkbox" name="usedcard_code" value="031" checked>삼성(031)
            <input type="checkbox" name="usedcard_code" value="008" checked>외환(008)
            <input type="checkbox" name="usedcard_code" value="026" checked>비씨(026)
            <input type="checkbox" name="usedcard_code" value="016" checked>국민(016)
            <input type="checkbox" name="usedcard_code" value="047" checked>롯데(047)
            <input type="checkbox" name="usedcard_code" value="018" checked>NH농협(018)
            <input type="checkbox" name="usedcard_code" value="006" checked>하나SK(006)<br>
            &nbsp;<input type="checkbox" name="usedcard_code" value="022" checked>시티(022)
            <input type="checkbox" name="usedcard_code" value="021" checked>우리(021)
            <input type="checkbox" name="usedcard_code" value="002" checked>광주(002)
            <input type="checkbox" name="usedcard_code" value="017" checked>수협(017)
            <input type="checkbox" name="usedcard_code" value="010" checked>전북(010)
            <input type="checkbox" name="usedcard_code" value="011" checked>제주(011)
            <input type="checkbox" name="usedcard_code" value="001" checked>조흥(001)
            <input type="checkbox" name="usedcard_code" value="058" checked>산업(058)
            <input type="checkbox" name="usedcard_code" value="126" checked>저축(126)<br>
            &nbsp;<input type="checkbox" name="usedcard_code" value="226" checked>우체국(226)
            <input type="checkbox" name="usedcard_code" value="050" checked>VISA(050)
            <input type="checkbox" name="usedcard_code" value="028" checked>JCB(028)
            <input type="checkbox" name="usedcard_code" value="048" checked>다이너스(048)
            <input type="checkbox" name="usedcard_code" value="049" checked>Master(049)
        </td>
        -->
        <!-- 플러그인에 전달될 카드사 리스트 변수 -->
        <input type="hidden" name="EP_usedcard_code">
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*신용카드인증방식</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_cert_type" class="input_F">
                <option value="" selected>일반</option>
                <!-- 인증/비인증의 경우 특약가맹점만 사용 가능합니다.-->
                <option value="0">인증</option>
                <option value="1">비인증</option>
            </select></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;할부개월</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_quota" value="00:02:03:04:05:06:07:08:09:10:11:12" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;무이자사용여부</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_noinst_flag" class="input_A">
                <option value="" selected>DB조회</option>
                <option value="Y">무이자</option>
                <option value="N">일반</option>
            </select></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;무이자설정<br>&nbsp;(카드코드-할부개월)</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_noinst_term" value="029-02:03:04:05:06,027-02:03" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;포인트카드 사용유무</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_set_point_card_yn" class="input_A">
                <option value="Y">사용</option>
                <option value="N" selected>미사용</option>
            </select></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;카드사 포인트 </td>
        <!-- 동일 카드코드는 입력하지 마시요(027-40,027-60 X). -->
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_point_card" value="" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;가상계좌<br>&nbsp;은행 리스트</td>
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;<input type="checkbox" name="vacct_bank" value="003" checked>기업은행(003)
            <input type="checkbox" name="vacct_bank" value="004" checked>국민은행(004)
            <input type="checkbox" name="vacct_bank" value="011" checked>농협중앙회(011)
            <input type="checkbox" name="vacct_bank" value="020" checked>우리은행(020)<br>
            &nbsp;<input type="checkbox" name="vacct_bank" value="023" checked>SC제일은행(023)
            <input type="checkbox" name="vacct_bank" value="026" checked>신한은행(026)
            <input type="checkbox" name="vacct_bank" value="032" checked>부산은행(032)
            <input type="checkbox" name="vacct_bank" value="071" checked>우체국(071)
            <input type="checkbox" name="vacct_bank" value="081" checked>하나은행(081)
            <input type="hidden" name="EP_vacct_bank">
        </td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;가상계좌<br>&nbsp;입금만료일</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_vacct_end_date" value="" size="50" class="input_A"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;가상계좌<br>&nbsp;입금만료시간</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_vacct_end_time" value="235959" size="50" class="input_A"></td>
    </tr>
</table>
<!-- plugin end -->

<!-- order start -->
<table border="0" width="900" cellpadding="0" cellspacing="0">
    <tr>
        <td height="30" bgcolor="#FFFFFF">&nbsp;<img src="../img/arow2.gif" border="0" align="absmiddle">&nbsp;<b>주문정보</b>(*필수)</td>
    </tr>
</table>
<table border="0" width="900" cellpadding="0" cellspacing="1" bgcolor="#DCDCDC">
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*주문번호</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_order_no" size="50" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;사용자구분</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_user_type" class="input_A">
                <option value="1">일반</option>
                <option value="2" selected>회원</option>
            </select>
        </td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;고객ID</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_user_id" size="50" class="input_A"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;고객명</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_user_nm" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;고객Email</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_user_mail" size="50" class="input_A"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;고객전화번호</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_user_phone1" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*고객휴대폰</td>
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;<input type="text" name="EP_user_phone2" size="50" class="input_F"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;고객주소</td>
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;<input type="text" name="EP_user_addr" size="100" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*상품명</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_product_nm" size="50" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;*상품금액</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_product_amt" size="50" class="input_F"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;상품구분</td>
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;<select name="EP_product_type" class="input_A">
                <option value="0" selected>실물</option>
                <option value="1">컨텐츠</option>
            </select></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;과세구분</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_tax_flg" class="input_A">
                <option value="" selected>일반</option>
                <option value="TG01">복합과세</option>
            </select></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;과세 승인금액</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_com_tax_amt" size="50" class="input_F"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;비과세 승인금액</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_com_free_amt" size="50" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;부가세 금액</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_com_vat_amt" size="50" class="input_F"></td>
    </tr>
</table>
<!-- order Data END -->

<!-- 수동설치 start -->
<table border="0" width="900" cellpadding="0" cellspacing="0">
    <tr>
        <td height="30" bgcolor="#FFFFFF">&nbsp;<img src="../img/arow2.gif" border="0" align="absmiddle">&nbsp;<b>수동설치</b></td>
    </tr>
</table>
<table border="0" width="900" cellpadding="0" cellspacing="1" bgcolor="#DCDCDC">
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;URL1</td>
        <td bgcolor="#FFFFFF" width="300"><a href="https://pg.easypay.co.kr/plugin/file/EasyPayInstall.exe">수동설치1</a></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;URL2</td>
        <td bgcolor="#FFFFFF" width="300"><a href="https://pg.easypay.co.kr/plugin/file/EasyPayInstall.zip">수동설치2</a></td>
    </tr>
</table>
<!-- 수동설치 END -->

<table border="0" width="900" cellpadding="0" cellspacing="0">
    <tr>
        <td height="30" align="center" bgcolor="#FFFFFF"><input type="button" value="결 제" class="input_D" style="cursor:hand;" onclick="javascript:f_submit();"></td>
    </tr>
</table>
</td>
</tr>
</table>
</form>
</body>
</html>
