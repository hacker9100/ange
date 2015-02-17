<?php
class MtData extends Mt {

	var $t_connect_db = "";
	var $t_select_db = "";
	var $t_mysql_affected_rows = 0;
	var $t_mysql_errno = 0;
	var $t_mysql_error = "";
	var $t_mysql_num_rows = 0;
	var $t_mysql_insert_id = 0;

	function t_connect()	{
		if (is_resource($this->t_connect_db)) {
			return true;
		}
		
		$this->t_connect_db = @mysql_connect($this->mysql_host, $this->mysql_user, $this->mysql_password);
		
		if (!is_resource($this->t_connect_db)) {
            MtUtil::_d("TO-BE 디비연결 실패");
			return false;
		}
		//AngeUtil::_c("디비연결");
        return @mysql_select_db($this->mysql_db, $this->t_connect_db);
	}

	// DB 연결
	function t_sql_connect($host, $user, $pass) {

        @mysql_query(" set names utf8 ");
	    return @mysql_connect($host, $user, $pass);
	}

	// DB 선택
	function t_sql_select_db($db, $connect) {
	
	    @mysql_query(" set names utf8 ");
	    return @mysql_select_db($db, $connect);
	}

    // TRANSACTION 선택
    function t_sql_beginTransaction() {

        @mysql_query("SET AUTOCOMMIT=0");
        @mysql_query("START TRANSACTION");
    }

    // TRANSACTION 선택
    function t_sql_commit() {

        @mysql_query("COMMIT");
    }

    // TRANSACTION 선택
    function t_sql_rollback() {

        @mysql_query("ROLLBACK");
    }

    // mysql_query 와 mysql_error 를 한꺼번에 처리
	function t_sql_query($sql, $error=TRUE) {

        MtUtil::_d("EXCUTE QUERY[".$sql."]");
	    
        $this->t_mysql_affected_rows = 0;
        $this->t_mysql_errno         = 0;
        $this->t_mysql_error         = "";
        $this->t_mysql_num_rows      = 0;
        $this->t_mysql_insert_id     = 0;
	    $result = @mysql_query($sql,$this->t_connect_db);// or die("<p>$sql<p>" . mysql_errno() . " : " .  mysql_error() . "<p>error file : $_SERVER[PHP_SELF]");
        $this->t_mysql_affected_rows = @mysql_affected_rows();
        $this->t_mysql_errno         = @mysql_errno();
        $this->t_mysql_error         = @mysql_error();
        $this->t_mysql_num_rows      = @mysql_num_rows($result);
        $this->t_mysql_insert_id     = @mysql_insert_id();
		//$returnMsg = $returnMsg."{ \"err\": true , \"msg\": \"" . mysql_error() . " :: " . $sql. "\" }"; echo $returnMsg; exit;
	    if(mysql_errno() > 0) MtUtil::_d("########################MYSQL ERROR########################\n"
	                                ."SQL:::[".$sql."]\n"
	                                ."MSG:::[".mysql_errno() . ":" . mysql_error()
	                                ."\n###########################################################");
	    return $result;
	}

	// 쿼리를 실행한 후 결과값에서 한행을 얻는다.
	function t_sql_fetch($sql, $error=TRUE) {
	    $result = $this->t_sql_query($sql, $error);
	    $row = $this->t_sql_fetch_array($result);
	    return $row;
	}

	// 결과값에서 한행 연관배열(이름으로)로 얻는다.
	function t_sql_fetch_array($result) {
	    $row = @mysql_fetch_assoc($result);
	    return $row;
	}

	// $result에 대한 메모리(memory)에 있는 내용을 모두 제거한다.
	// sql_free_result()는 결과로부터 얻은 질의 값이 커서 많은 메모리를 사용할 염려가 있을 때 사용된다.
	// 단, 결과 값은 스크립트(script) 실행부가 종료되면서 메모리에서 자동적으로 지워진다.
	function t_sql_free_result($result) {
	    return @mysql_free_result($result);
	}
	
	function t_sql_password($value) {
	    // mysql 4.0x 이하 버전에서는 password() 함수의 결과가 16bytes
	    // mysql 4.1x 이상 버전에서는 password() 함수의 결과가 41bytes
	    $row = $this->t_sql_fetch(" select password('$value') as pass ");
	    return $row[pass];
	}
}
?>
