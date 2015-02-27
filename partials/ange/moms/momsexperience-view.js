/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : momsexperience-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsexperience-view', ['$scope', '$rootScope', '$sce', '$stateParams', '$location', 'dialogs', 'CONSTANT', 'UPLOAD', function ($scope,$rootScope, $sce, $stateParams, $location, dialogs, CONSTANT, UPLOAD) {


        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data !== 'undefined') {
                $scope.file = data[0];
            }
        });

        $scope.queue = [];
        $scope.search = {};

        $scope.item = {};
        $scope.item.BLOG = [];

        // 리뷰리스트
        $scope.reviewList = [];

        // 날짜 셀렉트 박스셋팅
        var year = [];
        var babyYear = [];
        var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        var month = [];

        var hour = [];
        var minute = [];


        for (var i = nowYear + 1; i >= 1995; i--) {
            babyYear.push(i+'');
        }

        for (var i = 1; i <= 12; i++) {

            if(i < 10){
                i = '0'+i;
            }
            month.push(i+'');
        }

        for (var i = 1; i <= 31; i++) {

            if(i < 10){
                i = '0'+i;
            }
            day.push(i+'');
        }

        $scope.babyYear = babyYear;
        $scope.month = month;
        $scope.day = day;

        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'MOMS';

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        if(mm < 10) {
            mm = '0'+mm;
        }

        if(dd < 10) {
            dd = '0'+dd;
        }

        // 기준 날짜 (오늘 날짜)
        $scope.nowTime = new Date();



        var today = year+mm+dd;
        $scope.todayDate = today;

        if($rootScope.focus == 'comp'){
            //$('#moms_state').get(0).scrollIntoView(true);

            $('html,body').animate({scrollTop:$('#moms_state').offset().top}, 300);
            $('#preg_fl').focus();

        }else if($rootScope.focus == 'view'){
            $('html,body').animate({scrollTop:$('#view_state').offset().top}, 100);
            $('#experience_view').focus();
        }

        // 사용자 정보수정 버튼 클릭
        $scope.click_update_user_info = function () {
            $scope.openModal(null, 'md');
        };

        /********** 콘텐츠 랜더링 **********/
        $scope.renderHtml = function(html_code) {
            return html_code != undefined ? $sce.trustAsHtml(html_code) : '';
//            return html_code;
        };

        // 정보수정 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('user_info_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    $scope.item = {};

                    $scope.user_info = function () {
                        $scope.getItem('com/user', 'item', $scope.uid, {} , false)
                            .then(function(data){

                                $scope.item.USER_ID = data.USER_ID;
                                $scope.item.USER_NM = data.USER_NM;
                                $scope.item.NICK_NM = data.NICK_NM;
                                $scope.item.ADDR = data.ADDR;
                                $scope.item.ADDR_DETAIL = data.ADDR_DETAIL;
                                $scope.item.REG_DT = data.REG_DT;
                                $scope.item.REG_DT = data.REG_DT;
                                $scope.item.PHONE_1 = data.PHONE_1;
                                $scope.item.PHONE_2 = data.PHONE_2;
                                $scope.item.BLOG_URL = data.BLOG_URL;

                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                    $(document).ready(function(){
                        $('#birth_dt').css('display', 'none');

                        $("#preg_Y").click(function(){
                            if(!$("#preg_Y").is(":checked")){
                                $scope.item.PREGNENT_FL = "Y";
                                $('#birth_dt').css('display', 'block');
                            }
                        });

                        $("#preg_N").click(function(){
                            if(!$("#preg_N").is(":checked")){
                                $scope.item.PREGNENT_FL = "N";
                                $('#birth_dt').css('display', 'none');
                            }
                        });
                    });

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'CMS';
                        $scope.item.USER_NM = $scope.name;
                        $scope.item.NICK_NM = $scope.nick;

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
                                $modalInstance.close();
                            }).catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };


                    $scope.user_info();
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){
                $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                    .then(function(data){

                        $scope.USER_ID = data.USER_ID;
                        $scope.USER_NM = data.USER_NM;
                        $scope.NICK_NM = data.NICK_NM;
                        $scope.ADDR = data.ADDR;
                        $scope.ADDR_DETAIL = data.ADDR_DETAIL;
                        $scope.REG_DT = data.REG_DT;
                        $scope.REG_DT = data.REG_DT;
                        $scope.PHONE_1 = data.PHONE_1;
                        $scope.PHONE_2 = data.PHONE_2;
                        $scope.BLOG_URL = data.BLOG_URL;
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        // 초기화
        $scope.init = function() {

            if ($stateParams.menu == 'experienceprocess') {
                $scope.community = "진행중인 체험단";
                $scope.menu = "experienceprocess"
            } else if ($stateParams.menu == 'experiencepast') {
                $scope.community = "지난 체험단";
                $scope.menu = "experiencepast"
            }

            $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                .then(function(data){

                    $scope.USER_ID = data.USER_ID;
                    $scope.USER_NM = data.USER_NM;
                    $scope.NICK_NM = data.NICK_NM;
                    $scope.ADDR = data.ADDR;
                    $scope.ADDR_DETAIL = data.ADDR_DETAIL;
                    $scope.REG_DT = data.REG_DT;
                    $scope.REG_DT = data.REG_DT;
                    $scope.PHONE_1 = data.PHONE_1;
                    $scope.PHONE_2 = data.PHONE_2;
                    $scope.BLOG_URL = data.BLOG_URL;

                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});



            // 리뷰 리스트 페이징 처리
            $scope.PAGE_NO = 1;
            $scope.TOTAL_COUNT = 0;
        };

        $scope.click_focus = function(){
            //$('html,body').animate({scrollTop:$('#item').offset().top}, 150);
            $("#preg_fl").focus();
            //$("#moms_state").attr("tabindex", -1).focus(); div로 포커스를 줄때 사용

        }

        $scope.click_viewfocus = function(){
            //$('html,body').animate({scrollTop:$('#item').offset().top}, 150);
            $("#view_state").focus();

            //$("#moms_state").attr("tabindex", -1).focus(); div로 포커스를 줄때 사용

        }

        // 조회수
//        $scope.addHitCnt = function () {
//            $scope.updateItem('ange/event', 'hit', $stateParams.id, {}, false)
//                .then(function(){
//                })
//                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
//        }

        // 게시판 조회
        $scope.getMomsExperience = function () {

            if ($stateParams.id != 0) {
                return $scope.getItem('ange/event', 'item', $stateParams.id, {}, false)
                    .then(function(data){

                        $scope.open_date2 = data.ada_date_open.replace(/-/gi, "");
//                        $scope.end_date = data.ada_date_close.replace(/-/gi, "");
                        $scope.open_date = data.ada_date_review_open.replace(/-/gi, "");
                        $scope.end_date = data.ada_date_review_close.replace(/-/gi, "");


                        var day = 1000*60*60*24;

                        $scope.D_DAY = parseInt($scope.end_date) - parseInt($scope.todayDate);
                        console.log(parseInt($scope.D_DAY/day));

                        $scope.D_DAY = parseInt($scope.D_DAY/day);

                        $scope.item = data;
                        $scope.item.BOARD_NO = data.ada_idx;

                        data.ada_preview_img = CONSTANT.AD_FILE_URL + data.ada_preview;
                        data.ada_content_img = CONSTANT.AD_FILE_URL + data.ada_image;

                        if($scope.todayDate <= $scope.end_date){
                            $scope.showForm = "compForm";
                        }else{
                            $scope.showForm = "reviewForm";
                        }

                        $scope.item.ada_option_delivery = data.ada_option_delivery.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                        // 질문일 때
                        if($scope.item.ada_que_type == 'question'){
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

                            if(data.ada_que_info != ''){
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

//                            var que_data = data.ada_que_info;
//                            que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
//                            var parse_que_data = JSON.parse(que_data);
//
//                            for(var x in parse_que_data){
//                                $scope.item.REPLY_SUBJECT = parse_que_data[x].title;
//                            }
                            $scope.item.REPLY_SUBJECT = $scope.item.ada_title;
                        }

                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.click_momsexperiencecomp = function () {

            // 세션만료 되었을 때 리스트로 이동
            if($scope.uid == '' || $scope.uid == null){
                dialogs.notify('알림', '세션이 만료되어 로그아웃 되었습니다. 로그인 후 다시 작성하세요', {size: 'md'});

                $location.url('/moms/experienceprocess/list');
            }

            // 현재날짜가 모집시작일이 아닐때
            if($scope.open_date2 > $scope.todayDate){
                dialogs.notify('알림', '모집 시작기간이 아닙니다', {size: 'md'});
                return;
            }

            if($scope.item.ada_que_type == 'question'){ // 문답일때

                var answer = [];
                $scope.item.QUE_SHORT_ANSWER = ''
                $("input[name='answer[]'").each(function(index, element) {

                    if($(element).val() == "" || $(element).val() == null || $(element).val() == undefined){
                        dialogs.notify('알림', '문항을 입력하세요', {size: 'md'});
                        return false;
                    }

                    $scope.item.QUE_SHORT_ANSWER = $(element).val();
                    answer.push($scope.item.QUE_SHORT_ANSWER); // 주관식
                })

                var values = {};

                $('.poll_select_radio:checked').each(function() {

//                    if($(".poll_query_no").length !=  $('.poll_select_radio').length){
//                        dialogs.notify('알림', '문항을 작성하세요', {size: 'md'});
//                        return false;
//                    }

                    if(this.value == undefined){
                        values[this.name] = "";
                    }

                    if(this.value == "기타"){
                        console.log($("#etc_answer").val());
                        values[this.name] = $("input[name='etc_answer']").val();
                    }

                    values[this.name] = this.value;
                    answer.push(values[this.name]); // 객관식
                    console.log(this.value);
                });

                var check_answer = ''
                $('.poll_select_checkbox:checked').each(function() {

//                    if($(".poll_query_no").length !=  $('.poll_select_radio').length){
//                        dialogs.notify('알림', '문항을 작성하세요', {size: 'md'});
//                        return false;
//                    }
                    values[this.name] = ','
                    if(this.value == undefined){
                        values[this.name] = "";
                    }
                    values[this.name] += this.value;



                    check_answer += this.value
                    answer.push(check_answer); // 객관식

                    console.log(check_answer);
                });

                $rootScope.jsontext2 = new Array();

                $("input[name='index[]'").each(function(index, element) {
                    $rootScope.jsontext2[index] = '"'+index+'":"'+ answer[index]+'"'; //[index] [$(element).val()]
                })

                $scope.item.ANSWER = '{'+$rootScope.jsontext2+'}';
                console.log($scope.item.ANSWER);

                $scope.insertItem('ange/comp', 'item', $scope.item, false)
                    .then(function(){
                        dialogs.notify('알림', '이벤트 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                        if ($stateParams.menu == 'eventprocess') {
                            $location.url('/moms/eventprocess/list');
                        } else if($stateParams.menu == 'eventperformance') {
                            $location.url('/moms/eventperformance/list');
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                $scope.insertItem('ange/comp', 'item', $scope.item, false)
                    .then(function(){
                        dialogs.notify('알림', '체험단 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                        $location.url('/moms/experienceprocess/list');
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            }else if($scope.item.ada_que_type == 'reply'){ // 댓글일때

                console.log('{"'+$scope.item.REPLY_SUBJECT+'":"'+ $scope.item.COMMENT+'"}');
                $scope.item.ANSWER = '{"1":"'+ $scope.item.COMMENT+'"}';

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){
                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){
                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '체험단 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $location.url('/moms/experienceprocess/list');
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 체험단에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

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

                $scope.insertItem('ange/comp', 'item', $scope.item, false)
                    .then(function(){
                        dialogs.notify('알림', '체험단 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                        $location.url('/moms/experienceprocess/list');
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }else if($scope.item.ada_que_type == 'upload'){

             // 문답일때
                var answer = [];
                $rootScope.jsontext3 = "";

                console.log($scope.file);

                if ($scope.file == undefined) {
                    dialogs.notify('알림', '이미지를 등록해야합니다.', {size: 'md'});
                    return;
                }

                $scope.item.FILE = $scope.file;

                if($scope.item.QUE != ''){
                    var answer = [];
                    $scope.item.QUE_SHORT_ANSWER = ''
                    $("input[name='answer[]'").each(function(index, element) {

                        if($(element).val() == "" || $(element).val() == null || $(element).val() == undefined){
                            dialogs.notify('알림', '문항을 입력하세요', {size: 'md'});
                            return false;
                        }

                        $scope.item.QUE_SHORT_ANSWER = $(element).val();
                        answer.push($scope.item.QUE_SHORT_ANSWER); // 주관식
                    })

                    var values = {};

                    $('.poll_select_radio:checked').each(function() {

//                    if($(".poll_query_no").length !=  $('.poll_select_radio').length){
//                        dialogs.notify('알림', '문항을 작성하세요', {size: 'md'});
//                        return false;
//                    }

                        if(this.value == undefined){
                            values[this.name] = "";
                        }

                        if(this.value == "기타"){
                            console.log($("#etc_answer").val());
                            values[this.name] = $("input[name='etc_answer']").val();
                        }

                        values[this.name] = this.value;
                        answer.push(values[this.name]); // 객관식
                        console.log(this.value);
                    });

                    var check_answer = ''
                    $('.poll_select_checkbox:checked').each(function() {

//                    if($(".poll_query_no").length !=  $('.poll_select_radio').length){
//                        dialogs.notify('알림', '문항을 작성하세요', {size: 'md'});
//                        return false;
//                    }
                        values[this.name] = ','
                        if(this.value == undefined){
                            values[this.name] = "";
                        }
                        values[this.name] += this.value;



                        check_answer += this.value
                        answer.push(check_answer); // 객관식

                        console.log(check_answer);
                    });

                    $rootScope.jsontext2 = new Array();

                    $("input[name='index[]'").each(function(index, element) {
                        $rootScope.jsontext2[index] = '"'+index+'":"'+ answer[index]+'"'; //[index] [$(element).val()]
                    })

                    $scope.item.ANSWER = '{'+$rootScope.jsontext2+','+$scope.file.name+'}';
                    console.log($scope.item.ANSWER);

//                    $scope.insertItem('ange/comp', 'item', $scope.item, false)
//                        .then(function(){
//                            dialogs.notify('알림', '이벤트 참여가 정상적으로 완료되었습니다.', {size: 'md'});
//
//                            if ($stateParams.menu == 'eventprocess') {
//                                $location.url('/moms/eventprocess/list');
//                            } else if($stateParams.menu == 'eventperformance') {
//                                $location.url('/moms/eventperformance/list');
//                            }
//                        })
//                        .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                }else{


                    $rootScope.jsontext3 = '"1":"'+ $scope.file.name+'"';
                    $scope.item.ANSWER = '{'+$rootScope.jsontext3+'}';
                }

                $scope.insertItem('ange/comp', 'item', $scope.item, false)
                    .then(function(){
                        dialogs.notify('알림', '체험단 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                        $location.url('/moms/experienceprocess/list');
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            }

        }

        $scope.click_momsexperiencelist = function (){
            if ($stateParams.menu == 'experienceprocess') {
                $location.url('/moms/experienceprocess/list');
            } else if($stateParams.menu == 'experiencepast') {
                $location.url('/moms/experiencepast/list');
            }
        }

        // 리뷰 목록 리스트
        $scope.getExperienceReviewList = function() {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.FILE = true;
            $scope.search.TARGET_NO = $stateParams.id;

            $scope.getList('ange/review', 'list', {NO: $scope.PAGE_NO, SIZE: 5}, $scope.search, true)
                .then(function(data){

                    for(var i in data) {

                        // thumnail
                        var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'REVIEW';
                        data[i].FILE = img;

                        // 본문 html 태그 제거
                        var source = data[i].BODY;
                        var pattern = /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig;

                        source = source.replace(pattern, '');
                        source = source.replace(/&nbsp;/ig, '');
                        source = source.trim();

                        data[i].BODY = source;

                        // data push
                        $scope.reviewList.push(data[i]);
                    }

                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.reviewList = "";});
        }

        // 조회 화면 이동
        $scope.click_showViewReview = function (key) {

            if ($stateParams.menu == 'experienceprocess' || $stateParams.menu == 'experiencepast') {
                $location.url('/moms/experiencereview/view/'+key);
            }

        };

        // 블로그 추가
        $scope.click_add_blog = function (){

            // clone 속성을 true 로 지정하면 이벤트도 같이 복사됨
           var new_blog =  $('span.blog:last').clone(true);
           $("#blog_url").append(new_blog);

            $(".button").removeAttr('disabled');

        }

        // 블로그 삭제
        $scope.delete_blog_url = function (){


            $('span.blog:last').remove();

            if($("input[name='blog[]'").length == 1){
                $(".button").attr('disabled','disabled');
            }

        }

        /* 댓글 (삭제예정) */

        $scope.comment = {};
        $scope.reply = {};

        $scope.search = {SYSTEM_GB: 'ANGE'};

        $scope.showDetails = false;
        $scope.showCommentDetails = false;
        $scope.showReCommentDetails = false;

        $scope.replyList = [];

        $scope.search.PAGE_NO = 1;
        $scope.search.PAGE_SIZE = 10;
        $scope.search.TOTAL_COUNT = 0;


        // 페이지 변경
        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.search.PAGE_NO);
            $scope.replyList = [];
            $scope.getPeopleReplyList();
        };

        // 댓글 리스트
        $scope.getPeopleReplyList = function () {

            $scope.search.TARGET_NO = $stateParams.id;
            $scope.search.TARGET_GB = 'exp';

            $scope.getItem('com/reply_event', 'item', {}, $scope.search, true)
                .then(function(data){

                    if(data.COMMENT == null){
                        $scope.search.TOTAL_COUNT = 0;
                    }else{
                        $scope.search.TOTAL_COUNT = data.COMMENT[0].TOTAL_COUNT;
                    }

                    var reply = data.COMMENT;

                    for(var i in reply) {
                        $scope.replyList.push({"NO":reply[i].NO,"PARENT_NO":reply[i].PARENT_NO,"COMMENT":reply[i].COMMENT,"RE_COUNT":reply[i].RE_COUNT,"REPLY_COMMENT":reply[i].REPLY_COMMENT,"LEVEL":reply[i].LEVEL,"REPLY_NO":reply[i].REPLY_NO,"NICK_NM":reply[i].NICK_NM,"REG_DT":reply[i].REG_DT, "REG_UID":reply[i].REG_UID});
                    }

                })
                .catch(function(error){$scope.replyList = ""; $scope.search.TOTAL_COUNT=0;});
        };

        // 의견 등록
        $scope.click_savePeopleBoardComment = function () {

            if ($rootScope.uid == null || $rootScope.uid == '') {
                dialogs.notify('알림', '등록할 수 없는 상태입니다.', {size: 'md'});
                return;
            }

            $scope.item.PARENT_NO = 0;
            $scope.item.LEVEL = 1;
            $scope.item.REPLY_NO = 1;
            $scope.item.TARGET_NO = $stateParams.id;
            $scope.item.TARGET_GB = 'exp';

            $scope.item.REMAIN_POINT = 10;

            if($scope.item.COMMENT.length > 100){
                dialogs.notify('알림', '100자 이내로 입력하세요.', {size: 'md'});
                return;
            }

            $scope.item.REG_UID = $rootScope.uid;
            $scope.item.NICK_NM = $rootScope.nick;

            $scope.search.REG_UID = $rootScope.uid;
            $scope.search.TARGET_NO = $stateParams.id;

            $scope.getList('com/reply_event', 'check', {}, $scope.search, false)
                .then(function(data){
                    var cnt = data[0].COUNT;

                    if(cnt == 0){
                        $scope.insertItem('com/reply_event', 'item', $scope.item, false)
                            .then(function(){
                                $scope.getItem('com/reply', 'item', {}, $scope.search, true)
                                    .then(function(data){
                                        if(data.COMMENT == null){
                                            $scope.TODAY_TOTAL_COUNT = 0;
                                        }else{
                                            $scope.TODAY_TOTAL_COUNT = data.COMMENT[0].TOTAL_COUNT;
                                        }
                                    })
                                    .catch(function(error){$scope.replyList = ""; $scope.TODAY_TOTAL_COUNT = 0;});

                                $scope.search.TARGET_NO = $stateParams.id;
                                $scope.replyList = [];
                                $scope.getPeopleReplyList();

                                $scope.item.COMMENT = "";
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }else{
                        dialogs.notify('알림', '이벤트는 한번만 참여가 가능합니다.', {size: 'md'});
                        return;
                    }

                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 수정
        $scope.click_updateReply = function (key, comment) {

            console.log(key);

            $scope.replyItem = {};
            $scope.replyItem.COMMENT = comment;

            $scope.replyItem.REG_UID = $rootScope.user_id;
            $scope.replyItem.NICK_NM = $rootScope.user_nick;

            $scope.updateItem('com/reply_event', 'item', key, $scope.replyItem, false)
                .then(function(){

                    $scope.replyItem.COMMENT = "";

                    dialogs.notify('알림', '댓글이 수정 되었습니다.', {size: 'md'});

                    $scope.replyList = [];
                    $scope.getPeopleReplyList();

                    $scope.item.COMMENT = "";
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 삭제
        $scope.click_deleteReply = function (item) {

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            console.log(item);
            dialog.result.then(function(btn){
                $scope.deleteItem('com/reply_event', 'item', item, true)

                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});

//                        $scope.item.REMAIN_POINT = 10;
//                        $scope.updateItem('ange/mileage', 'mileageitemminus', {}, $scope.item, false)
//                            .then(function(){
//                            })
//                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        $scope.replyList = [];
                        $scope.getPeopleReplyList();

                        $scope.item.COMMENT = "";
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        // 주석해제 할 예정
//        $scope.getSession()
//            .then($scope.sessionCheck)
//            .catch($scope.reportProblems);

        if ($location.search()) {
            var param = $location.search();
            if(param.user_id != undefined && param.user_id != '') {
                $scope.item.user_id = param.user_id;
                $scope.item.user_nick = decodeURIComponent(param.user_nick);

                $scope.insertItem('login', 'temp', $scope.item, false)
                    .then(function(data) {
                        console.log(JSON.stringify(data));

                        $rootScope.uid = $scope.item.user_id;
                        $rootScope.nick = $scope.item.user_nick;

                        console.log("임시 세션 생성 성공");
                    }).catch(function(error){});
            }
        };

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMomsExperience)
            .then($scope.getExperienceReviewList)
            .catch($scope.reportProblems);


//        $scope.init();
////         $scope.addHitCnt();
//        $scope.getMomsExperience();
//        $scope.getExperienceReviewList();

        // 댓글리스트(삭제예정)
        $scope.getPeopleReplyList();

    }]);
});
