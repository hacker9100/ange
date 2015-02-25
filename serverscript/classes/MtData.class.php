<?php
class MtData extends Mt {

	var $connect_db = "";
	var $select_db = "";
	var $mysql_affected_rows = 0;
	var $mysql_errno = 0;
	var $mysql_error = "";
	var $mysql_num_rows = 0;
	var $mysql_insert_id = 0;

	function connect($db)	{
		if (is_resource($this->connect_db)) {
			return true;
		}

        $host = $this->mysql_host;
        $user = $this->mysql_user;
        $password = $this->mysql_password;
        $dbf = $this->mysql_db;

        if ($db == "ad") {
            $host = $this->ad_mysql_host;
            $user = $this->ad_mysql_user;
            $password = $this->ad_mysql_password;
            $dbf = $this->ad_mysql_db;
        }

		$this->connect_db = @mysql_connect($host, $user, $password);
		
		if (!is_resource($this->connect_db)) {
            MtUtil::_d("디비연결 실패");
			return false;
		}
		//AngeUtil::_c("디비연결");
        return @mysql_select_db($dbf, $this->connect_db);
	}

	// DB 연결
	function sql_connect($host, $user, $pass) {

        @mysql_query(" set names utf8 ");
	    return @mysql_connect($host, $user, $pass);
	}

	// DB 선택
	function sql_select_db($db, $connect) {
	
	    @mysql_query(" set names utf8 ");
	    return @mysql_select_db($db, $connect);
	}

    // TRANSACTION 선택
    function sql_beginTransaction() {

        @mysql_query("SET AUTOCOMMIT=0");
        @mysql_query("START TRANSACTION");
    }

    // TRANSACTION 선택
    function sql_commit() {

        @mysql_query("COMMIT");
    }

    // TRANSACTION 선택
    function sql_rollback() {

        @mysql_query("ROLLBACK");
    }

    // mysql_query 와 mysql_error 를 한꺼번에 처리
	function sql_query($sql, $error=TRUE) {

        MtUtil::_d("EXCUTE QUERY[".$sql."]");
	    
        $this->mysql_affected_rows = 0;
        $this->mysql_errno         = 0;
        $this->mysql_error         = "";
        $this->mysql_num_rows      = 0;
        $this->mysql_insert_id     = 0;
	    $result = @mysql_query($sql,$this->connect_db);// or die("<p>$sql<p>" . mysql_errno() . " : " .  mysql_error() . "<p>error file : $_SERVER[PHP_SELF]");
        $this->mysql_affected_rows = @mysql_affected_rows();
        $this->mysql_errno         = @mysql_errno();
        $this->mysql_error         = @mysql_error();
        $this->mysql_num_rows      = @mysql_num_rows($result);
        $this->mysql_insert_id     = @mysql_insert_id();
		//$returnMsg = $returnMsg."{ \"err\": true , \"msg\": \"" . mysql_error() . " :: " . $sql. "\" }"; echo $returnMsg; exit;
	    if(mysql_errno() > 0) MtUtil::_d("########################MYSQL ERROR########################\n"
	                                ."SQL:::[".$sql."]\n"
	                                ."MSG:::[".mysql_errno() . ":" . mysql_error()
	                                ."\n###########################################################");
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
	    $row = @mysql_fetch_assoc($result);
	    return $row;
	}

	// $result에 대한 메모리(memory)에 있는 내용을 모두 제거한다.
	// sql_free_result()는 결과로부터 얻은 질의 값이 커서 많은 메모리를 사용할 염려가 있을 때 사용된다.
	// 단, 결과 값은 스크립트(script) 실행부가 종료되면서 메모리에서 자동적으로 지워진다.
	function sql_free_result($result) {
	    return @mysql_free_result($result);
	}
	
	function sql_password($value) {
	    // mysql 4.0x 이하 버전에서는 password() 함수의 결과가 16bytes
	    // mysql 4.1x 이상 버전에서는 password() 함수의 결과가 41bytes
	    $row = $this->sql_fetch(" select password('$value') as pass ");
	    return $row[pass];
	}
}
?>
