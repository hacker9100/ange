<?
/* -------------------------------------------------------------------------- */
/* ::: IP ���� ����                                                           */
/* -------------------------------------------------------------------------- */
$req_ip = $_SERVER['REMOTE_ADDR']; // [�ʼ�]��û�� IP
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
        
        /*  �������� Ȯ�� */
        if( !frm_mgr.org_cno.value ) {
            alert("PG�ŷ���ȣ�� �Է��ϼ���!!");
            frm_mgr.org_cno.focus();
            return;
        }
        
        if( !frm_mgr.req_id.value ) {
            alert("��û��ID�� �Է��ϼ���!!");
            frm_mgr.req_id.focus();
            return;
        }
        /* �κ���� �� DATA ���� �ʿ� */            
        if ( frm_mgr.mgr_txtype.value == "31" ) {
        	
        	if ( !frm_mgr.mgr_amt.value ) {
                alert("�ݾ��� �Է��ϼ���!!");
                frm_mgr.mgr_amt.focus();
                return;
            }
            
            if ( !frm_mgr.mgr_rem_amt.value ) {
                alert("�κ���� �ܾ����� �Է��ϼ���!!");
                frm_mgr.mgr_rem_amt.focus();
                return;
            } 	
        }
        
        if ( frm_mgr.mgr_txtype.value == "31" || frm_mgr.mgr_txtype.value == "33" ) {
	        if( frm_pay.mgr_tax_flg.value == "TG01" )
	        {
				if( !frm_pay.mgr_tax_amt.value ) {
		            alert("���� �κ���� �ݾ��� �Է��ϼ���.!!");
		            frm_pay.mgr_tax_amt.focus();
		            return;
		        }
		        
		        if( !frm_pay.mgr_free_amt.value ) {
		            alert("����� �κ���� �ݾ��� �Է��ϼ���.!!");
		            frm_pay.mgr_free_amt.focus();
		            return;
		        }
		        
		        if( !frm_pay.mgr_vat_amt.value ) {
		            alert("�ΰ��� �κ���� �ݾ��� �Է��ϼ���.!!");
		            frm_pay.mgr_vat_amt.focus();
		            return;
		        }
	        }
        }
        bRetVal = true;
        if ( bRetVal ) frm_mgr.submit();
    }
</script>
</head>
<body>
<form name="frm_mgr" method="post" action="../easypay_request.php">
	
<!-- [�ʼ�]�ŷ�����(�����Ұ�) -->
<input type="hidden" name="EP_tr_cd" value="00201000">
<!-- [�ʼ�]��û�� IP -->
<input type="hidden" name="req_ip" value="<?=$req_ip?>">

<table border="0" width="910" cellpadding="10" cellspacing="0">
<tr>
    <td>
    <!-- title start -->
	<table border="0" width="900" cellpadding="0" cellspacing="0">
	<tr>
		<td height="30" bgcolor="#FFFFFF" align="left">&nbsp;<img src="../img/arow3.gif" border="0" align="absmiddle">&nbsp;�Ϲ� > <b>����</b></td>
	</tr>
	<tr>
		<td height="2" bgcolor="#2D4677"></td>
	</tr>
	</table>
	<!-- title end -->
    
    <!-- mgr start -->
    <table border="0" width="900" cellpadding="0" cellspacing="0">
    <tr>
        <td height="30" bgcolor="#FFFFFF">&nbsp;<img src="../img/arow2.gif" border="0" align="absmiddle">&nbsp;<b>��������</b>(*�ʼ�)</td>
    </tr>
    </table>
    <table border="0" width="900" cellpadding="0" cellspacing="1" bgcolor="#DCDCDC">
    <tr height="25">
    	<!-- [�ʼ�]����ũ�� �ŷ��� �ݵ�� ����ũ�� �������� ��û�Ͻñ� �ٶ��ϴ�. -->
        <td bgcolor="#EDEDED" width="150">&nbsp;*�ŷ�����</td>
        <td bgcolor="#FFFFFF" width="300" colspan="3">&nbsp;<select name="mgr_txtype" class="input_F">        	        	
            <option value="20" >���Կ�û</option>
            <option value="30" >�������</option>
            <option value="31" >�κи������</option>
            <option value="33" >������ü�κ����</option>
            <option value="40" selected>������</option>
        </select></td>        
    </tr>
    <tr height="25">
    	<!-- [�ʼ�] PG�ŷ���ȣ -->
        <td bgcolor="#EDEDED" width="150">&nbsp;*PG�ŷ���ȣ</td>
        <td bgcolor="#FFFFFF" width="300" colspan="3">&nbsp;<input type="text" name="org_cno" size="50" class="input_F"></td>        
    </tr>
    <tr height="25">
    	<!-- [�ʼ�] ��û��ID -->
        <td bgcolor="#EDEDED" width="150">&nbsp;*��û��ID</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="req_id" size="50" class="input_F"></td>
        <!-- [�ɼ�] ������� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;�������</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_msg" size="50" class="input_A"></td>
    </tr>    
    <tr height="25">
    	<!-- [�ɼ�]�κ���� ��û �� �ʼ��׸� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;�ݾ�(�κ���� �ݾ�)</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_amt" size="50" class="input_A"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;�κ���� �ܾ�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_rem_amt" size="50" class="input_A"></td>
    </tr>    
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;��������</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="mgr_tax_flg" class="input_A">
			<option value="" selected>�Ϲ�</option>
            <option value="TG01">���հ���</option>
        </select></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;���� �κ���� �ݾ�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_tax_amt" size="50" class="input_F"></td>
    </tr>
    <tr height="25">
        <td bgcolor="#EDEDED" width="150">&nbsp;����� �κ���� �ݾ�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_free_amt" size="50" class="input_F"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;�ΰ��� �κ���� �ݾ�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_vat_amt" size="50" class="input_F"></td>
    </tr>
    </table>
    
    <!-- mgr Data END -->
    
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