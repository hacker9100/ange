/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : momsevent-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsevent-view', ['$scope', '$rootScope', '$sce', '$stateParams', '$window', '$location', '$timeout', 'dialogs', 'CONSTANT', 'UPLOAD', function ($scope,$rootScope, $sce, $stateParams, $window, $location, $timeout, dialogs, CONSTANT, UPLOAD) {

        $scope.imageMap = function(id) {
            if (angular.element('img[usemap=#'+id+']').attr('usemap') == undefined) {
                return;
            }

            var w = angular.element('img[usemap=#'+id+']').attr('width'),
                h = angular.element('img[usemap=#'+id+']').attr('height');

            function resize(){
                if (!w || !h) {
                    var temp = new Image();
                    temp.src = angular.element('img[usemap=#'+id+']').attr('src');
                    if(temp.src == undefined)
                        temp.src = angular.element('img[usemap=#'+id+']').attr('ng-src');

                    if (!w)
                        w = temp.width;
                    if (!h)
                        h = temp.height;
                }

                var wPercent = angular.element('img[usemap=#'+id+']').width()/100,
                    hPercent = angular.element('img[usemap=#'+id+']').height()/100,
                    map = angular.element('img[usemap=#'+id+']').attr('usemap').replace('#', ''),
                    c = 'coords';

                angular.element('map[name="' + map + '"]').find('area').each(function(){
                    var $this = $(this);

                    if (!$this.data(c)){
                        $this.data(c, $this.attr(c));
                    }

                    var coords = $this.data(c).split(','),
                        coordsPercent = new Array(coords.length);

                    for (var i = 0; i<coordsPercent.length; ++i){
                        if (i % 2 === 0){
                            coordsPercent[i] = parseInt(((coords[i]/w)*100)*wPercent);
                        } else {
                            coordsPercent[i] = parseInt(((coords[i]/h)*100)*hPercent);
                        };
                    };
                    $this.attr(c, coordsPercent.toString());
                });
            }
            angular.element($window).resize(resize).trigger('resize');
        };

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
        var babyBirthYear = [];
        var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        var month = [];

        var hour = [];
        var minute = [];


        for (var i = nowYear ; i >= nowYear -10; i--) {
            babyYear.push(i+'');
        }

        for (var i = nowYear+1; i >= nowYear; i--) {
            babyBirthYear.push(i+'');
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

        $scope.babyBirthYear = babyBirthYear;
        $scope.babyYear = babyYear;
        $scope.month = month;
        $scope.day = day;

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

        var today = year+mm+dd;
        $scope.todayDate = today;

        if($rootScope.focus == 'comp'){
            $('html,body').animate({scrollTop:$('#moms_state').offset().top}, 300);
            $('#preg_fl').focus();

        }else if($rootScope.focus == 'view'){
            $('html,body').animate({scrollTop:$('#view_state').offset().top}, 100);
            $('#event_view').focus();
        }


        $(document).ready(function(){

            $('input:radio[name="credit_agreement"]:input[value="Y"]').attr("checked", true);

            $("#credit_agreement_Y").click(function(){
                if(!$("#credit_agreement_Y").is(":checked")){
                    $scope.item.CREDIT_FL = "Y";
                }
            });

            $("#credit_agreement_N").click(function(){
                if(!$("#credit_agreement_N").is(":checked")){
                    $scope.item.CREDIT_FL = "N";
                }
            });
        });

        /********** 콘텐츠 랜더링 **********/
//        $scope.renderHtml = function(html_code) {
//            return html_code != undefined ? $sce.trustAsHtml(html_code) : '';
////            return html_code;
//        };

        /********** 이벤트 **********/

        // 사용자 정보수정 버튼 클릭
        $scope.click_update_user_info = function () {
            $scope.openModal(null, 'md');
        };

        // 정보수정 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('user_info_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    $scope.item= {};

                    $scope.user_info = function () {
                        $scope.getItem('com/user', 'item', $scope.uid, {} , false)
                            .then(function(data){
                                $scope.item = data;
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
                        $scope.item.SYSTEM_GB = 'ANGE';
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

                $scope.getItem('com/user', 'item', $scope.uid, {} , false)
                    .then(function(data){

                        $rootScope.user_info.USER_ID = data.USER_ID;
                        $rootScope.user_info.USER_NM = data.USER_NM;
                        $rootScope.user_info.NICK_NM = data.NICK_NM;
                        $rootScope.user_info.ADDR = data.ADDR;
                        $rootScope.user_info.ADDR_DETAIL = data.ADDR_DETAIL;
                        $rootScope.user_info.REG_DT = data.REG_DT;
                        $rootScope.user_info.REG_DT = data.REG_DT;
                        $rootScope.user_info.PHONE_1 = data.PHONE_1;
                        $rootScope.user_info.PHONE_2 = data.PHONE_2;
                        $rootScope.user_info.BLOG_URL = data.BLOG_URL;

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };


        // 초기화
        $scope.init = function() {

            if ($stateParams.menu == 'eventprocess') {
                $scope.community = "진행중인 이벤트";
                $scope.search.EVENT_GB = "EVENT";
                $scope.menu = "eventprocess"
            } else if ($stateParams.menu == 'eventperformance') {
                $scope.community = "공연/체험 이벤트";
                $scope.search.EVENT_GB = "EVENT";
                $scope.search.PERFORM_FL = "Y";
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

            $scope.search.ada_idx = $stateParams.id;
            $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                .then(function(data){

                    var comp_cnt = data[0].COMP_CNT;

                    if(comp_cnt == 1){
                        $scope.comp_yn = 'Y';
                    }else{
                        $scope.comp_yn = 'N';
                    }
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.click_focus = function(){
            $("#preg_fl").focus();
        }

        // 조회수
//        $scope.addHitCnt = function () {
//            $scope.updateItem('ange/event', 'hit', $stateParams.id, {}, false)
//                .then(function(){
//                })
//                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
//        }

        // 게시판 조회
        $scope.getMomsEvent = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('ange/event', 'item', $stateParams.id, {}, false)
                    .then(function(data){

//                        $scope.open_date = data.ada_date_review_open.replace(/-/gi, "");
                        $scope.open_date = data.ada_date_open.replace(/-/gi, "");
                        $scope.open_date2 = data.ada_date_review_open.replace(/-/gi, "");
                        $scope.end_date = data.ada_date_close.replace(/-/gi, "");
                        $scope.end_date2 = data.ada_date_close.replace(/-/gi, "");
                        $scope.ada_detail = data.ada_detail != null ? data.ada_detail.replace(/&quot;/gi, '\"') : data.ada_detail;
                        $scope.ada_text = data.ada_text != null ? data.ada_text.replace(/&quot;/gi, '\"') : data.ada_text;
                        data.ada_imagemap = data.ada_imagemap != null ? data.ada_imagemap.replace(/&quot;/gi, '\"') : data.ada_imagemap;

                        $scope.ada_text = data.ada_text != null ? $scope.ada_text.replace(/src="/gi, 'src="'+CONSTANT.AD_SERVER_URL) : data.ada_text;
                        $scope.ada_imagemap = data.ada_imagemap.replace(/%name%/gi, 'adimage');
                        //$scope.ada_imagemap = data.ada_imagemap;

                        $scope.renderHtml = $sce.trustAsHtml($scope.ada_text+data.ada_imagemap);
                        $timeout(function() {
                            $scope.imageMap('adimage');
                        }, 500);


                        $scope.item = data;
                        $scope.item.BOARD_NO = data.ada_idx;

                        data.ada_preview_img = CONSTANT.AD_FILE_URL + data.ada_preview;
                        data.ada_content_img = CONSTANT.AD_FILE_URL + data.ada_image;


                        console.log('$scope.open_date2 = '+$scope.open_date2);

                        if($scope.todayDate <= $scope.end_date2|| $scope.open_date == '00000000'){ //if($scope.todayDate <= $scope.open_date2 || $scope.open_date2 == '00000000'){
                            $scope.showForm = "compForm";
                        }else{
                            $scope.showForm = "reviewForm";
                        }

                        $scope.item.ada_option_delivery = data.ada_option_delivery.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                        if ($scope.tempEvent) return;

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
                                }else if(parse_que_data[x].type == 4){ // 장문입력
                                    choice = "";
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
                                    }else if(parse_que_data[x].type == 4){ // 장문입력
                                        choice = "";
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
                            $scope.search.PAGE_NO = 1;
                            $scope.search.PAGE_SIZE = 10;
                            $scope.search.TOTAL_COUNT = 0;

                            $scope.eventReplyList = [];


                            $scope.replyPageChange = function(){
                                console.log('Page changed to: ' + $scope.search.PAGE_NO);
                                $scope.eventReplyList = [];
                                $rootScope.getEventReplyList();
                            }

                            $scope.search.ada_idx = $stateParams.id;
                            $scope.getItem('ange/event', 'replyitem', {}, $scope.search, true)
                                .then(function(data){

                                    $scope.REPLY_TOTAL_COUNT = data[0].TOTAL_COUNT;
                                })
                                .catch(function(error){$scope.eventReplyList = "";});

                            // 댓글 리스트
                            $rootScope.getEventReplyList = function () {

                                $scope.getItem('ange/event', 'replyitem', {}, $scope.search, true)
                                    .then(function(data){

                                        $scope.search.TOTAL_COUNT = data[0].TOTAL_COUNT;
                                        for(var i in data) {

                                            data[i].adhj_answers = data[i].adhj_answers.replace(/{"1":"/gi, '');
                                            data[i].adhj_answers = data[i].adhj_answers.replace(/"}/gi, '');

                                            $scope.eventReplyList.push({'NICK_NM' : data[i].nick_nm, 'COMMENT' : data[i].adhj_answers, 'REG_DT' : data[i].adhj_date_request});
                                        }
                                    })
                                    .catch(function(error){$scope.eventReplyList = "";});
                            };

                            $rootScope.getEventReplyList();

                        }

                        if($scope.item.ada_que_type == 'join'){

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
                                    }else if(parse_que_data[x].type == 4){ // 장문입력
                                        choice = "";
                                    }

                                    var index = parseInt(x)+parseInt(1);
                                    $scope.item.QUE.push({"index" : index,"title" : parse_que_data[x].title, "type" : parse_que_data[x].type, "choice" :choice});
                                    //console.log($scope.item.QUE);
                                }
                            }
                        }

                        // 날짜선택
                        if($scope.item.ada_que_type == 'reserve'){

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
                                    }else if(parse_que_data[x].type == 4){ // 장문입력
                                        choice = "";
                                    }

                                    var index = parseInt(x)+parseInt(1);
                                    $scope.item.QUE.push({"index" : index,"title" : parse_que_data[x].title, "type" : parse_que_data[x].type, "choice" :choice});
                                    //console.log($scope.item.QUE);
                                }
                            }
                        }

                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

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


        // 이벤트 신청
        $scope.click_momseventcomp = function () {

            // 세션만료 되었을 때 리스트로 이동
            if($scope.uid == '' || $scope.uid == null){
                dialogs.notify('알림', '로그인 후 이용 가능합니다', {size: 'md'});
                return;

//                if ($stateParams.menu == 'eventprocess') {
//                    $location.url('/moms/eventprocess/list');
//                } else if($stateParams.menu == 'eventperformance') {
//                    $location.url('/moms/eventperformance/list');
//                }
            }

            // 현재날짜가 모집시작일이 아닐때
            if($scope.open_date > $scope.todayDate){
                dialogs.notify('알림', '모집 시작기간이 아닙니다', {size: 'md'});
                return;
            }

            // 이벤트 종료기간이 지났을때
            if($scope.end_date2 < $scope.todayDate){
                dialogs.notify('알림', '종료된 체험단 입니다', {size: 'md'});
                return;
            }

            if(CheckForm(document.getElementById("eventvalidation")) == false){
                return;
            }

            if($scope.item.ada_que_type == 'question'){ // 문답일때

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){

                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){

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
                                    dialogs.notify('알림', '이벤트 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EVENT', 'EVENT');

                                    if ($stateParams.menu == 'eventprocess') {
                                        $location.url('/moms/eventprocess/list');
                                    } else if($stateParams.menu == 'eventperformance') {
                                        $location.url('/moms/eventperformance/list');
                                    }
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 이벤트에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            } else if($scope.item.ada_que_type == 'reserve'){ // 날짜예약선택

                // 정보제공 동의체크 확인
//                if($("#credit_agreement_Y").is(":checked")){
//                    $scope.item.CREDIT_FL = 'Y';
//                }else{
//                    alert('제 3자 정보제공에 동의 하셔야 상품 발송이 가능합니다.');
//                    return;
//                }
//
//                if($scope.item.BABY_YEAR == undefined){
//                    alert('아기 생일년도를 선택하세요');
//                    return;
//                }
//
//                if($scope.item.BABY_MONTH == undefined){
//                    alert('아기 생년월을 선택하세요');
//                    return;
//                }
//
//                if($scope.item.BABY_DAY == undefined){
//                    alert('아기 생년일을 선택하세요');
//                    return;
//                }

//                if($scope.item.DELIVERY_YEAR == undefined){
//                    alert('출산예정일 연도를 선택하세요');
//                    return;
//                }
//
//                if($scope.item.DELIVERY_MONTH == undefined){
//                    alert('출산예정일 월을 선택하세요');
//                    return;
//                }
//
//                if($scope.item.DELIVERY_DAY == undefined){
//                    alert('출산예정일 일을 선택하세요');
//                    return;
//                }
//                if($scope.item.DELIVERY_YEAR == undefined){
//                    $scope.item.DELIVERY_YEAR = '';
//                }else{
//                    $scope.item.DELIVERY_YEAR = $scope.item.DELIVERY_YEAR;
//                }
//
//                if($scope.item.DELIVERY_MONTH == undefined){
//                    $scope.item.DELIVERY_MONTH = '';
//                }else{
//                    $scope.item.DELIVERY_MONTH = $scope.item.DELIVERY_MONTH;
//                }
//
//                if($scope.item.DELIVERY_DAY == undefined){
//                    $scope.item.DELIVERY_DAY = '';
//                }else{
//                    $scope.item.DELIVERY_DAY = $scope.item.DELIVERY_DAY;
//                }

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){
                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){
                            $rootScope.jsontext2 = new Array();

                            var poll_length = $('.poll_reserve_no').length;
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
                                    dialogs.notify('알림', '이벤트 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EVENT', 'EVENT');

                                    if ($stateParams.menu == 'eventprocess') {
                                        $location.url('/moms/eventprocess/list');
                                    } else if($stateParams.menu == 'eventperformance') {
                                        $location.url('/moms/eventperformance/list');
                                    }
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 이벤트에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            } else if($scope.item.ada_que_type == 'reply'){ // 댓글일때

                if($scope.item.COMMENT == undefined || $scope.item.COMMENT == ''){
                    alert('댓글을 입력하세요');
                    return;
                }

                //console.log('{"'+$scope.item.REPLY_SUBJECT+'":"'+ $scope.item.COMMENT+'"}');
                $scope.item.ANSWER = '{"1":"'+ $scope.item.COMMENT+'"}';

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){
                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){
                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '이벤트 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EVENT', 'EVENT');

                                    if ($stateParams.menu == 'eventprocess') {
                                        $location.url('/moms/eventprocess/list');
                                    } else if($stateParams.menu == 'eventperformance') {
                                        $location.url('/moms/eventperformance/list');
                                    }
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 이벤트에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
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

                if($scope.item.BABY_YEAR == undefined){
                    alert('아기 생일년도를 선택하세요');
                    return;
                }

                if($scope.item.BABY_MONTH == undefined){
                    alert('아기 생년월을 선택하세요');
                    return;
                }

                if($scope.item.BABY_DAY == undefined){
                    alert('아기 생년일을 선택하세요');
                    return;
                }

                if($scope.item.DELIVERY_YEAR == undefined){
                    $scope.item.DELIVERY_YEAR = '';
                }else{
                    $scope.item.DELIVERY_YEAR = $scope.item.DELIVERY_YEAR;
                }

                if($scope.item.DELIVERY_MONTH == undefined){
                    $scope.item.DELIVERY_MONTH = '';
                }else{
                    $scope.item.DELIVERY_MONTH = $scope.item.DELIVERY_MONTH;
                }

                if($scope.item.DELIVERY_DAY == undefined){
                    $scope.item.DELIVERY_DAY = '';
                }else{
                    $scope.item.DELIVERY_DAY = $scope.item.DELIVERY_DAY;
                }

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){
                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){

                            $scope.search.REG_UID = $scope.uid;
                            $scope.search.TARGET_NO = $scope.item.ada_idx;
                            $scope.search.TARGET_GB = 'EVENT';

                            $scope.item.BABY_BIRTH = $scope.item.BABY_YEAR + $scope.item.BABY_MONTH + $scope.item.BABY_DAY;

                            // 임신주차는 0으로 셋팅(int 형이라 null로 넣으면 쿼리에러 발생)
                            $scope.item.PREGNANT_WEEKS = 0;


                            var babybirthday = '';
                            babybirthday = $scope.item.BABY_YEAR + '-' + $scope.item.BABY_MONTH + '-' + $scope.item.BABY_DAY;

                            var deliveryday = '';
                            deliveryday = $scope.item.DELIVERY_YEAR + '-' + $scope.item.DELIVERY_MONTH + '-' + $scope.item.DELIVERY_DAY;

                            console.log(babybirthday);
                            console.log(deliveryday);

                            if($scope.item.BLOG == undefined){
                                alert('블로그 주소를 입력하세요');
                                return;
                            }

                            var cnt = $scope.item.BLOG.length;

                            $scope.item.BLOG_URL = '';
                            $("input[name='blog[]'").each(function(index, element) {
                                if(index != (cnt -1)){
                                    $scope.item.BLOG_URL += $(element).val()+';';
                                }else{
                                    $scope.item.BLOG_URL += $(element).val();
                                }

                            });

                            if($scope.item.REASON != undefined){
                                $scope.item.REASON = $scope.item.REASON.replace(/^\s+|\s+$/g,'');
                            }

                            console.log($scope.item.REASON);

                            if($scope.item.REASON == undefined || $scope.item.REASON == ""){
                                alert('신청사유를 작성하세요');
                                return;
                            }

                            var answer = '"1":"'+babybirthday+'","2":"'+deliveryday+'","3":"'+$scope.item.BLOG_URL+'","4":"'+$scope.item.REASON+'"';
                            console.log(answer);

                            if($scope.item.QUE != undefined){
                                $rootScope.jsontext2 = new Array();

                                var poll_length = $('.poll_join_no').length;
                                console.log(poll_length);


                                for(var i=1; i<=poll_length; i++){

                                    if(document.getElementById("answer"+i).type == 'radio'){
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+$("input[name=answer"+i+"]:checked").val() +'"';
                                    }else if(document.getElementById("answer"+i).type == 'checkbox'){
                                        var checkvalue = '';
                                        $("input[name=answer"+i+"]:checked").each(function() {
                                            checkvalue += $(this).val() + ';';
                                            console.log(checkvalue);
                                        });
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ checkvalue+'"';
                                    }else if(document.getElementById("answer"+i).type == 'text'){
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ document.getElementById("answer"+i).value+'"';
                                    }else if(document.getElementById("answer"+i).type == 'textarea'){
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ document.getElementById("answer"+i).value+'"';
                                    }
                                }

                                $scope.item.ANSWER = '{'+answer+$rootScope.jsontext2+'}';
                                //$scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                                console.log($scope.item.ANSWER);
                            }else{
                                $scope.item.ANSWER = '{'+answer+'}';
                                console.log($scope.item.ANSWER);
                            }

                            //poll_join_no

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '이벤트 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EVENT', 'EVENT');

                                    if ($stateParams.menu == 'eventprocess') {
                                        $location.url('/moms/eventprocess/list');
                                    } else if($stateParams.menu == 'eventperformance') {
                                        $location.url('/moms/eventperformance/list');
                                    }
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 이벤트에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }

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

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){

                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){

                            $scope.item.FILE = $scope.file;

                            console.log($scope.item.QUE);

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
                                last_poll_length = poll_length+1;
                                //$scope.item.ANSWER = '{'+$rootScope.jsontext2+',"'+last_poll_length+'":"'+ $scope.file.name+'"'+'}';
                                $scope.item.ANSWER = '{'+$rootScope.jsontext2+',"'+last_poll_length+'":"'+ $scope.file.name+'"'+'}';
                                $scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                                console.log($scope.item.ANSWER);

                                console.log($scope.item.ANSWER);

                            }else{

                                $rootScope.jsontext3 = '"1":"'+ $scope.file.name+'"';
                                $scope.item.ANSWER = '{'+$rootScope.jsontext3+'}';

                                console.log($scope.item.ANSWER);
                            }

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '이벤트 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EVENT', 'EVENT');

                                    if ($stateParams.menu == 'eventprocess') {
                                        $location.url('/moms/eventprocess/list');
                                    } else if($stateParams.menu == 'eventperformance') {
                                        $location.url('/moms/eventperformance/list');
                                    }
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 이벤트에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }

        }

        $scope.click_momseventlist = function (){
            if ($stateParams.menu == 'eventprocess') {
                $location.url('/moms/eventprocess/list');
            } else if($stateParams.menu == 'eventperformance') {
                $location.url('/moms/eventperformance/list');
            }
        }

        $scope.getExperienceReviewList = function() {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.FILE = true;
            $scope.search.TARGET_NO = $stateParams.id;



            $scope.getList('ange/review', 'list', {NO: $scope.PAGE_NO-1, SIZE: 5}, $scope.search, true)
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
            if ($stateParams.menu == 'eventprocess' || $stateParams.menu == 'eventperformance') {
                $location.url('/moms/eventreview/view/'+key);
            }
        };

        // 블로그 추가
        $scope.click_add_blog = function (){

            // clone 속성을 true 로 지정하면 이벤트도 같이 복사됨
            var new_blog =  $('span.blog:last').clone(true);
            new_blog.find('input').val('');
            $("#blog_url").append(new_blog);

            $(".button").each(function(index){
                $(".button:eq("+index+1+")").removeAttr('disabled');
            })
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
            $scope.search.TARGET_GB = 'event';

            $scope.getItem('com/reply_event', 'item', {}, $scope.search, true)
                .then(function(data){

                    if(data.COMMENT == null){
                        $scope.search.TOTAL_COUNT = 0;
                    }else{
                        $scope.search.TOTAL_COUNT = parseInt(data.COMMENT[0].TOTAL_COUNT);
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
            $scope.item.TARGET_GB = 'event';

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

                                        $scope.addMileage('EVENT', 'EVENT');
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

            $scope.replyItem.REG_UID = $rootScope.uid;
            $scope.replyItem.NICK_NM = $rootScope.nick;

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
//          .then($scope.sessionCheck)
//          .catch($scope.reportProblems);

        $scope.tempReply = false;
        $scope.tempEvent = false;

        if ($stateParams.id == 39) {
            $scope.tempReply = true;
            $scope.tempEvent = true;

            if ($location.search()) {
                var param = $location.search();
                if(param.user_id != undefined && param.user_id != '') {
                    $scope.item.SYSTEM_GB = 'ANGE';
                    $scope.item.password = 'pass';

                    $scope.login(param.user_id, $scope.item)
                        .then(function(data){
                            $rootScope.login = true;
                            $rootScope.authenticated = true;
                            $rootScope.user_info = data;
                            $rootScope.uid = data.USER_ID;
                            $rootScope.name = data.USER_NM;
                            $rootScope.role = data.ROLE_ID;
                            $rootScope.system = data.SYSTEM_GB;
                            $rootScope.menu_role = data.MENU_ROLE;
                            $rootScope.email = data.EMAIL;
                            $rootScope.nick = data.NICK_NM;

                            if (data.FILE) {
                                $rootScope.profileImg = UPLOAD.BASE_URL + data.FILE.PATH + data.FILE.FILE_ID;
                            } else {
                                $rootScope.profileImg = null;
                            }

                        }).catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                }
            }
        } else if ($stateParams.id == 55) {
            $scope.tempEvent = true;

            $scope.getSession()
//                .then($scope.logout())
                .then($scope.sessionCheck)
                .then($scope.moveAccount)
                .catch($scope.reportProblems);
        } else if ($stateParams.id == 56) {
            $scope.tempEvent = true;
        }

        $scope.logout = function () {
            if ($rootScope.uid != undefined) {
                $scope.logout($rootScope.uid).then( function(data) {});
            }
        }

        $scope.click_review = function(){
            $location.url('/moms/productreview/edit/0');
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMomsEvent)
            .then($scope.getExperienceReviewList)
            .catch($scope.reportProblems);

        console.log($rootScope.uid);

//        $scope.init();
////         $scope.addHitCnt();
//        $scope.getMomsEvent();
//        $scope.getExperienceReviewList();

        // 댓글리스트(삭제예정)
        $scope.getPeopleReplyList();

    }]);
});
