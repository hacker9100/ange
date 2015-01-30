<?php
    include($_SERVER["DOCUMENT_ROOT"]."/easypay70_plugin_php_window/web/inc/easypay_config.php");
    include($_SERVER["DOCUMENT_ROOT"]."/easypay70_plugin_php_window/web/easypay_client.php");
/* -------------------------------------------------------------------------- */
/* ::: ó������ ����                                                          */
/* -------------------------------------------------------------------------- */
$TRAN_CD_NOR_PAYMENT    = "00101000";   // ����(�Ϲ�, ����ũ��)
$TRAN_CD_NOR_MGR        = "00201000";   // ����(�Ϲ�, ����ũ��)

/* -------------------------------------------------------------------------- */
/* ::: �÷����� �������� ����                                                 */
/* -------------------------------------------------------------------------- */
$tr_cd            = $_POST["EP_tr_cd"];            // [�ʼ�]��û����
$trace_no         = $_POST["EP_trace_no"];         // [�ʼ�]����������ȣ
$sessionkey       = $_POST["EP_sessionkey"];       // [�ʼ�]��ȣȭŰ
$encrypt_data     = $_POST["EP_encrypt_data"];     // [�ʼ�]��ȣȭ ����Ÿ
    
$pay_type         = $_POST["EP_ret_pay_type"];     // ��������
$complex_yn       = $_POST["EP_ret_complex_yn"];   // ���հ�������
$card_code        = $_POST["EP_card_code"];        // ī���ڵ�

/* -------------------------------------------------------------------------- */
/* ::: ���� �ֹ� ���� ����                                                    */
/* -------------------------------------------------------------------------- */
$order_no         = $_POST["EP_order_no"];         // [�ʼ�]�ֹ���ȣ
$user_type        = $_POST["EP_user_type"];        // [����]����ڱ��б���[1:�Ϲ�,2:ȸ��]
$memb_user_no     = $_POST["EP_memb_user_no"];     // [����]������ ���Ϸù�ȣ
$user_id          = $_POST["EP_user_id"];          // [����]�� ID
$user_nm          = $_POST["EP_user_nm"];          // [�ʼ�]����
$user_mail        = $_POST["EP_user_mail"];        // [�ʼ�]�� E-mail
$user_phone1      = $_POST["EP_user_phone1"];      // [����]������ �� ��ȭ��ȣ
$user_phone2      = $_POST["EP_user_phone2"];      // [����]������ �� �޴���
$user_addr        = $_POST["EP_user_addr"];        // [����]������ �� �ּ�
$product_type     = $_POST["EP_product_type"];     // [����]��ǰ��������[0:�ǹ�,1:������]
$product_nm       = $_POST["EP_product_nm"];       // [�ʼ�]��ǰ��
$product_amt      = $_POST["EP_product_amt"];      // [�ʼ�]��ǰ�ݾ�

/* -------------------------------------------------------------------------- */
/* ::: ������� ���� ����                                                     */
/* -------------------------------------------------------------------------- */
$mgr_txtype       = $_POST["mgr_txtype"];          // [�ʼ�]�ŷ�����
$mgr_subtype      = $_POST["mgr_subtype"];         // [����]���漼�α���
$org_cno          = $_POST["org_cno"];             // [�ʼ�]���ŷ�������ȣ
$mgr_amt          = $_POST["mgr_amt"];             // [����]�κ����/ȯ�ҿ�û �ݾ�
$mgr_rem_amt      = $_POST["mgr_rem_amt"];         // [����]�κ���� �ܾ�
$mgr_tax_flg      = $_POST["mgr_tax_flg"];         // [�ʼ�]�������� �÷���(TG01:���հ��� ����ŷ�)
$mgr_tax_amt      = $_POST["mgr_tax_amt"];         // [�ʼ�]�����κ���� �ݾ�(���հ��� ���� �� �ʼ�)
$mgr_free_amt     = $_POST["mgr_free_amt"];        // [�ʼ�]������κ���� �ݾ�(���հ��� ���� �� �ʼ�)
$mgr_vat_amt      = $_POST["mgr_vat_amt"];         // [�ʼ�]�ΰ��� �κ���ұݾ�(���հ��� ���� �� �ʼ�)
$mgr_bank_cd      = $_POST["mgr_bank_cd"];         // [����]ȯ�Ұ��� �����ڵ�
$mgr_account      = $_POST["mgr_account"];         // [����]ȯ�Ұ��� ��ȣ
$mgr_depositor    = $_POST["mgr_depositor"];       // [����]ȯ�Ұ��� �����ָ�
$mgr_socno        = $_POST["mgr_socno"];           // [����]ȯ�Ұ��� �ֹι�ȣ
$mgr_telno        = $_POST["mgr_telno"];           // [����]ȯ�Ұ� ����ó
$deli_cd          = $_POST["deli_cd"];             // [����]��۱���[�ڰ�:DE01,�ù�:DE02]
$deli_corp_cd     = $_POST["deli_corp_cd"];        // [����]�ù���ڵ�
$deli_invoice     = $_POST["deli_invoice"];        // [����]����� ��ȣ
$deli_rcv_nm      = $_POST["deli_rcv_nm"];         // [����]������ �̸�
$deli_rcv_tel     = $_POST["deli_rcv_tel"];        // [����]������ ����ó
$req_ip           = $_POST["req_ip"];              // [�ʼ�]��û�� IP
$req_id           = $_POST["req_id"];              // [����]������ ������ �α��� ���̵�
$mgr_msg          = $_POST["mgr_msg"];             // [����]���� ����

/* -------------------------------------------------------------------------- */
/* ::: ���� ���                                                              */
/* -------------------------------------------------------------------------- */
$res_cd     = "";
$res_msg    = "";

/* -------------------------------------------------------------------------- */
/* ::: EasyPayClient �ν��Ͻ� ���� [����Ұ� !!].                             */
/* -------------------------------------------------------------------------- */
$easyPay = new EasyPay_Client;         // ����ó���� Class (library���� ���ǵ�)
$easyPay->clearup_msg();

$easyPay->set_home_dir($g_home_dir);
$easyPay->set_gw_url($g_gw_url);
$easyPay->set_gw_port($g_gw_port);
$easyPay->set_log_dir($g_log_dir);
$easyPay->set_log_level($g_log_level);
$easyPay->set_cert_file($g_cert_file);

/* -------------------------------------------------------------------------- */
/* ::: IP ���� ����                                                           */
/* -------------------------------------------------------------------------- */
$client_ip = $easyPay->get_remote_addr();    // [�ʼ�]������ IP


if( $TRAN_CD_NOR_PAYMENT == $tr_cd )
{
	
	/* ---------------------------------------------------------------------- */
    /* ::: ���ο�û(�÷����� ��ȣȭ ���� ����)                                */
    /* ---------------------------------------------------------------------- */
    $easyPay->set_trace_no($trace_no);
    $easyPay->set_snd_key($sessionkey);
    $easyPay->set_enc_data($encrypt_data);	
	
}
else if( $TRAN_CD_NOR_MGR == $tr_cd )
{
    /* ---------------------------------------------------------------------- */
    /* ::: ������� ��û                                                      */
    /* ---------------------------------------------------------------------- */
    $mgr_data = $easyPay->set_easypay_item("mgr_data");    
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_txtype"      , $mgr_txtype       );
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_subtype"     , $mgr_subtype      );
    $easyPay->set_easypay_deli_us( $mgr_data, "org_cno"         , $org_cno          );
    $easyPay->set_easypay_deli_us( $mgr_data, "pay_type"        , $pay_type         );
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_amt"         , $mgr_amt          );
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_rem_amt"     , $mgr_rem_amt      );
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_tax_flg"     , $mgr_tax_flg      );
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_tax_amt"     , $mgr_tax_amt      );
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_free_amt"    , $mgr_free_amt     );
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_vat_amt"     , $mgr_vat_amt      );
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_bank_cd"     , $mgr_bank_cd      );
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_account"     , $mgr_account      );
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_depositor"   , $mgr_depositor    );
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_socno"       , $mgr_socno        );
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_telno"       , $mgr_telno        );
    $easyPay->set_easypay_deli_us( $mgr_data, "deli_corp_cd"    , $deli_corp_cd     );
    $easyPay->set_easypay_deli_us( $mgr_data, "deli_invoice"    , $deli_invoice     );
    $easyPay->set_easypay_deli_us( $mgr_data, "deli_rcv_nm"     , $deli_rcv_nm      );
    $easyPay->set_easypay_deli_us( $mgr_data, "deli_rcv_tel"    , $deli_rcv_tel     );
    $easyPay->set_easypay_deli_us( $mgr_data, "req_ip"          , $client_ip        );
    $easyPay->set_easypay_deli_us( $mgr_data, "req_id"          , $req_id           );
    $easyPay->set_easypay_deli_us( $mgr_data, "mgr_msg"         , $mgr_msg          );
}

/* -------------------------------------------------------------------------- */
/* ::: ����                                                                   */
/* -------------------------------------------------------------------------- */ 
$opt = "option value";    
$easyPay->easypay_exec($g_mall_id, $tr_cd, $order_no, $client_ip, $opt);
$res_cd  = $easyPay->_easypay_resdata["res_cd"];    // �����ڵ�
$res_msg = $easyPay->_easypay_resdata["res_msg"];   // ����޽���

/* -------------------------------------------------------------------------- */
/* ::: ��� ó��                                                              */
/* -------------------------------------------------------------------------- */
$r_cno             = $easyPay->_easypay_resdata[ "cno"             ];    // PG�ŷ���ȣ 
$r_amount          = $easyPay->_easypay_resdata[ "amount"          ];    //�� �����ݾ�
$r_auth_no         = $easyPay->_easypay_resdata[ "auth_no"         ];    //���ι�ȣ
$r_tran_date       = $easyPay->_easypay_resdata[ "tran_date"       ];    //�����Ͻ�
$r_pnt_auth_no     = $easyPay->_easypay_resdata[ "pnt_auth_no"     ];    //����Ʈ���ι�ȣ
$r_pnt_tran_date   = $easyPay->_easypay_resdata[ "pnt_tran_date"   ];    //����Ʈ�����Ͻ�
$r_cpon_auth_no    = $easyPay->_easypay_resdata[ "cpon_auth_no"    ];    //�������ι�ȣ
$r_cpon_tran_date  = $easyPay->_easypay_resdata[ "cpon_tran_date"  ];    //���������Ͻ�
$r_card_no         = $easyPay->_easypay_resdata[ "card_no"         ];    //ī���ȣ
$r_issuer_cd       = $easyPay->_easypay_resdata[ "issuer_cd"       ];    //�߱޻��ڵ�
$r_issuer_nm       = $easyPay->_easypay_resdata[ "issuer_nm"       ];    //�߱޻��
$r_acquirer_cd     = $easyPay->_easypay_resdata[ "acquirer_cd"     ];    //���Ի��ڵ�
$r_acquirer_nm     = $easyPay->_easypay_resdata[ "acquirer_nm"     ];    //���Ի��
$r_install_period  = $easyPay->_easypay_resdata[ "install_period"  ];    //�Һΰ���
$r_noint           = $easyPay->_easypay_resdata[ "noint"           ];    //�����ڿ���
$r_bank_cd         = $easyPay->_easypay_resdata[ "bank_cd"         ];    //�����ڵ�
$r_bank_nm         = $easyPay->_easypay_resdata[ "bank_nm"         ];    //�����
$r_account_no      = $easyPay->_easypay_resdata[ "account_no"      ];    //���¹�ȣ
$r_deposit_nm      = $easyPay->_easypay_resdata[ "deposit_nm"      ];    //�Ա��ڸ�
$r_expire_date     = $easyPay->_easypay_resdata[ "expire_date"     ];    //���»�븸����
$r_cash_res_cd     = $easyPay->_easypay_resdata[ "cash_res_cd"     ];    //���ݿ����� ����ڵ�
$r_cash_res_msg    = $easyPay->_easypay_resdata[ "cash_res_msg"    ];    //���ݿ����� ����޼���
$r_cash_auth_no    = $easyPay->_easypay_resdata[ "cash_auth_no"    ];    //���ݿ����� ���ι�ȣ
$r_cash_tran_date  = $easyPay->_easypay_resdata[ "cash_tran_date"  ];    //���ݿ����� �����Ͻ�
$r_auth_id         = $easyPay->_easypay_resdata[ "auth_id"         ];    //PhoneID
$r_billid          = $easyPay->_easypay_resdata[ "billid"          ];    //������ȣ
$r_mobile_no       = $easyPay->_easypay_resdata[ "mobile_no"       ];    //�޴�����ȣ
$r_ars_no          = $easyPay->_easypay_resdata[ "ars_no"          ];    //��ȭ��ȣ
$r_cp_cd           = $easyPay->_easypay_resdata[ "cp_cd"           ];    //����Ʈ��/������
$r_used_pnt        = $easyPay->_easypay_resdata[ "used_pnt"        ];    //�������Ʈ
$r_remain_pnt      = $easyPay->_easypay_resdata[ "remain_pnt"      ];    //�ܿ��ѵ�
$r_pay_pnt         = $easyPay->_easypay_resdata[ "pay_pnt"         ];    //����/�߻�����Ʈ
$r_accrue_pnt      = $easyPay->_easypay_resdata[ "accrue_pnt"      ];    //��������Ʈ
$r_remain_cpon     = $easyPay->_easypay_resdata[ "remain_cpon"     ];    //�����ܾ�
$r_used_cpon       = $easyPay->_easypay_resdata[ "used_cpon"       ];    //���� ���ݾ�
$r_mall_nm         = $easyPay->_easypay_resdata[ "mall_nm"         ];    //���޻��Ī
$r_escrow_yn       = $easyPay->_easypay_resdata[ "escrow_yn"       ];    //����ũ�� �������
$r_complex_yn      = $easyPay->_easypay_resdata[ "complex_yn"      ];    //���հ��� ����
$r_canc_acq_date   = $easyPay->_easypay_resdata[ "canc_acq_date"   ];    //��������Ͻ�
$r_canc_date       = $easyPay->_easypay_resdata[ "canc_date"       ];    //����Ͻ�
$r_refund_date     = $easyPay->_easypay_resdata[ "refund_date"     ];    //ȯ�ҿ����Ͻ�    

/* -------------------------------------------------------------------------- */
/* ::: ������ DB ó��                                                         */
/* -------------------------------------------------------------------------- */
/* �����ڵ�(res_cd)�� "0000" �̸� ������� �Դϴ�.                            */
/* r_amount�� �ֹ�DB�� �ݾװ� �ٸ� �� �ݵ�� ��� ��û�� �Ͻñ� �ٶ��ϴ�.     */
/* DB ó�� ���� �� ��� ó���� ���ֽñ� �ٶ��ϴ�.                             */
/* -------------------------------------------------------------------------- */
if ( $res_cd == "0000" )
{
    $bDBProc = "false";     // DBó�� ���� �� "true", ���� �� "false"
    if ( $bDBProc != "true" )
    {
    	// ���ο�û�� ���� �� �Ʒ� ����
    	if( $TRAN_CD_NOR_PAYMENT == $tr_cd )
        {        	
            $easyPay->clearup_msg();
            
            $tr_cd = $TRAN_CD_NOR_MGR; 
            $mgr_data = $easyPay->set_easypay_item("mgr_data");
            if ( $r_escrow_yn != "Y" )    
            {
                $easyPay->set_easypay_deli_us( $mgr_data, "mgr_txtype"      , "40"   );
            }
            else
            {
                $easyPay->set_easypay_deli_us( $mgr_data, "mgr_txtype"      , "61"   );
                $easyPay->set_easypay_deli_us( $mgr_data, "mgr_subtype"     , "ES02" );
            }
            $easyPay->set_easypay_deli_us( $mgr_data, "org_cno"         , $r_cno     );
            $easyPay->set_easypay_deli_us( $mgr_data, "req_ip"          , $client_ip );
            $easyPay->set_easypay_deli_us( $mgr_data, "req_id"          , "MALL_R_TRANS" );
            $easyPay->set_easypay_deli_us( $mgr_data, "mgr_msg"         , "DB ó�� ���з� �����"  );
            
            $easyPay->easypay_exec($g_mall_id, $tr_cd, $order_no, $client_ip, $opt);
            $res_cd      = $easyPay->_easypay_resdata["res_cd"     ];    // �����ڵ�
            $res_msg     = $easyPay->_easypay_resdata["res_msg"    ];    // ����޽���
            $r_cno       = $easyPay->_easypay_resdata["cno"        ];    // PG�ŷ���ȣ 
            $r_canc_date = $easyPay->_easypay_resdata["canc_date"  ];    // ����Ͻ�
        }
    }
}
?>

<html>
<meta name="robots" content="noindex, nofollow"> 
<script type="text/javascript">
    function f_submit(){
        document.frm.submit();
    }
</script>

<body onload="f_submit();">
<form name="frm" method="post" action="./result.php">
    <input type="hidden" name="res_cd"          value="<?=$res_cd?>">            <!-- ����ڵ� //-->
    <input type="hidden" name="res_msg"         value="<?=$res_msg?>">           <!-- ����޽��� //-->
    <input type="hidden" name="order_no"        value="<?=$order_no?>">          <!-- �ֹ���ȣ //-->
    <input type="hidden" name="cno"             value="<?=$r_cno?>">             <!-- PG�ŷ���ȣ //-->
    
    <input type="hidden" name="amount"          value="<?=$r_amount?>">          <!-- �� �����ݾ� //-->
    <input type="hidden" name="auth_no"         value="<?=$r_auth_no?>">         <!-- ���ι�ȣ //-->
    <input type="hidden" name="tran_date"       value="<?=$r_tran_date?>">       <!-- �ŷ��Ͻ� //-->
    <input type="hidden" name="pnt_auth_no"     value="<?=$r_pnt_auth_no?>">     <!-- ����Ʈ ���� ��ȣ //-->
    <input type="hidden" name="pnt_tran_date"   value="<?=$r_pnt_tran_date?>">   <!-- ����Ʈ ���� �Ͻ� //-->
    <input type="hidden" name="cpon_auth_no"    value="<?=$r_cpon_auth_no?>">    <!-- ���� ���� ��ȣ //-->
    <input type="hidden" name="cpon_tran_date"  value="<?=$r_cpon_tran_date?>">  <!-- ���� ���� �Ͻ� //-->
    <input type="hidden" name="card_no"         value="<?=$r_card_no?>">         <!-- ī���ȣ //-->
    <input type="hidden" name="issuer_cd"       value="<?=$r_issuer_cd?>">       <!-- �߱޻��ڵ� //-->
    <input type="hidden" name="issuer_nm"       value="<?=$r_issuer_nm?>">       <!-- �߱޻�� //-->
    <input type="hidden" name="acquirer_cd"     value="<?=$r_acquirer_cd?>">     <!-- ���Ի��ڵ� //-->
    <input type="hidden" name="acquirer_nm"     value="<?=$r_acquirer_nm?>">     <!-- ���Ի�� //-->
    <input type="hidden" name="install_period"  value="<?=$r_install_period?>">  <!-- �Һΰ��� //-->
    <input type="hidden" name="noint"           value="<?=$r_noint?>">           <!-- �����ڿ��� //-->
    <input type="hidden" name="bank_cd"         value="<?=$r_bank_cd?>">         <!-- �����ڵ� //-->
    <input type="hidden" name="bank_nm"         value="<?=$r_bank_nm?>">         <!-- ����� //-->
    <input type="hidden" name="account_no"      value="<?=$r_account_no?>">      <!-- ���¹�ȣ //-->
    <input type="hidden" name="deposit_nm"      value="<?=$r_deposit_nm?>">      <!-- �Ա��ڸ� //-->
    <input type="hidden" name="expire_date"     value="<?=$r_expire_date?>">     <!-- ���»�븸���Ͻ� //-->
    <input type="hidden" name="cash_res_cd"     value="<?=$r_cash_res_cd?>">     <!-- ���ݿ����� ����ڵ� //-->
    <input type="hidden" name="cash_res_msg"    value="<?=$r_cash_res_msg?>">    <!-- ���ݿ����� ����޼��� //-->
    <input type="hidden" name="cash_auth_no"    value="<?=$r_cash_auth_no?>">    <!-- ���ݿ����� ���ι�ȣ //-->
    <input type="hidden" name="cash_tran_date"  value="<?=$r_cash_tran_date?>">  <!-- ���ݿ����� �����Ͻ� //-->
    <input type="hidden" name="auth_id"         value="<?=$r_auth_id?>">         <!-- PhoneID //-->
    <input type="hidden" name="billid"          value="<?=$r_billid?>">          <!-- ������ȣ //-->
    <input type="hidden" name="mobile_no"       value="<?=$r_mobile_no?>">       <!-- �޴�����ȣ //-->
    <input type="hidden" name="ars_no"          value="<?=$r_ars_no?>">          <!-- ARS ��ȭ��ȣ //-->
    <input type="hidden" name="cp_cd"           value="<?=$r_cp_cd?>">           <!-- ����Ʈ�� //-->
    <input type="hidden" name="used_pnt"        value="<?=$r_used_pnt?>">        <!-- �������Ʈ //-->
    <input type="hidden" name="remain_pnt"      value="<?=$r_remain_pnt?>">      <!-- �ܿ��ѵ� //-->
    <input type="hidden" name="pay_pnt"         value="<?=$r_pay_pnt?>">         <!-- ����/�߻�����Ʈ //-->
    <input type="hidden" name="accrue_pnt"      value="<?=$r_accrue_pnt?>">      <!-- ��������Ʈ //-->
    <input type="hidden" name="remain_cpon"     value="<?=$r_remain_cpon?>">     <!-- �����ܾ� //-->
    <input type="hidden" name="used_cpon"       value="<?=$r_used_cpon?>">       <!-- ���� ���ݾ� //-->
    <input type="hidden" name="mall_nm"         value="<?=$r_mall_nm?>">         <!-- ���޻��Ī //-->
    <input type="hidden" name="escrow_yn"       value="<?=$r_escrow_yn?>">       <!-- ����ũ�� ������� //-->
    <input type="hidden" name="complex_yn"      value="<?=$r_complex_yn?>">      <!-- ���հ��� ���� //-->
    <input type="hidden" name="canc_acq_date"   value="<?=$r_canc_acq_date?>">   <!-- ��������Ͻ� //-->
    <input type="hidden" name="canc_date"       value="<?=$r_canc_date?>">       <!-- ����Ͻ� //-->
    <input type="hidden" name="refund_date"     value="<?=$r_refund_date?>">     <!-- ȯ�ҿ����Ͻ� //-->
    <input type="hidden" name="pay_type"        value="<?=$pay_type?>">          <!-- �������� //-->
    
    <input type="hidden" name="gw_url"          value="<?=$g_gw_url?>">          <!--  //-->
    <input type="hidden" name="gw_port"         value="<?=$g_gw_port?>">         <!--  //-->
</form>
</body>
</html>
