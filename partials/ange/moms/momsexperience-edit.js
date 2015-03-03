/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : momsexperience-edit.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsexperience-edit', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {


        $(document).ready(function(){

            $("#check_pregfl").click(function(){
                if(!$("#check_pregfl").is(":checked")){
                    $scope.item.PREG_FL = "true";
                }else{
                    $scope.item.PREG_FL = "false";
                }
            });

        });

        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'experienceprocess') {
                $scope.community = "진행중인 체험단";
            } else if ($stateParams.menu == 'experiencepast') {
                $scope.community = "지난 체험단";
            }
        };

        $scope.click_savePeopleClinic = function () {
            $scope.item.SYSTEM_GB = 'ANGE';


            if($("#check_pregfl").is(":checked")){
                $scope.item.PREG_FL = "true";
            }else{
                $scope.item.PREG_FL = "false"
            }

                $scope.insertItem('ange/comp', 'item', $scope.item, false)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                        $location.url('/moms/experienceprocess/list');
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

        };
        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
/*        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCmsBoard)
            ['catch']($scope.reportProblems);*/
        $scope.init();

    }]);
});
