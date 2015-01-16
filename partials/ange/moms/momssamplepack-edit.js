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

        $scope.showSamplepackDetails = false;

        $scope.click_update_user_info = function () {
            $scope.openModal(null, 'md');
        };

        // 정보수정 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('user_info_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));



                    $scope.item = {};

                    //console.log($scope.user_info);
                    $scope.item.USER_ID = $scope.user_info.USER_ID;
                    $scope.item.USER_NM = $scope.user_info.USER_NM;
                    $scope.item.NICK_NM = $scope.user_info.NICK_NM;
                    $scope.item.ADDR = $scope.user_info.ADDR;
                    $scope.item.ADDR_DETAIL = $scope.user_info.ADDR_DETAIL;
                    $scope.item.REG_DT = $scope.user_info.REG_DT;
                    $scope.item.REG_DT = $scope.user_info.REG_DT;
                    $scope.item.PHONE_1 = $scope.user_info.PHONE_1;
                    $scope.item.PHONE_2 = $scope.user_info.PHONE_2;
                    $scope.item.PREGNENT_FL = $scope.user_info.PREGNENT_FL;
                    $scope.item.BABY_BIRTH_DT = $scope.user_info.BABY_BIRTH_DT;

                    if($scope.item.PREGNENT_FL == 'Y'){
                        $scope.checked = "Y";
                    }else{
                        $scope.checked = "N";
                    }

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'CMS';

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
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){

            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        // 초기화
        $scope.init = function(session) {
//            if ($stateParams.menu == 'angeroom') {
            $scope.community = "샘플팩 신청";
//            }
            if($stateParams.id == 'season1'){
                $scope.season_gb = 'SAMPLE1';
            }else {
                $scope.season_gb = 'SAMPLE2';
            }

            $scope.checked = 'N';

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

                    $scope.item.TARGET_GB = target_gb;
                    $scope.item.NO = target_no;

                   $scope.item.USER_ID = $rootScope.user_info.USER_ID;
                   $scope.item.NICK_NM = $rootScope.user_info.NICK_NM;
                   $scope.item.ADDR = $rootScope.user_info.ADDR;
                   $scope.item.ADDR_DETAIL = $rootScope.user_info.ADDR_DETAIL;
                   $scope.item.REG_DT = $rootScope.user_info.REG_DT;
                   $scope.item.REG_DT = $rootScope.user_info.REG_DT;
                   $scope.item.PHONE_1 = $rootScope.user_info.PHONE_1;
                   $scope.item.PHONE_2 = $rootScope.user_info.PHONE_2;

                   var babyBirthDt = $rootScope.user_info.BABY_BIRTH_DT;

                   $scope.item.YEAR = babyBirthDt.substr(0,4);
                   $scope.item.MONTH = babyBirthDt.substr(4,2);
                   $scope.item.DAY = babyBirthDt.substr(6,2);

                   console.log($scope.item.YEAR);
                   console.log($scope.item.MONTH);
                   console.log($scope.item.DAY);

                })
                .catch(function(error){});
        };

        // 회원가입 화면 이동
        $scope.click_joinon = function (){
            $location.url('/join/signon');
        }

        // 샘플팩 신청
        $scope.click_saveSamplepackComp = function (){

            if($scope.checked == 'N'){
                dialogs.notify('알림', '신청 자격을 확인해주세요.', {size: 'md'});
                return;
            }

            $scope.search.REG_UID = $rootScope.uid;
            $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                .then(function(data){
                    var comp_cnt = data[0].COMP_CNT;

                    if(comp_cnt == 0){
                        $scope.insertItem('ange/comp', 'item', $scope.item, false)
                            .then(function(){

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

            $scope.search.TARGET_NO = $scope.item.NO;
            $scope.search.TARGET_GB = $scope.item.TARGET_GB;

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
