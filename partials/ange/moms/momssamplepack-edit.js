/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : samplepack-edit.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('samplepack-edit', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD) {

        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data !== 'undefined') {
                $scope.file = data[0];
            }
        });

        $scope.search = {};
        $scope.item = {};

        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 1;

        $scope.selectIdx = 1;

        $scope.showSamplepackDetails = false;

        // 초기화
        $scope.init = function(session) {
//            if ($stateParams.menu == 'angeroom') {
            $scope.community = "샘플팩 신청";
//            }
            if($stateParams.id == 'season1'){
                $scope.season_gb = 'SAMPLE1';
            }else if($stateParams.id == 'season2'){
                $scope.season_gb = 'SAMPLE2';
            }

            var date = new Date();

            // GET YYYY, MM AND DD FROM THE DATE OBJECT
            var year = date.getFullYear().toString();
            var mm = (date.getMonth()+1).toString();
            var dd  = date.getDate().toString();

             // 현재달+1
            var next_mm = parseInt(mm)+1;

            if(mm < 10){
                mm = '0'+mm;
            }

            if(next_mm < 10){
                next_mm = '0'+next_mm;
            }

            var next_year = '';

            if(next_mm > 12){
                next_mm = '01';
                next_year = year + 1;
            }else{
                next_year = year
            }

            if(dd < 10){
                dd = '0'+dd;
            }

            var now = new Date();
            var babyBirthYear = [];
            var nowYear = now.getFullYear();

            for (var i = nowYear+1; i >= nowYear; i--) {
                babyBirthYear.push(i+'');
            }


            $scope.babyBirthYear = babyBirthYear;
            $scope.year = year;
            $scope.next_year = next_year;
            $scope.month = mm;
            $scope.next_month = next_mm;// 신규회원 이달말 체크

            $scope.todayDay = dd;

            var dt = new Date(year, mm, 0);
            $scope.Day = dt.getDate();

            // 기존회원 신청자격 여부
            $scope.checked = 'N';

            // 회원정보 신청폼에 셋팅
            $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                .then(function(data){

                    $rootScope.user_info = data;
//                    $scope.item.USER_ID = data.USER_ID;
//                    $scope.item.USER_NM = data.USER_NM;
//                    $scope.item.NICK_NM = data.NICK_NM;
//                    $scope.item.ADDR = data.ADDR;
//                    $scope.item.ADDR_DETAIL = data.ADDR_DETAIL;
//                    $scope.item.REG_DT = data.REG_DT;
//                    $scope.item.REG_DT = data.REG_DT;
//                    $scope.item.PHONE_1 = data.PHONE_1;
//                    $scope.item.PHONE_2 = data.PHONE_2;

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

            $scope.item.PREGNANT_WEEKS = 0;
            $scope.item.CHILD_CNT = 0;

        };

        // 정보수정 팝업
        $scope.click_update_user_info = function () {
            $scope.openModal(null, 'md');
        };


        // 탭
        $(function () {

            $(".tab_content").hide();
            $(".tab_content:first").show();

            $("ul.nav-tabs li").click(function () {

                $("ul.tabs li").removeClass("active");
                $(this).addClass("active");
                $(".tab_content").hide();
                var activeTab = $(this).attr("rel");
                $("#" + activeTab).fadeIn();
            });

        });

        // 탭 선택시 해당 화면으로 포커스 이동
        $scope.click_selectTab = function (idx) {
            $scope.selectIdx = idx;
        };

        // 정보수정 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('user_info_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = {};

                    //console.log($scope.user_info);
                    $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                        .then(function(data){
                            $scope.item = data;
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    if($scope.item.PREGNENT_FL == 'Y'){
                        $scope.checked = "Y";
                    }else{
                        $scope.checked = "N";
                    }

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'ANGE';

                        if($("#preg_Y").is(":checked")){
                            $scope.item.PREGNENT_FL = "Y";
                        }else{
                            $scope.item.PREGNENT_FL = "N";
                        }

                        if($("#preg_N").is(":checked")){
                            $scope.item.PREGNENT_FL = "N";
                        }else{
                            $scope.item.PREGNENT_FL = "Y";
                        }

                        $scope.updateItem('com/user', 'item',$scope.uid, $scope.item, false)
                            .then(function(data){

                                dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                                $scope.getSession();
                                $modalInstance.close();


                            })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){

                $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                    .then(function(data){

                        $scope.user_info = data;
                        console.log($scope.item);

                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });

            console.log(dlg);
        };

        /********** 이벤트 **********/
        // 게시판 목록 이동
        $scope.click_sampleSeasonList = function () {

           if($stateParams.id == 'season1'){
               $scope.search.PRODUCT_CODE = 45;
               $scope.season_gb = 'SAMPLE1';
           }else{
               $scope.search.PRODUCT_CODE = 46;
               $scope.season_gb = 'SAMPLE2';
           }

           $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var target_gb = data[0].ada_type;
                    var target_no = data[0].ada_idx;

                   $scope.item.ada_date_open = data[0].ada_date_open;
                   $scope.item.ada_date_close = data[0].ada_date_close;
                   $scope.item.ada_date_notice = data[0].ada_date_notice;
                   $scope.item.ada_title = data[0].ada_title;
                   $scope.item.ada_count_request = data[0].ada_count_request;


                   $scope.item.TARGET_GB = target_gb;
                   $scope.item.TARGET_NO = target_no;

                   $scope.item.ada_idx = data[0].ada_idx;

                   $scope.item.ada_que_type = data[0].ada_que_type;

                   console.log($scope.item.ada_que_type);

                   //console.log(data[0].ada_que_type);

                   // 질문일 때
                   if($scope.item.ada_que_type == 'question'){
                       var que_data = data.ada_que_info;

                       //$scope.item.QUE = [];
                       $scope.item.QUE = new Array();
                       que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                       console.log(que_data);
                       var parse_que_data = JSON.parse(que_data);

                       console.log(parse_que_data);

                       for(var x in parse_que_data){

                           var choice = [];
                           if(parse_que_data[x].type == 0){ // 객관식일때
                               var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                               for(var i=0; i < select_answer.length; i++){
                                   choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
                               }
                           }else if(parse_que_data[x].type == 1){ // 주관식일때
                               choice = "";
                           }else if(parse_que_data[x].type == 2){ // 통합형
                               var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                               for(var i=0; i < select_answer.length; i++){
                                   choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
                               }
                           }else if(parse_que_data[x].type == 3){ // 복수
                               var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                               for(var i=0; i < select_answer.length; i++){
                                   choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
                               }
                           }

                           var index = parseInt(x)+parseInt(1);
                           $scope.item.QUE.push({"index" : index,"title" : parse_que_data[x].title, "type" : parse_que_data[x].type, "choice" :choice});
                           console.log($scope.item.QUE);
                       }
                   }

                   // 질문일 때
                   if($scope.item.ada_que_type == 'upload'){

                       // 파일 업로드 설정
                       $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

                       // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
                       $scope.$watch('newFile', function(data){
                           if (typeof data !== 'undefined') {
                               $scope.file = data[0];
                           }
                       });

                       console.log(data.ada_que_info);
                        //|| data.ada_que_info != ''
                       if(data.ada_que_info != undefined ){
                           var que_data = data.ada_que_info;

                           //$scope.item.QUE = [];
                           $scope.item.QUE = new Array();
                           que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                           var parse_que_data = JSON.parse(que_data);

                           console.log(parse_que_data);

                           for(var x in parse_que_data){

                               var choice = [];
                               if(parse_que_data[x].type == 0){ // 객관식일때
                                   var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                   for(var i=0; i < select_answer.length; i++){
                                       choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
                                   }
                               }else if(parse_que_data[x].type == 1){ // 주관식일때
                                   choice = "";
                               }else if(parse_que_data[x].type == 2){ // 통합형
                                   var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                   for(var i=0; i < select_answer.length; i++){
                                       choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
                                   }
                               }else if(parse_que_data[x].type == 3){ // 복수
                                   var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                   for(var i=0; i < select_answer.length; i++){
                                       choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
                                   }
                               }

                               var index = parseInt(x)+parseInt(1);
                               $scope.item.QUE.push({"index" : index,"title" : parse_que_data[x].title, "type" : parse_que_data[x].type, "choice" :choice});
                               //console.log($scope.item.QUE);
                           }
                       }
                   }

                   // 댓글일 때
                   if($scope.item.ada_que_type == 'reply'){

                       //$scope.item.REPLY_SUBJECT = $scope.item.ada_title;
                   }

//                   var babyBirthDt = $rootScope.user_info.BABY_BIRTH_DT;
//
//                   $scope.item.YEAR = babyBirthDt.substr(0,4);
//                   $scope.item.MONTH = babyBirthDt.substr(4,2);
//                   $scope.item.DAY = babyBirthDt.substr(6,2);

                })
                ['catch'](function(error){});
//            var babyBirthDt = $rootScope.user_info.BABY_BIRTH_DT;
//
//            $scope.item.YEAR = babyBirthDt.substr(0,4);
//            $scope.item.MONTH = babyBirthDt.substr(4,2);
//            $scope.item.DAY = babyBirthDt.substr(6,2);
        };

        // 회원가입 화면 이동
        $scope.click_joinon = function (){
            $location.url('/infodesk/signon');
        }

        function CheckForm(p_obj){

            //alert(p_obj.name);
            //$("#validation")

            var t_pattern = { 'id':/^[a-zA-Z0-9_]+$/,'email':/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/,'number':/^[0-9]+$/ };

            for(var t_cnt=0; t_cnt< p_obj.length; t_cnt++){

                var t_obj = p_obj.elements[t_cnt];

                //alert(t_obj.name);

                // 유효한 항목인지 확인
                if (typeof t_obj!='undefined' && t_obj.name!=''){

                    // 검사 대상인지 확인
                    if (t_obj.title!='' &&  t_obj.type!='button' && t_obj.type!='submit' ){
                        var t_item = t_obj.title.split(':');

                        if (t_obj.type=='radio' || t_obj.type=='checkbox'){

                            var t_value = $('input[name="'+t_obj.name+'"]:checked').val();

                            if ( !t_value ){
                                alert(t_item[0]+'란은 꼭 선택하셔야만 합니다.');
                                t_obj.focus();
                                return false;
                            }
                        }

                        if (t_obj.type=='text' || t_obj.type=='password' || t_obj.type=='file' || t_obj.type == 'textarea'){

                            if (!t_obj.value){
                                alert(t_item[0]+'란은 꼭 입력하셔야만 합니다.');
                                t_obj.focus();
                                return false;
                            }

                            if (t_obj.alt!='' && Number(t_obj.alt)>t_obj.value.length ){
                                alert(t_item[0]+'란에는 최소 '+t_obj.alt+'자 이상 입력하셔야만 합니다.');
                                t_obj.focus();
                                return false;
                            }

                            if (t_item.length>1) {
                                alert(t_pattern[t_item[1]].test(t_obj.value));
                                if (t_pattern[t_item[1]].test(t_obj.value)==false) {
                                    alert(t_item[0]+'란에 적절하지 않은 값이 입력되었습니다.');
                                    t_obj.focus();
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
            return true;
        }

        // 샘플팩 신청
        $scope.click_saveSamplepackComp = function (){

            $scope.search.REG_UID = $rootScope.uid;
            $scope.search.ada_idx = $scope.item.TARGET_NO;
            //$scope.search.TARGET_GB = $scope.item.target_gb;

            if(CheckForm(document.getElementById("samplepackvalidation")) == false){
                return;
            }

            if($scope.season_gb == 'SAMPLE2'){
//
//                if($scope.checked == 'N'){
//                    dialogs.notify('알림', '신청 자격을 확인해주세요.', {size: 'md'});
//                    return;
//                }
//
//                var mileage_point = $rootScope.mileage;
//
//                if(mileage_point < 2000){
//                    alert('보유 마일리지가 부족하여 신청이 불가능 합니다');
//                    return;
//                }
                $scope.item.MILEAGE = true;
            }


            $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                .then(function(data){
                    var comp_cnt = data[0].COMP_CNT;

                    console.log('comp_cnt = '+comp_cnt);

                    if(comp_cnt == 0){

                        console.log('$scope.item.ada_que_type == '+$scope.item.ada_que_type);

                        if($scope.item.ada_que_type == 'question'){
                         // 문답일때
                            $rootScope.jsontext2 = new Array();

                            var poll_length = $('.poll_question_no').length;
                            console.log(poll_length);


                            for(var i=1; i<=poll_length; i++){

                                if(document.getElementById("answer"+i).type == 'radio'){
                                    $rootScope.jsontext2[i] = '"'+i+'":"'+$("input[name=answer"+i+"]:checked").val() +'"';
                                }else if(document.getElementById("answer"+i).type == 'checkbox'){
                                    var checkvalue = '';
                                    $("input[name=answer"+i+"]:checked").each(function() {
                                        checkvalue += $(this).val() + ';';
                                        console.log(checkvalue);
                                    });
                                    $rootScope.jsontext2[i] = '"'+i+'":"'+ checkvalue+'"';
                                }else if(document.getElementById("answer"+i).type == 'text'){
                                    $rootScope.jsontext2[i] = '"'+i+'":"'+ document.getElementById("answer"+i).value+'"';
                                }else if(document.getElementById("answer"+i).type == 'textarea'){
                                    $rootScope.jsontext2[i] = '"'+i+'":"'+ document.getElementById("answer"+i).value+'"';
                                }
                            }

                            $scope.item.ANSWER = '{'+$rootScope.jsontext2+'}';
                            $scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                            console.log($scope.item.ANSWER);

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '샘플팩 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    if ($stateParams.menu == 'eventprocess') {
                                        $location.url('/moms/eventprocess/list');
                                    } else if($stateParams.menu == 'eventperformance') {
                                        $location.url('/moms/eventperformance/list');
                                    }
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        }else if($scope.item.ada_que_type == 'reply'){ // 댓글일때

                            console.log('{"'+$scope.item.REPLY_SUBJECT+'":"'+ $scope.item.COMMENT+'"}');
                            $scope.item.ANSWER = '{"1":"'+ $scope.item.COMMENT+'"}';

                            $scope.search.ada_idx = $scope.item.ada_idx;

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '샘플팩 신청이 완료되었습니다.', {size: 'md'});

                                    $location.url('/moms/samplepack/intro');
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        } else if($scope.item.ada_que_type == 'join'){ // 신청이나 응모일때

                            // 정보제공 동의체크 확인
                            if($("#credit_agreement_Y").is(":checked")){
                                $scope.item.CREDIT_FL = 'Y';
                            }else{
                                alert('제 3자 정보제공에 동의 하셔야 상품 발송이 가능합니다.');
                                return;
                            }

                            $scope.search.REG_UID = $scope.uid;
                            $scope.search.TARGET_NO = $scope.item.ada_idx;
                            $scope.search.TARGET_GB = 'EVENT';

                            $scope.item.BABY_BIRTH = $scope.item.BABY_YEAR + $scope.item.BABY_MONTH + $scope.item.BABY_DAY;

                            // 임신주차는 0으로 셋팅(int 형이라 null로 넣으면 쿼리에러 발생)
                            $scope.item.PREGNANT_WEEKS = 0;

                            if($scope.item.BLOG == undefined){
                                alert('블로그 주소를 입력하세요');
                                return;
                            }

                            // 추가한 블로그 갯수 만큼 반복
                            var cnt = $scope.item.BLOG.length;
                            $scope.item.BLOG_URL = '';
                            $("input[name='blog[]'").each(function(index, element) {
                                if(index != (cnt -1)){
                                    $scope.item.BLOG_URL += $(element).val()+', ';
                                }else{
                                    $scope.item.BLOG_URL += $(element).val();
                                }

                            });

                            if($scope.item.QUE != undefined){

                                $rootScope.jsontext2 = new Array();

                                var poll_length = $('.poll_join_no').length;
                                console.log(poll_length);


                                for(var i=1; i<=poll_length; i++){

                                    if(document.getElementById("answer"+i).type == 'radio'){
                                        $rootScope.jsontext2[i] = '"'+i+'":"'+$("input[name=answer"+i+"]:checked").val() +'"';
                                    }else if(document.getElementById("answer"+i).type == 'checkbox'){
                                        var checkvalue = '';
                                        $("input[name=answer"+i+"]:checked").each(function() {
                                            checkvalue += $(this).val() + ';';
                                            console.log(checkvalue);
                                        });
                                        $rootScope.jsontext2[i] = '"'+i+'":"'+ checkvalue+'"';
                                    }else if(document.getElementById("answer"+i).type == 'text'){
                                        $rootScope.jsontext2[i] = '"'+i+'":"'+ document.getElementById("answer"+i).value+'"';
                                    }else if(document.getElementById("answer"+i).type == 'textarea'){
                                        $rootScope.jsontext2[i] = '"'+i+'":"'+ document.getElementById("answer"+i).value+'"';
                                    }
                                }

                                $scope.item.ANSWER = '{'+$rootScope.jsontext2+'}';
                                $scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                                console.log($scope.item.ANSWER);
                            }

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '샘플팩 신청이 완료되었습니다.', {size: 'md'});

                                    $location.url('/moms/samplepack/intro');
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        }else if($scope.item.ada_que_type == 'upload'){

                            if($scope.item.YEAR == undefined){
                                alert('출산예정일 연도를 선택하세요');
                                return;
                            }

                            if($scope.item.MONTH == undefined){
                                alert('출산예정일 월을 선택하세요');
                                return;
                            }

                            if($scope.item.DAY == undefined){
                                alert('출산예정일 일을 선택하세요');
                                return;
                            }

                            var deliveryday = '';
                            deliveryday = $scope.item.YEAR + '-' + $scope.item.MONTH + '-' + $scope.item.DAY;


                            console.log($scope.item.REASON);

                            $scope.item.REASON = $scope.item.REASON.replace(/^\s+|\s+$/g,'');

                            if($scope.item.REASON == undefined || $scope.item.REASON == ""){
                                alert('태동느낌을 작성하세요');
                                return;
                            }

                            console.log(deliveryday);

                            var answer2 = '"1":"'+deliveryday+'","2":"'+$scope.item.REASON+'"';
                            console.log(answer2);

                            // 문답일때
                            var answer = [];
                            $rootScope.jsontext3 = "";

                            console.log($scope.file);

                            if ($scope.file == undefined) {
                                dialogs.notify('알림', '이미지를 등록해야합니다.', {size: 'md'});
                                return;
                            }


                            $scope.item.FILE = $scope.file;

                            if($scope.item.QUE != undefined){

                                $rootScope.jsontext2 = new Array();

                                var poll_length = $('.poll_upload_no').length;
                                console.log(poll_length);


                                for(var i=1; i<=poll_length; i++){

                                    if(document.getElementById("answer"+i).type == 'radio'){
                                        $rootScope.jsontext2[i] = '"'+i+'":"'+$("input[name=answer"+i+"]:checked").val() +'"';
                                    }else if(document.getElementById("answer"+i).type == 'checkbox'){
                                        var checkvalue = '';
                                        $("input[name=answer"+i+"]:checked").each(function() {
                                            checkvalue += $(this).val() + ';';
                                            console.log(checkvalue);
                                        });
                                        $rootScope.jsontext2[i] = '"'+i+'":"'+ checkvalue+'"';
                                    }else if(document.getElementById("answer"+i).type == 'text'){
                                        $rootScope.jsontext2[i] = '"'+i+'":"'+ document.getElementById("answer"+i).value+'"';
                                    }else if(document.getElementById("answer"+i).type == 'textarea'){
                                        $rootScope.jsontext2[i] = '"'+i+'":"'+ document.getElementById("answer"+i).value+'"';
                                    }
                                }

                                var last_poll_length = 0;
                                last_poll_length = poll_length+2;
                                //$scope.item.ANSWER = '{'+$rootScope.jsontext2+',"'+last_poll_length+'":"'+ $scope.file.name+'"'+'}';
                                $scope.item.ANSWER = '{'+answer2+$rootScope.jsontext2+',"'+last_poll_length+'":"'+ $scope.file.name+'"'+'}';
                                //$scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                                console.log($scope.item.ANSWER);

                            }else{

                                $rootScope.jsontext3 = '"3":"'+ $scope.file.name+'"';
                                $scope.item.ANSWER = '{'+answer2+$rootScope.jsontext3+'}';


                            }

                            console.log($scope.item.ANSWER);
                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(data){

                                    $rootScope.mileage = data.mileage;
                                    dialogs.notify('알림', '샘플팩 신청이 완료되었습니다.', {size: 'md'});

                                    $location.url('/moms/samplepack/intro');
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }

                    }else{
                        dialogs.notify('알림', '이미 샘플팩 신청을 했습니다.', {size: 'md'});
                        $location.url('/moms/samplepack/intro');
                    }

            })
            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});


        }
        /********** 화면 초기화 **********/
/*        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCmsBoard)
            ['catch']($scope.reportProblems);*/

        // 신청자격 여부 체크
        $scope.click_samplepackCheck = function (){

            $scope.search.ada_idx = $scope.item.ada_idx;
            $scope.search.TARGET_GB = $scope.item.target_gb;

            $scope.getList('ange/comp', 'samplepackCheck', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    var checkCnt = data[0].COMP_CNT;

                    if(checkCnt ==0){
                        dialogs.notify('알림', '신청이 가능합니다.', {size: 'md'});
                        $scope.checked = 'Y';
                        $scope.showSamplepackDetails = true;
                    }else{
                        dialogs.notify('알림', '임신중이 아니시거나 이전에 당첨되셨기 때문에 신청이 불가능합니다.', {size: 'md'});
                        $scope.checked = 'N';
                        return;
                    }

                })
                ['catch'](function(error){});
        }


        $scope.click_compCheck = function (){

            $scope.search.ada_idx = $scope.item.ada_idx;
            $scope.search.TARGET_GB = $scope.item.target_gb;

            $scope.getList('ange/comp', 'samplepackCheck', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    var checkCnt = data[0].COMP_CNT;

                    if(checkCnt ==0){
                        $scope.showSamplepackDetails = true;
                    }else{
                        dialogs.notify('알림', '이미 샘플팩 신청을 했습니다.', {size: 'md'});
                        return;
                    }

                })
                ['catch'](function(error){});
        }

//        $scope.init();
//        $scope.click_sampleSeasonList();

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.click_sampleSeasonList)
            ['catch']($scope.reportProblems);


    }]);
});
