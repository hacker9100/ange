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
    controllers.controller('momsexperience-view', ['$scope','$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope,$rootScope, $stateParams, $location, dialogs, UPLOAD) {

        $scope.queue = [];
        $scope.search = {};

        $scope.item = {};
        $scope.item.BLOG = [];

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

        $scope.year = year;
        $scope.babyYear = babyYear;
        $scope.month = month;
        $scope.day = day;
        $scope.hour = hour;
        $scope.minute = minute;

        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'MOMS';


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
        $scope.init = function(session) {

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

            var date = new Date();

            // GET YYYY, MM AND DD FROM THE DATE OBJECT
            var year = date.getFullYear().toString();
            var mm = (date.getMonth()+1).toString();
            var dd  = date.getDate().toString();

            if(mm < 10){
                mm = '0'+mm;
            }

            if(dd < 10){
                dd = '0'+dd;
            }

            var today = year+mm+dd;
            $scope.todayDate = today;

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

                        $scope.D_DAY = parseInt($scope.item.END_DATE) - parseInt($scope.todayDate);
                        console.log($scope.D_DAY);

                        $scope.item = data;
                        $scope.item.BOARD_NO = data.ada_idx;

                        $scope.open_date = data.OPEN_DATE;

                        $scope.search.TARGET_NO = $stateParams.id;

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.click_momseventcomp = function () {

            // 세션만료 되었을 때 리스트로 이동
            if($scope.uid == '' || $scope.uid == null){
                dialogs.notify('알림', '세션이 만료되어 로그아웃 되었습니다. 로그인 후 다시 작성하세요', {size: 'md'});
                $location.url('/moms/eventprocess/list');
            }

            // 현재날짜가 모집시작일이 아닐때
            if($scope.open_date > $scope.todayDate){
                dialogs.notify('알림', '모집 시작기간이 아닙니다', {size: 'md'});
                return;
            }

            if($("#credit_agreement_Y").is(":checked")){
                $scope.item.CREDIT_FL = 'Y';
            }else{
                alert('제 3자 정보제공에 동의 하셔야 상품 발송이 가능합니다.');
                return;
            }

            $scope.search.REG_UID = $scope.uid;
            $scope.search.TARGET_NO = $scope.item.ada_idx;
            $scope.search.TARGET_GB = 'EXPERIENCE';

            $scope.item.BABY_BIRTH = $scope.item.BABY_YEAR + $scope.item.BABY_MONTH + $scope.item.BABY_DAY;

            // 임신주차는 0으로 셋팅(int 형이라 null로 넣으면 쿼리에러 발생)
            $scope.item.PREGNANT_WEEKS = 0;

            // 추가한 블로그 갯수 만큼 반복
            $scope.item.BLOG_URL = '';
            $("input[name='blog[]'").each(function(index, element) {
                if(index != (cnt -1)){
                    $scope.item.BLOG_URL += $(element).val()+', ';
                }else{
                    $scope.item.BLOG_URL += $(element).val();
                }

            })

            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                .then(function(){

                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                    $location.url('/moms/experienceprocess/list');
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/
            $scope.search.FILE = true;
            $scope.search.TARGET_NO = $stateParams.id;

            $scope.getList('ange/review', 'list', {NO: $scope.PAGE_NO, SIZE: 5}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                    }
                    $scope.reviewList = data;

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
        }

        // 블로그 삭제
        $scope.delete_blog_url = function (){
            $('span.blog:last').remove();
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .catch($scope.reportProblems);

        $scope.init();
//         $scope.addHitCnt();
        $scope.getMomsExperience();
        $scope.getExperienceReviewList();

    }]);
});
