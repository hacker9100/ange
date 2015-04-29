<?
/* -------------------------------------------------------------------------- */
/* ::: IP 정보 설정                                                           */
/* -------------------------------------------------------------------------- */
header("Content-type: text/html; charset=utf-8");
$req_ip = $_SERVER['REMOTE_ADDR']; // [필수]요청자 IP
?>
<html>
<head>
    <title>KICC EASYPAY7.0 SAMPLE</title>
    <meta name="robots" content="noindex, nofollow">
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <link href="../css/style.css" rel="stylesheet" type="text/css">
    <script language="javascript" src="../js/default.js" type="text/javascript"></script>
    <script type="text/javascript">

        function f_init(){
            var frm_mgr = document.frm_mgr;

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

            // �߰�
            frm_mgr.mgr_txtype.value = getParam("mgr_txtype");
            frm_mgr.org_cno.value = getParam("org_cno");
            frm_mgr.req_id.value = getParam("req_id");

            f_submit();
        }

        function f_submit() {
            var frm_mgr = document.frm_mgr;

            var bRetVal = false;

            /*  변경정보 확인 */
            if( !frm_mgr.org_cno.value ) {
                alert("PG거래번호를 입력하세요!!");
                frm_mgr.org_cno.focus();
                return;
            }

            if( !frm_mgr.req_id.value ) {
                alert("요청자ID를 입력하세요!!");
                frm_mgr.req_id.focus();
                return;
            }
            /* 부분취소 시 DATA 검증 필요 */
            if ( frm_mgr.mgr_txtype.value == "31" ) {

                if ( !frm_mgr.mgr_amt.value ) {
                    alert("금액을 입력하세요!!");
                    frm_mgr.mgr_amt.focus();
                    return;
                }

                if ( !frm_mgr.mgr_rem_amt.value ) {
                    alert("부분취소 잔액을를 입력하세요!!");
                    frm_mgr.mgr_rem_amt.focus();
                    return;
                }
            }

            if ( frm_mgr.mgr_txtype.value == "31" || frm_mgr.mgr_txtype.value == "33" ) {
                if( frm_mgr.mgr_tax_flg.value == "TG01" )
                {
                    if( !frm_mgr.mgr_tax_amt.value ) {
                        alert("과세 부분취소 금액을 입력하세요.!!");
                        frm_mgr.mgr_tax_amt.focus();
                        return;
                    }

                    if( !frm_mgr.mgr_free_amt.value ) {
                        alert("비과세 부분취소 금액을 입력하세요.!!");
                        frm_mgr.mgr_free_amt.focus();
                        return;
                    }

                    if( !frm_mgr.mgr_vat_amt.value ) {
                        alert("부가세 부분취소 금액을 입력하세요.!!");
                        frm_mgr.mgr_vat_amt.focus();
                        return;
                    }
                }
            }
            bRetVal = true;
            if ( bRetVal ) frm_mgr.submit();
        }
    </script>
</head>
<body onload="f_init();">
<form name="frm_mgr" method="post" action="../easypay_request.php">

    <!-- [필수]거래구분(수정불가) -->
    <input type="hidden" name="EP_tr_cd" value="00201000">
    <!-- [필수]요청자 IP -->
    <input type="hidden" name="req_ip" value="<?=$req_ip?>">

    <table border="0" width="910" cellpadding="10" cellspacing="0">
        <tr>
            <td>
                <!-- title start -->
                <table border="0" width="900" cellpadding="0" cellspacing="0">
                    <tr>
                        <td height="30" bgcolor="#FFFFFF" align="left">&nbsp;<img src="../img/arow3.gif" border="0" align="absmiddle">&nbsp;일반 > <b>변경</b></td>
                    </tr>
                    <tr>
                        <td height="2" bgcolor="#2D4677"></td>
                    </tr>
                </table>
                <!-- title end -->

                <!-- mgr start -->
                <table border="0" width="900" cellpadding="0" cellspacing="0">
                    <tr>
                        <td height="30" bgcolor="#FFFFFF">&nbsp;<img src="../img/arow2.gif" border="0" align="absmiddle">&nbsp;<b>변경정보</b>(*필수)</td>
                    </tr>
                </table>
                <table border="0" width="900" cellpadding="0" cellspacing="1" bgcolor="#DCDCDC">
                    <tr height="25">
                        <!-- [필수]에스크로 거래는 반드시 에스크로 변경으로 요청하시기 바랍니다. -->
                        <td bgcolor="#EDEDED" width="150">&nbsp;*거래구분</td>
                        <td bgcolor="#FFFFFF" width="300" colspan="3">&nbsp;<select name="mgr_txtype" class="input_F">
                                <option value="20" >매입요청</option>
                                <option value="30" >매입취소</option>
                                <option value="31" >부분매입취소</option>
                                <option value="33" >계좌이체부분취소</option>
                                <option value="40" selected>즉시취소</option>
                            </select></td>
                    </tr>
                    <tr height="25">
                        <!-- [필수] PG거래번호 -->
                        <td bgcolor="#EDEDED" width="150">&nbsp;*PG거래번호</td>
                        <td bgcolor="#FFFFFF" width="300" colspan="3">&nbsp;<input type="text" name="org_cno" size="50" class="input_F"></td>
                    </tr>
                    <tr height="25">
                        <!-- [필수] 요청자ID -->
                        <td bgcolor="#EDEDED" width="150">&nbsp;*요청자ID</td>
                        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="req_id" size="50" class="input_F"></td>
                        <!-- [옵션] 변경사유 -->
                        <td bgcolor="#EDEDED" width="150">&nbsp;변경사유</td>
                        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_msg" size="50" class="input_A"></td>
                    </tr>
                    <tr height="25">
                        <!-- [옵션]부분취소 요청 시 필수항목 -->
                        <td bgcolor="#EDEDED" width="150">&nbsp;금액(부분취소 금액)</td>
                        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_amt" size="50" class="input_A"></td>
                        <td bgcolor="#EDEDED" width="150">&nbsp;부분취소 잔액</td>
                        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_rem_amt" size="50" class="input_A"></td>
                    </tr>
                    <tr height="25">
                        <td bgcolor="#EDEDED" width="150">&nbsp;과세구분</td>
                        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="mgr_tax_flg" class="input_A">
                                <option value="" selected>일반</option>
                                <option value="TG01">복합과세</option>
                            </select></td>
                        <td bgcolor="#EDEDED" width="150">&nbsp;과세 부분취소 금액</td>
                        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_tax_amt" size="50" class="input_F"></td>
                    </tr>
                    <tr height="25">
                        <td bgcolor="#EDEDED" width="150">&nbsp;비과세 부분취소 금액</td>
                        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_free_amt" size="50" class="input_F"></td>
                        <td bgcolor="#EDEDED" width="150">&nbsp;부가세 부분취소 금액</td>
                        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_vat_amt" size="50" class="input_F"></td>
                    </tr>
                </table>

                <!-- mgr Data END -->

                <table border="0" width="900" cellpadding="0" cellspacing="0">
                    <tr>
                        <td height="30" align="center" bgcolor="#FFFFFF"><input type="button" value="변 경" class="input_D" style="cursor:hand;" onclick="javascript:f_submit();"></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</form>
</body>
</html>