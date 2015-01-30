<?
    include("./inc/easypay_config.php");  // ȯ�漳�� ���� includ
?>
<html>
<head>
<title>KICC EASYPAY7.0 SAMPLE</title>
<meta name="robots" content="noindex, nofollow"> 
<meta http-equiv="content-type" content="text/html; charset=euc-kr">
<meta http-equiv="X-UA-Compatible" content="requiresActiveX=true">
<meta http-equiv="Expires" content="0"/>
<meta http-equiv="Pragma" content="no-cache"/>
<link href="../css/style.css" rel="stylesheet" type="text/css">
<script language="javascript" src="../js/default.js" type="text/javascript"></script>
<!-- �׽�Ʈ ��ũ��Ʈ �Դϴ�. -->
<script language="javascript" src="http://testpg.easypay.co.kr/plugin/EasyPayPlugin.js"></script>
<!-- HTTPS -->
<!--script language="javascript" src="https://pg.easypay.co.kr/plugin/EasyPayPlugin.js"></script-->
<!--script language="javascript" src="https://pg.easypay.co.kr/plugin/EasyPayPlugin_utf8.js"></script-->
<!-- HTTP -->
<!--script language="javascript" src="http://pg.easypay.co.kr/plugin/EasyPayPlugin.js"></script-->
<!--script language="javascript" src="http://pg.easypay.co.kr/plugin/EasyPayPlugin_utf8.js"></script-->
<script type="text/javascript">
    
    /* �÷����� ��ġ(Ȯ��) */
    StartSmartInstall();
	
    /* �Է� �ڵ� Setting */
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
        
        frm_pay.EP_mall_pwd.value       = "1111";
        frm_pay.EP_vacct_end_date.value = "" + year + month + date;               //��������Աݸ�����
        frm_pay.EP_order_no.value       = "ORDER_" + year + month + date + time;   //�������ֹ���ȣ
        frm_pay.EP_user_id.value        = "USER_" + time;                           //��ID
        frm_pay.EP_user_nm.value        = "�����";
        frm_pay.EP_user_mail.value      = "test@kicc.co.kr";
        frm_pay.EP_user_phone1.value    = "0212344567";
        frm_pay.EP_user_phone2.value    = "01012344567";
        frm_pay.EP_user_addr.value      = "���� ��õ�� ���굿 459-9 ";
        frm_pay.EP_product_nm.value     = "���׽�Ʈ��ǰ��";
        frm_pay.EP_product_amt.value    = "50000";
        
        frm_pay.EP_recv_id.value = frm_pay.EP_user_id.value;
        frm_pay.EP_recv_nm.value = frm_pay.EP_user_nm.value;
        frm_pay.EP_recv_tel.value = frm_pay.EP_user_phone1.value;
        frm_pay.EP_recv_mob.value = frm_pay.EP_user_phone2.value;
        frm_pay.EP_recv_mail.value = frm_pay.EP_user_mail.value;
        
        frm_pay.EP_recv_zip.value = "158052";
        frm_pay.EP_recv_addr1.value = frm_pay.EP_user_addr.value;
        frm_pay.EP_recv_addr2.value = "LG�����м���7��";
        
        frm_pay.EP_bk_cnt.value = "2";        
        frm_pay.EP_bk_totamt.value = frm_pay.EP_product_amt.value;
        
        frm_pay.prd_no[0].value = "P" + year + month + date + time;;
        frm_pay.prd_amt[0].value = frm_pay.EP_product_amt.value/2;
        frm_pay.prd_nm[0].value = frm_pay.EP_product_nm.value + "[0]";
        
        frm_pay.prd_no[1].value = "P" + year + month + date + time;;
        frm_pay.prd_amt[1].value = frm_pay.EP_product_amt.value/2;
        frm_pay.prd_nm[1].value = frm_pay.EP_product_nm.value + "[1]";

    }
    
    function f_submit() {
        var frm_pay = document.frm_pay;
        var tmp = 1;
        var total_prd_amt = 0;
        var EP_bk_goodinfo = "";
        
        var chr30 = String.fromCharCode(30);	// ASCII �ڵ尪 30
        var chr31 = String.fromCharCode(31);	// ASCII �ڵ尪 31

        var bRetVal = false;
        
        /* ���������ī�帮��Ʈ */
        var usedcard_code = "";
        for( var i=0; i < frm_pay.usedcard_code.length; i++) {
            if (frm_pay.usedcard_code[i].checked) {
                usedcard_code += frm_pay.usedcard_code[i].value + ":";
            }
        }
        frm_pay.EP_usedcard_code.value = usedcard_code;
        
        /* ����������ฮ��Ʈ */
        var vacct_bank = "";
        for( var i=0; i < frm_pay.vacct_bank.length; i++) {
            if (frm_pay.vacct_bank[i].checked) {
                vacct_bank += frm_pay.vacct_bank[i].value + ":";
            }
        }
        frm_pay.EP_vacct_bank.value = vacct_bank;
                        
        
        /* ����ũ�� ���� Ȯ�� */
        
        if( !frm_pay.EP_escr_type.value ) {
            alert("����ũ�� ������ �����ϼ���.!!");
            frm_pay.EP_escr_type.focus();
            return;
        }
        
        if( !frm_pay.EP_recv_id.value ) {
            alert("������ID�� �Է��ϼ���!!");
            frm_pay.EP_recv_id.focus();
            return;
        }
        
        if( !frm_pay.EP_recv_nm.value ) {
            alert("�����ڸ��� �Է��ϼ���!!");
            frm_pay.EP_recv_nm.focus();
            return;
        }
        
        if( !frm_pay.EP_recv_tel.value ) {
            alert("��������ȭ��ȣ�� �Է��ϼ���!!");
            frm_pay.EP_recv_tel.focus();
            return;
        }
        
        if( !frm_pay.EP_recv_mob.value ) {
            alert("�������޴����� �Է��ϼ���!!");
            frm_pay.EP_recv_mob.focus();
            return;
        }
        
        if( !frm_pay.EP_recv_mail.value ) {
            alert("������Email�� �Է��ϼ���!!");
            frm_pay.EP_recv_mail.focus();
            return;
        }
        
        if( !frm_pay.EP_recv_zip.value ) {
            alert("�����ڿ����ȣ�� �Է��ϼ���!!");
            frm_pay.EP_recv_zip.focus();
            return;
        }
        
        if( !frm_pay.EP_recv_addr1.value ) {
            alert("�������ּ�1�� �Է��ϼ���!!");
            frm_pay.EP_recv_addr1.focus();
            return;
        }
        
        if( !frm_pay.EP_recv_addr2.value ) {
            alert("�������ּ�2�� �Է��ϼ���!!");
            frm_pay.EP_recv_addr2.focus();
            return;
        }

        
        for( var i=0; i < frm_pay.EP_bk_cnt.value ; i++ ) {
            if( !frm_pay.prd_no[i].value ) {
                alert("��ٱ���" + tmp + "�� ��������ǰ��ȣ�� �Է��ϼ���.!!");
                frm_pay.prd_no[i].focus();
                return;
            }
            if( !frm_pay.prd_amt[i].value ) {
                alert("��ٱ���" + tmp + "�� ��������ǰ�ݾ��� �Է��ϼ���.!!");
                frm_pay.prd_amt[i].focus();
                return;
            }
            if( !frm_pay.prd_nm[i].value ) {
                alert("��ٱ���" + tmp + "�� ��������ǰ���� �Է��ϼ���.!!");
                frm_pay.prd_nm[i].focus();
                return;
            }
            tmp++;
            total_prd_amt += parseInt(frm_pay.prd_amt[i].value);
            
            EP_bk_goodinfo += "prd_no=" + frm_pay.prd_no[i].value + chr31 + "prd_amt=" + frm_pay.prd_amt[i].value + chr31 + "prd_nm=" + frm_pay.prd_nm[i].value + chr31 + chr30;
        }
            
        if( parseInt(frm_pay.EP_bk_totamt.value) != parseInt(total_prd_amt) ) {
            alert("��ٱ����ѱݾװ� ��ٱ��� ��ǰ�ѱݾ��� ��ġ���� �ʽ��ϴ�.!!");
            return;
        }
        
        frm_pay.EP_bk_goodinfo.value = EP_bk_goodinfo;
                
        /* Easypay Plugin ���� */
	    if ( StartPayment( frm_pay ) == true ) {        	
            if ( frm_pay.EP_res_cd.value == "0000" ) {
                bRetVal = true;
            } else {
                /* ���� ���� �޽��� */
                alert( "�����ڵ�:"   + frm_pay.EP_res_cd.value + "]\n" +
                       "����޽���:" + frm_pay.EP_res_msg.value + "]\n" );
            }
        } else {
            /* StartPayment false �޽��� */
            alert( "�����ڵ�:"   + frm_pay.EP_res_cd.value + "]\n" +
                   "����޽���:" + frm_pay.EP_res_msg.value + "]\n" );
        }
        
        if ( bRetVal ) frm_pay.submit();
    }
</script>
</head>
<body onload="f_init();">
<form name="frm_pay" method="post" action="../easypay_request.php">

<input type="hidden" name="EP_os_cert_flag"     value="2">    <!-- [�����Ұ�] �ؿ�ī���������� //-->	
<input type="hidden" name="EP_agent_ver"        value="PHP">  <!-- ���������߾�� -->


<!-- �÷��������� ���� �޴� �ʵ� [����Ұ�] //-->
<input type="hidden" name="EP_res_cd"           value="">     <!-- �����ڵ�     //-->
<input type="hidden" name="EP_res_msg"          value="">     <!-- ����޽���   //-->
<input type="hidden" name="EP_tr_cd"            value="">     <!-- �÷����� ��û���� //-->
<input type="hidden" name="EP_trace_no"         value="">     <!-- �ŷ�������ȣ //-->
<input type="hidden" name="EP_sessionkey"       value="">     <!-- ��ȣȭŰ     //-->
<input type="hidden" name="EP_encrypt_data"     value="">     <!-- ��ȣȭ����   //-->

<input type="hidden" name="EP_card_code"        value="">     <!-- ����ī���ڵ�   //-->
<input type="hidden" name="EP_ret_pay_type"     value="">     <!-- �������� //-->
<input type="hidden" name="EP_ret_complex_yn"   value="">     <!-- ���հ�������   //-->

<!-- �÷����� �̿��� ���� ������ �����ʵ� -->
<input type="hidden" name="EP_user_define1"     value="">     <!-- ������ �����ʵ�   //-->

<table border="0" width="910" cellpadding="10" cellspacing="0">
<tr>
    <td>
    <!-- title start -->
	<table border="0" width="900" cellpadding="0" cellspacing="0">
	<tr>
		<td height="30" bgcolor="#FFFFFF" align="left">&nbsp;<img src="../img/arow3.gif" border="0" align="absmiddle">&nbsp;����ũ�� > <b>����</b></td>
	</tr>
	<tr>
		<td height="2" bgcolor="#2D4677"></td>
	</tr>
	</table>
	<!-- title end -->
	   
    <!-- mallinfo start -->
	<table border="0" width="900" cellpadding="0" cellspacing="0">
	<tr>
		<td height="30" bgcolor="#FFFFFF">&nbsp;<img src="../img/arow2.gif" border="0" align="absmiddle">&nbsp;<b>����������</b>(*�ʼ�)</td>
	</tr>
	</table>
	
	<table border="0" width="900" cellpadding="0" cellspacing="1" bgcolor="#DCDCDC">
	<tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*���������̵�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_mall_id" value="<?=$g_mall_id?>" size="50" maxlength="8" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;�������н�����</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_mall_pwd" value="" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;��������</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_mall_nm" value="�ѱ��������(��) �׽�Ʈ" size="50" class="input_A"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;������ CI URL</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_ci_url" value="http://testpg.easypay.co.kr/plugin/logo_kicc.png" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;������������</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_lang_flag" class="input_A">
            <option value="" selected>�ѱ�</option>
            <option value="ENG">����</option>
        </select></td>
    </tr>
    </table>
    <!-- mallinfo end -->
    
    <!-- plugin start -->
    <table border="0" width="900" cellpadding="0" cellspacing="0">
    <tr>
        <td height="30" bgcolor="#FFFFFF">&nbsp;<img src="../img/arow2.gif" border="0" align="absmiddle">&nbsp;<b>�÷���������</b>(*�ʼ�)</td>
    </tr>
    </table>

    <table border="0" width="900" cellpadding="0" cellspacing="1" bgcolor="#DCDCDC">
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*��������</td>
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;
        	<select name="EP_pay_type" class="input_F">
            <option value="11" selected>�ſ�ī��</option>            
            <option value="21">������ü</option>
            <option value="22">�������Ա�</option>
            <option value="31">�޴���</option>
            <option value="32">��ȭ����</option>
            <option value="41">����Ʈ</option>
            <option value="11:21:22:31:32:41">����������</option>
        </select></td>
    </tr>
    <tr height="25">
    	<td bgcolor="#EDEDED" width="150">&nbsp;*��ȭ�ڵ�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_currency" class="input_F">
            <option value="00" selected>��ȭ</option>
            <option value="01">�޷�</option>
        </select></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;���հ��� ��뿩��</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_complex_yn" class="input_A">
            <option value="" selected>����</option>
            <option value="Y">Y</option>
            <option value="N">N</option>
        </select></td>
    </tr>    
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;���������<br>&nbsp;ī�帮��Ʈ</td>
    	<td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;<input type="checkbox" name="usedcard_code" value="" checked>��üī��
        </td>        
        <!-- ���������� ��� ������ ī�常 �����ϰ� ���� �� �Ʒ� �ڵ带 ���� �Ͻñ� �ٶ��ϴ�.
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;<input type="checkbox" name="usedcard_code" value="029" checked>����(029)
            <input type="checkbox" name="usedcard_code" value="027" checked>����(027)
            <input type="checkbox" name="usedcard_code" value="031" checked>�Ｚ(031)
            <input type="checkbox" name="usedcard_code" value="008" checked>��ȯ(008)
            <input type="checkbox" name="usedcard_code" value="026" checked>��(026)
            <input type="checkbox" name="usedcard_code" value="016" checked>����(016)
            <input type="checkbox" name="usedcard_code" value="047" checked>�Ե�(047)
            <input type="checkbox" name="usedcard_code" value="018" checked>NH����(018)
            <input type="checkbox" name="usedcard_code" value="006" checked>�ϳ�SK(006)<br>
            &nbsp;<input type="checkbox" name="usedcard_code" value="022" checked>��Ƽ(022)
            <input type="checkbox" name="usedcard_code" value="021" checked>�츮(021)
            <input type="checkbox" name="usedcard_code" value="002" checked>����(002)
            <input type="checkbox" name="usedcard_code" value="017" checked>����(017)
            <input type="checkbox" name="usedcard_code" value="010" checked>����(010)
            <input type="checkbox" name="usedcard_code" value="011" checked>����(011)
            <input type="checkbox" name="usedcard_code" value="001" checked>����(001)
            <input type="checkbox" name="usedcard_code" value="058" checked>���(058)
            <input type="checkbox" name="usedcard_code" value="126" checked>����(126)<br>
            &nbsp;<input type="checkbox" name="usedcard_code" value="226" checked>��ü��(226)
            <input type="checkbox" name="usedcard_code" value="050" checked>VISA(050)
            <input type="checkbox" name="usedcard_code" value="028" checked>JCB(028)
            <input type="checkbox" name="usedcard_code" value="048" checked>���̳ʽ�(048)
            <input type="checkbox" name="usedcard_code" value="049" checked>Master(049)
        </td>
        -->
        <!-- �÷����ο� ���޵� ī��� ����Ʈ ���� -->
        <input type="hidden" name="EP_usedcard_code">
    </tr>
    <tr height="25">        
        <td bgcolor="#EDEDED" width="150">&nbsp;*�ſ�ī���������</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_cert_type" class="input_F">
            <option value="" selected>�Ϲ�</option>
            <!-- ����/�������� ��� Ư�డ������ ��� �����մϴ�.-->
            <option value="0">����</option>
            <option value="1">������</option>
        </select></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;�Һΰ���</td>        
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_quota" value="00:02:03:04:05:06:07:08:09:10:11:12" size="50" class="input_A"></td>      
    </tr>
    <tr height="25">
    	<td bgcolor="#EDEDED" width="150">&nbsp;�����ڻ�뿩��</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_noinst_flag" class="input_A">
            <option value="" selected>DB��ȸ</option>
            <option value="Y">������</option>
            <option value="N">�Ϲ�</option>
        </select></td>        
        <td bgcolor="#EDEDED" width="150">&nbsp;�����ڼ���<br>&nbsp;(ī���ڵ�-�Һΰ���)</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_noinst_term" value="029-02:03:04:05:06,027-02:03" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;�������<br>&nbsp;���� ����Ʈ</td>
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;<input type="checkbox" name="vacct_bank" value="003" checked>�������(003)
            <input type="checkbox" name="vacct_bank" value="004" checked>��������(004)
            <input type="checkbox" name="vacct_bank" value="011" checked>�����߾�ȸ(011)
            <input type="checkbox" name="vacct_bank" value="020" checked>�츮����(020)<br>
            &nbsp;<input type="checkbox" name="vacct_bank" value="023" checked>SC��������(023)
            <input type="checkbox" name="vacct_bank" value="026" checked>��������(026)
            <input type="checkbox" name="vacct_bank" value="032" checked>�λ�����(032)
            <input type="checkbox" name="vacct_bank" value="071" checked>��ü��(071)
            <input type="checkbox" name="vacct_bank" value="081" checked>�ϳ�����(081)
        <input type="hidden" name="EP_vacct_bank">
        </td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;�������<br>&nbsp;�Աݸ�����</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_vacct_end_date" value="" size="50" class="input_A"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;�������<br>&nbsp;�Աݸ���ð�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_vacct_end_time" value="235959" size="50" class="input_A"></td>
    </tr>
    </table>
    <!-- plugin end -->
   
    <!-- order start -->
    <table border="0" width="900" cellpadding="0" cellspacing="0">
    <tr>
        <td height="30" bgcolor="#FFFFFF">&nbsp;<img src="../img/arow2.gif" border="0" align="absmiddle">&nbsp;<b>�ֹ�����</b>(*�ʼ�)</td>
    </tr>
    </table>
    <table border="0" width="900" cellpadding="0" cellspacing="1" bgcolor="#DCDCDC">
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*�ֹ���ȣ</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_order_no" size="50" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;����ڱ���</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_user_type" class="input_A">
            <option value="1">�Ϲ�</option>
            <option value="2" selected>ȸ��</option>
        </select>
        </td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;��ID</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_user_id" size="50" class="input_A"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;����</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_user_nm" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;��Email</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_user_mail" size="50" class="input_A"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;����ȭ��ȣ</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_user_phone1" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*���޴���</td>
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;<input type="text" name="EP_user_phone2" size="50" class="input_F"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;���ּ�</td>
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;<input type="text" name="EP_user_addr" size="100" class="input_A"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*��ǰ��</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_product_nm" size="50" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;*��ǰ�ݾ�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_product_amt" size="50" class="input_F"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;��ǰ����</td>
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;<select name="EP_product_type" class="input_A">
            <option value="0" selected>�ǹ�</option>
            <option value="1">������</option>
        </select></td>
    </tr>
    </table>
    <!-- order Data END -->
    
    <!-- escrow Data START -->
    <table border="0" width="900" cellpadding="0" cellspacing="0">
    <tr>
        <td height="30" bgcolor="#FFFFFF">&nbsp;<img src="../img/arow2.gif" border="0" align="absmiddle">&nbsp;<b>����ũ������</b>(*�ʼ�)</td>
    </tr>
    </table>
    <table border="0" width="900" cellpadding="0" cellspacing="1" bgcolor="#DCDCDC">
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*����ũ�� ����</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_escr_type" class="input_F">
            <option value="K" selected>����ũ��</option>
            </select>&nbsp;(����)
        </td>
        <td bgcolor="#EDEDED" width="150">&nbsp;������ID</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_recv_id" size="50" maxlength="50" class="input_F"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*�����ڸ�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_recv_nm" size="50" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;��������ȭ��ȣ</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_recv_tel" size="20" class="input_F"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*�������޴�����ȣ</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_recv_mob" size="50" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;*��Email</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_recv_mail" size="50" class="input_F"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;�����ڿ����ȣ</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_recv_zip" size="50" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;��۱���</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="EP_deli_type" class="input_A">
            <option value="0" selected>�ù�</option>
            <option value="1">�ڰ�</option>
        </select></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;�������ּ�</td>
        <td bgcolor="#FFFFFF" width="750" colspan="3">&nbsp;<input type="text" name="EP_recv_addr1" size="50" class="input_F">
            <input type="text" name="EP_recv_addr2" size="50" class="input_F"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;*��ٱ��ϰǼ�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_bk_cnt" size="2" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;*��ٱ����ѱݾ�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="EP_bk_totamt" size="14" maxlength="14" class="input_F"></td>
    </tr>
    </table>
    <!-- escrow Data END -->
    
    <!-- goodinfo Data START -->
    <input type="hidden" name="EP_bk_goodinfo" value="">   <!-- ��ٱ��� ���� -->
    <table border="0" width="900" cellpadding="0" cellspacing="0">
    <tr>
        <td height="40" bgcolor="#FFFFFF">&nbsp;<img src="../img/arow2.gif" border="0" align="absmiddle">&nbsp;<b>��ٱ�������</b>(*�ʼ�)
        <br>&nbsp;��ٱ��ϰ� ������ �ϰ�� �Ʒ����� �߰� �Ͽ� �����ָ� �˴ϴ�.bk_goodinfo �� �־��ֽø� �˴ϴ�.
        </td>
    </tr>
    </table>
    <table border="0" width="900" cellpadding="0" cellspacing="1" bgcolor="#DCDCDC">
    <tr>
        <td rowspan="2" bgcolor="#EDEDED" width="150">&nbsp;*��ٱ���1</td>
        <td height="25" bgcolor="#EDEDED" width="150">&nbsp;*��������ǰ��ȣ</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="prd_no" size="50" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;*��ǰ �ݾ�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="prd_amt" size="50" class="input_F"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED">&nbsp;*��ǰ��</td>
        <td colspan="3" bgcolor="#FFFFFF">&nbsp;<input type="text" name="prd_nm" size="50" class="input_F"></td>
    </tr>
    </table>
    <table border="0" width="900" cellpadding="0" cellspacing="1" bgcolor="#DCDCDC">
    <tr height="25">
        <td rowspan="2" bgcolor="#EDEDED" width="150">&nbsp;*��ٱ���2</td>
        <td bgcolor="#EDEDED" width="150">&nbsp;*��������ǰ��ȣ</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="prd_no" size="50" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;*��ǰ �ݾ�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="prd_amt" size="50" class="input_F"></td>
    </tr>
    <tr>
        <td height="25" bgcolor="#EDEDED">&nbsp;*��ǰ��</td>
        <td colspan="3" bgcolor="#FFFFFF">&nbsp;<input type="text" name="prd_nm" size="50" class="input_F"></td>
    </tr>
    </table>
    <!-- goodinfo Data END -->
    
    
    <table border="0" width="900" cellpadding="0" cellspacing="0">
    <tr>
        <td height="30" align="center" bgcolor="#FFFFFF"><input type="button" value="�� ��" class="input_D" style="cursor:hand;" onclick="javascript:f_submit();"></td>
    </tr>
    </table>
    </td>
</tr>
</table>
</form>
</body>
</html>
