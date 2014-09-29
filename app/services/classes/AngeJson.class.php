<?php
class AngeJson extends AngeData {

    function AngeJson() {
        parent::connect();
    }

    function sql2json($sql) {
        $result = $this->sql_query($sql,false);
        $row    = $this->sql_fetch_array($result);
        return json_encode($row);
    }

    function failEnd($msg) {
        echo '{\'msg\':\''.$msg.'\',\'err\':true}';
        exit;
    }

    function succEnd($msg) {
        echo '{\'msg\':\''.$msg.'\',\'err\':false}';
        exit;
    }

    function cmdEnd($sql) {

        $result = $this->sql_query($sql,false);
        AngeUtil::_c('===============================>'.$result);
        if ($result!=1) {
            $this->failEnd('오류가 발생했습니다.데이터를 확인하세요');
        } else {
            $this->succEnd('성공적으로 되었습니다');
        }
    }

    function getData($sql) {
        $__trn = '';
        $result = $this->sql_query($sql,true);
        for ($i=0; $row=$this->sql_fetch_array($result); $i++) {
            $__trn->rows[$i] = $row;
        }
        $this->sql_free_result($result);
        return json_encode($__trn->{'rows'});
    }

    function dataEnd($sql) {
        $result = $this->getData($sql);
        AngeUtil::_c("===============================>".$result);
        header('HTTP/1.1 200 OK');
        header('Content-Type:application/json');

        echo $result;
        exit;
    }
}
?>