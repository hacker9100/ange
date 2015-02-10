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

                    $scope.item.USER_ID = data.USER_ID;
                    $scope.item.USER_NM = data.USER_NM;
                    $scope.item.NICK_NM = data.NICK_NM;
                    $scope.item.ADDR = data.ADDR;
                    $scope.item.ADDR_DETAIL = data.ADDR_DETAIL;
                    $scope.item.REG_DT = data.REG_DT;
                    $scope.item.REG_DT = data.REG_DT;
                    $scope.item.PHONE_1 = data.PHONE_1;
                    $scope.item.PHONE_2 = data.PHONE_2;

                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

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

                            $scope.item.USER_ID = data.USER_ID;
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


                            }).catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){

                $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                    .then(function(data){

                        $scope.item = data;
                        console.log($scope.item);

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
               $scope.search.EVENT_GB = 'SAMPLE1';
           }else{
               $scope.search.EVENT_GB = 'SAMPLE2';
           }

           $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var target_gb = data[0].EVENT_GB;
                    var target_no = data[0].NO;

                    $scope.season_gb = target_gb;

                    $scope.item.target_gb = target_gb;
                    $scope.item.ada_idx = target_no;


                   var babyBirthDt = $rootScope.user_info.BABY_BIRTH_DT;

                   $scope.item.YEAR = babyBirthDt.substr(0,4);
                   $scope.item.MONTH = babyBirthDt.substr(4,2);
                   $scope.item.DAY = babyBirthDt.substr(6,2);

                })
                .catch(function(error){});
        };

        // 회원가입 화면 이동
        $scope.click_joinon = function (){
            $location.url('/infodesk/signon');
        }

        // 샘플팩 신청
        $scope.click_saveSamplepackComp = function (){


            $scope.search.REG_UID = $rootScope.uid;
            $scope.search.TARGET_NO = $scope.item.ada_idx;
            $scope.search.TARGET_GB = $scope.item.target_gb;

            if($scope.season_gb == 'SAMPLE2'){

                if($scope.checked == 'N'){
                    dialogs.notify('알림', '신청 자격을 확인해주세요.', {size: 'md'});
                    return;
                }

                var mileage_point = $rootScope.user_info.MILEAGE.REMAIN_POINT;

                if(mileage_point < 2000){
                    alert('보유 마일리지가 부족하여 신청이 불가능 합니다');
                    return;
                }
            }

            $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                .then(function(data){
                    var comp_cnt = data[0].COMP_CNT;

                    if(comp_cnt == 0){
                        $scope.insertItem('ange/comp', 'item', $scope.item, false)
                            .then(function(){

//                                if($scope.season_gb == 'SAMPLE2'){ // 기존회원일때 마일리지 2000 차감
//
//                                    $scope.item.REMAIN_POINT = 2000;
//                                    $scope.updateItem('ange/mileage', 'mileageitemminus', {}, $scope.item, false)
//                                        .then(function(){
//                                        })
//                                        .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
//                                }

                                dialogs.notify('알림', '샘플팩 신청이 완료되었습니다.', {size: 'md'});

                                $location.url('/moms/samplepack/intro');
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }else{
                        dialogs.notify('알림', '이미 샘플팩 신청을 했습니다.', {size: 'md'});
                        $location.url('/moms/samplepack/intro');
                    }

            })
            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});


        }
        /********** 화면 초기화 **********/
/*        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCmsBoard)
            .catch($scope.reportProblems);*/

        // 신청자격 여부 체크
        $scope.click_samplepackCheck = function (){

            $scope.search.TARGET_NO = $scope.item.ada_idx;
            $scope.search.TARGET_GB = $scope.item.target_gb;

            $scope.getList('ange/comp', 'samplepackCheck', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    var checkCnt = data[0].COUNT;

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
                .catch(function(error){});
        }


        $scope.init();
        $scope.click_sampleSeasonList();

        $scope.getSession()
            .then($scope.sessionCheck)
            .catch($scope.reportProblems);


    }]);
});
