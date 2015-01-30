<?
/* -------------------------------------------------------------------------- */
/* ::: IP 정보 설정                                                           */
/* -------------------------------------------------------------------------- */
$req_ip = $_SERVER['REMOTE_ADDR']; // [필수]요청자 IP
?>	
<html>
<head>	
<title>KICC EASYPAY7.0 SAMPLE</title>
<meta name="robots" content="noindex, nofollow"> 
<meta http-equiv="content-type" content="text/html; charset=euc-kr">
<link href="../css/style.css" rel="stylesheet" type="text/css">
<script language="javascript" src="../js/default.js" type="text/javascript"></script>
<script type="text/javascript">

   
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
        /* 에스크로 변경은 변경세부구분 체크 */
        if ( frm_mgr.mgr_txtype.value != "61" ) { 
            alert("에스크로는 반드시 에스크로 변경으로 처리하시기 바랍니다.");
            frm_mgr.mgr_txtype.focus();
            return;
        }
        /* 각 필드 값을 체크하시기 바랍니다. */
        
        bRetVal = true;
        if ( bRetVal ) frm_mgr.submit();
    }
</script>
</head>
<body>
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
		<td height="30" bgcolor="#FFFFFF" align="left">&nbsp;<img src="../img/arow3.gif" border="0" align="absmiddle">&nbsp;에스크로 > <b>변경</b></td>
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
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="mgr_txtype" class="input_F">        	
        	<option value="61" selected>에스크로 변경</option>
            <option value="10" >승인취소</option>
            <option value="20" >매입요청</option>
            <option value="30" >매입취소</option>
            <option value="31" >부분매입취소</option>
            <option value="40" >즉시취소</option>
        </select></td>
        <!-- [필수]에스크로 변경시 필수 -->
        <td bgcolor="#EDEDED" width="150">&nbsp;*변경세부구분</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="mgr_subtype" class="input_A">
        	<option value="ES02" selected>승인취소</option>
            <option value="ES05" >환불요청</option>
            <option value="ES07" >배송중</option>
            <option value="ES08" >배송중 취소요청</option>
            <option value="ES09" >배송중 취소완료</option>
            <option value="ES10" >배송중 환불요청</option>            
        </select>
        </td>
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
        <!-- [옵션] 변경사유 : 간략한 변경 사유 -->
        <td bgcolor="#EDEDED" width="150">&nbsp;변경사유</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_msg" size="50" class="input_A"></td>
    </tr>    
    <tr height="25">
    	<!-- [옵션]환불요청/배송중 환불요청 시 필수항목 -->
        <td bgcolor="#EDEDED" width="150">&nbsp;금액(부분취소/환불 금액)</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_amt" size="50" class="input_A"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;부분취소 잔액</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_rem_amt" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
    	<!-- [옵션]환불요청/배송중 환불요청 시 필수항목 -->
        <td bgcolor="#EDEDED" width="150">&nbsp;은행코드</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_bank_cd" size="50" class="input_A"></td>
        <!-- [옵션]환불요청/배송중 환불요청 시 필수항목 -->
        <td bgcolor="#EDEDED" width="150">&nbsp;계좌번호</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_account" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
    	<!-- [옵션]환불요청/배송중 환불요청 시 필수항목 -->
        <td bgcolor="#EDEDED" width="150">&nbsp;예금주명</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_depositor" size="50" class="input_A"></td>
        <!-- [옵션]환불요청/배송중 환불요청 시 필수항목 -->
        <td bgcolor="#EDEDED" width="150">&nbsp;주민번호</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_socno" size="50" class="input_A"></td>
    </tr> 
    <tr height="25">
    	<!-- [옵션]환불요청/배송중 환불요청 시 필수항목 -->
        <td bgcolor="#EDEDED" width="150">&nbsp;연락처</td> 
        <td bgcolor="#FFFFFF" width="300" colspan="3">&nbsp;<input type="text" name="mgr_telno" size="50" class="input_A"></td>        
    </tr>
    <tr height="25">
    	<!-- [옵션]배송중 요청 시 필수항목 -->
        <td bgcolor="#EDEDED" width="150">&nbsp;배송구분</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="deli_cd" class="input_A">
        	<option value="DE01" selected>자가</option>
            <option value="DE02" >택배</option>
        </select>
        </td>
        <!-- [옵션]배송중 요청 시 필수항목 -->
        <td bgcolor="#EDEDED" width="150">&nbsp;택배사코드</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="deli_corp_cd" class="input_A">
        	<option value="DC01" selected>대한통운</option>
            <option value="DC02" >CJGLS</option>
            <option value="DC03" >SC로지스</option>
            <option value="DC04" >옐로우캡</option>
            <option value="DC05" >로젠택배</option>
            <option value="DC06" >동부익스프레스택배</option>
            <option value="DC07" >우체국택배</option>
            <option value="DC08" >한진택배</option>
            <option value="DC09" >현대택배</option>
            <option value="DC10" >KGB택배</option>
            <option value="DC11" >하나로택배</option>
            <option value="DC13" >기타</option>
        </select>
        </td>
    </tr>
    <tr height="25">
    	<!-- [옵션]배송중 요청 시 필수항목 -->
        <td bgcolor="#EDEDED" width="150">&nbsp;운송장 번호</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="deli_invoice" size="50" class="input_A"></td>
        <!-- [옵션]배송중 요청 시 필수항목 -->
        <td bgcolor="#EDEDED" width="150">&nbsp;수령인 이름</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="deli_rcv_nm" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
    	<!-- [옵션]배송중 요청 시 필수항목 -->
        <td bgcolor="#EDEDED" width="150">&nbsp;수령인 연락처</td> 
        <td bgcolor="#FFFFFF" width="300" colspan="3">&nbsp;<input type="text" name="deli_rcv_tel" size="50" class="input_A"></td>        
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