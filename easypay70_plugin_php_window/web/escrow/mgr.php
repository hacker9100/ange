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
        /* ����ũ�� ������ ���漼�α��� üũ */
        if ( frm_mgr.mgr_txtype.value != "61" ) { 
            alert("����ũ�δ� �ݵ�� ����ũ�� �������� ó���Ͻñ� �ٶ��ϴ�.");
            frm_mgr.mgr_txtype.focus();
            return;
        }
        /* �� �ʵ� ���� üũ�Ͻñ� �ٶ��ϴ�. */
        
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
		<td height="30" bgcolor="#FFFFFF" align="left">&nbsp;<img src="../img/arow3.gif" border="0" align="absmiddle">&nbsp;����ũ�� > <b>����</b></td>
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
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="mgr_txtype" class="input_F">        	
        	<option value="61" selected>����ũ�� ����</option>
            <option value="10" >�������</option>
            <option value="20" >���Կ�û</option>
            <option value="30" >�������</option>
            <option value="31" >�κи������</option>
            <option value="40" >������</option>
        </select></td>
        <!-- [�ʼ�]����ũ�� ����� �ʼ� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;*���漼�α���</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="mgr_subtype" class="input_A">
        	<option value="ES02" selected>�������</option>
            <option value="ES05" >ȯ�ҿ�û</option>
            <option value="ES07" >�����</option>
            <option value="ES08" >����� ��ҿ�û</option>
            <option value="ES09" >����� ��ҿϷ�</option>
            <option value="ES10" >����� ȯ�ҿ�û</option>            
        </select>
        </td>
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
        <!-- [�ɼ�] ������� : ������ ���� ���� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;�������</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_msg" size="50" class="input_A"></td>
    </tr>    
    <tr height="25">
    	<!-- [�ɼ�]ȯ�ҿ�û/����� ȯ�ҿ�û �� �ʼ��׸� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;�ݾ�(�κ����/ȯ�� �ݾ�)</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_amt" size="50" class="input_A"></td>
        <td bgcolor="#EDEDED" width="150">&nbsp;�κ���� �ܾ�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_rem_amt" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
    	<!-- [�ɼ�]ȯ�ҿ�û/����� ȯ�ҿ�û �� �ʼ��׸� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;�����ڵ�</td>
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_bank_cd" size="50" class="input_A"></td>
        <!-- [�ɼ�]ȯ�ҿ�û/����� ȯ�ҿ�û �� �ʼ��׸� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;���¹�ȣ</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_account" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
    	<!-- [�ɼ�]ȯ�ҿ�û/����� ȯ�ҿ�û �� �ʼ��׸� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;�����ָ�</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_depositor" size="50" class="input_A"></td>
        <!-- [�ɼ�]ȯ�ҿ�û/����� ȯ�ҿ�û �� �ʼ��׸� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;�ֹι�ȣ</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="mgr_socno" size="50" class="input_A"></td>
    </tr> 
    <tr height="25">
    	<!-- [�ɼ�]ȯ�ҿ�û/����� ȯ�ҿ�û �� �ʼ��׸� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;����ó</td> 
        <td bgcolor="#FFFFFF" width="300" colspan="3">&nbsp;<input type="text" name="mgr_telno" size="50" class="input_A"></td>        
    </tr>
    <tr height="25">
    	<!-- [�ɼ�]����� ��û �� �ʼ��׸� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;��۱���</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="deli_cd" class="input_A">
        	<option value="DE01" selected>�ڰ�</option>
            <option value="DE02" >�ù�</option>
        </select>
        </td>
        <!-- [�ɼ�]����� ��û �� �ʼ��׸� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;�ù���ڵ�</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<select name="deli_corp_cd" class="input_A">
        	<option value="DC01" selected>�������</option>
            <option value="DC02" >CJGLS</option>
            <option value="DC03" >SC������</option>
            <option value="DC04" >���ο�ĸ</option>
            <option value="DC05" >�����ù�</option>
            <option value="DC06" >�����ͽ��������ù�</option>
            <option value="DC07" >��ü���ù�</option>
            <option value="DC08" >�����ù�</option>
            <option value="DC09" >�����ù�</option>
            <option value="DC10" >KGB�ù�</option>
            <option value="DC11" >�ϳ����ù�</option>
            <option value="DC13" >��Ÿ</option>
        </select>
        </td>
    </tr>
    <tr height="25">
    	<!-- [�ɼ�]����� ��û �� �ʼ��׸� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;����� ��ȣ</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="deli_invoice" size="50" class="input_A"></td>
        <!-- [�ɼ�]����� ��û �� �ʼ��׸� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;������ �̸�</td> 
        <td bgcolor="#FFFFFF" width="300">&nbsp;<input type="text" name="deli_rcv_nm" size="50" class="input_A"></td>
    </tr>
    <tr height="25">
    	<!-- [�ɼ�]����� ��û �� �ʼ��׸� -->
        <td bgcolor="#EDEDED" width="150">&nbsp;������ ����ó</td> 
        <td bgcolor="#FFFFFF" width="300" colspan="3">&nbsp;<input type="text" name="deli_rcv_tel" size="50" class="input_A"></td>        
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