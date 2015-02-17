<?php
class MtMssqlData extends Mt {

	var $connect_db = "";
	var $select_db = "";
	var $sqlsrv_affected_rows = 0;
	var $sqlsrv_errors = null;
	var $sqlsrv_num_rows = 0;
	var $sqlsrv_insert_id = 0;

    function MtMssqlData() {
        MtUtil::_d("### [MSSQL CONNECT]");
        ob_start();
        $this->connect();
    }

	function connect()	{
		if (is_resource($this->connect_db)) {
			return true;
		}

        ini_set('mssql.charset', 'UTF-8');
        $connectionInfo = array( "UID"=>$this->sqlsrv_user, "PWD"=>$this->sqlsrv_password, "Database"=>$this->sqlsrv_db, "CharacterSet" => "UTF-8");
        $this->connect_db = sqlsrv_connect($this->sqlsrv_host, $connectionInfo);

		if (!is_resource($this->connect_db)) {
            MtUtil::_d("MSSQL 디비연결 실패");
			return false;
		}

        if( $this->connect_db === false ) {
            MtUtil::_d("MSSQL 디비연결 실패");
            return false;
        }

		//AngeUtil::_c("디비연결");
//        return @sqlsrv_select_db($this->sqlsrv_db, $this->connect_db);
        return true;
	}

	// DB 연결
	function sql_connect($host, $info) {

//        @sqlsrv_query(" set names utf8 ");
	    return @sqlsrv_connect($host, $info);
	}

    // TRANSACTION 선택
    function sql_beginTransaction() {

//        @sqlsrv_query("SET AUTOCOMMIT=0");
//        @sqlsrv_query("START TRANSACTION");
        @sqlsrv_begin_transaction($this->sqlsrv_db);
    }

    // TRANSACTION 선택
    function sql_commit() {

//        @sqlsrv_query("COMMIT");
        @sqlsrv_commit($this->sqlsrv_db);
    }

    // TRANSACTION 선택
    function sql_rollback() {

//        @sqlsrv_query("ROLLBACK");
        @sqlsrv_rollback($this->sqlsrv_db);
    }

    // sqlsrv_query 와 sqlsrv_error 를 한꺼번에 처리
	function sql_query($sql, $param, $error=TRUE) {

        MtUtil::_d("EXCUTE MSSQL QUERY[".$sql."]");
	    
        $this->sqlsrv_affected_rows = 0;
        $this->sqlsrv_errors        = null;
        $this->sqlsrv_num_rows      = 0;
        $this->sqlsrv_insert_id     = 0;
	    $result = sqlsrv_query($this->connect_db, $sql);// or die("<p>$sql<p>" . sqlsrv_errno() . " : " .  sqlsrv_error() . "<p>error file : $_SERVER[PHP_SELF]");
//        $this->sqlsrv_affected_rows = @sqlsrv_affected_rows();
        $this->sqlsrv_errors        = @sqlsrv_errors();
//        $this->sqlsrv_num_rows      = @sqlsrv_num_rows($result);
//        $this->sqlsrv_insert_id     = @sqlsrv_insert_id();
		//$returnMsg = $returnMsg."{ \"err\": true , \"msg\": \"" . sqlsrv_error() . " :: " . $sql. "\" }"; echo $returnMsg; exit;
	    if(($errors = sqlsrv_errors() ) != null) {
            $msg = "";
            foreach( $errors as $error ) {
                $msg .=  $error['code'].":".$error['message'].", ";
            }
            MtUtil::_d("########################MSSQL ERROR########################\n"
                        ."SQL:::[".$sql."]\n"
                        ."MSG:::[".$msg
                        ."\n###########################################################");
        }

	    return $result;
	}

	// 쿼리를 실행한 후 결과값에서 한행을 얻는다.
	function sql_fetch($sql, $error=TRUE) {
	    $result = $this->sql_query($sql, $error);
	    $row = $this->sql_fetch_array($result);
	    return $row;
	}

	// 결과값에서 한행 연관배열(이름으로)로 얻는다.
	function sql_fetch_array($result) {
	    $row = @sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC);
	    return $row;
	}

	// $result에 대한 메모리(memory)에 있는 내용을 모두 제거한다.
	// sql_free_result()는 결과로부터 얻은 질의 값이 커서 많은 메모리를 사용할 염려가 있을 때 사용된다.
	// 단, 결과 값은 스크립트(script) 실행부가 종료되면서 메모리에서 자동적으로 지워진다.
	function sql_free_result($result) {
	    return @sqlsrv_free_result($result);
	}
	
	function sql_password($value) {
	    // mssql 4.0x 이하 버전에서는 password() 함수의 결과가 16bytes
	    // mssql 4.1x 이상 버전에서는 password() 함수의 결과가 41bytes
	    $row = $this->sql_fetch(" select password('$value') as pass ");
	    return $row[pass];
	}
}
?>
