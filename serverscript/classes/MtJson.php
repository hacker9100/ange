<?php
class MtJson extends MtData {

    function MtJson() {
        ob_start();
        parent::connect();
    }

    function sql2json($sql) {
        $result = $this->sql_query($sql,false);
        $row    = $this->sql_fetch_array($result);
        return json_encode($row);
    }

    function failEnd($msg) {
        ob_end_clean();
        MtUtil::_c("### [END] [ERROR]");
        header('HTTP/1.1 200 OK');
        echo '{"msg":"'.$msg.'","err":true}';
        exit;
    }

    function succEnd($msg) {
        ob_end_clean();
        MtUtil::_c("### [END] [SUCCESS]".$msg);
        header('HTTP/1.1 200 OK');
        echo '{"msg":"'.$msg.'","err":false}';
        exit;
    }

    function cmdEnd($sql) {

        $result = $this->sql_query($sql,false);
        MtUtil::_c('===============================>'.$result);
        if ($result!=1) {
            $this->failEnd('오류가 발생했습니다.데이터를 확인하세요');
        } else {
            $this->succEnd('성공적으로 되었습니다');
        }
    }

    function getData($sql) {
        $__trn = null;
        $result = $this->sql_query($sql,true);
        for ($i=0; $row=$this->sql_fetch_array($result); $i++) {
            $__trn->rows[$i] = $row;
        }
        $this->sql_free_result($result);
        return $__trn != null ? $__trn->{'rows'} : $__trn;
//        return json_encode($__trn != '' ? $__trn->{'rows'} : $__trn);
    }

    function dataEnd($sql) {
        ob_end_clean();

        $result = $this->getData($sql);
        $data = null;
        MtUtil::_c("### [END] [DATA]".json_encode($result));

        if ($result != null) {
            $data = json_encode($result);
        }
//        header('HTTP/1.1 200 OK');
//        header('Content-Type:application/json');

        echo $data;
        exit;
    }

    function dataEnd2($result) {
        ob_end_clean();

        MtUtil::_c("### [END] [DATA]".json_encode($result));
//        header('HTTP/1.1 200 OK');
//        header('Content-Type:application/json');

        echo json_encode($result);
        exit;
    }
}
?>