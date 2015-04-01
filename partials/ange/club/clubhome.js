/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-30
 * Description : clubhome.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('clubhome', ['$rootScope', '$scope', '$window', '$location', 'dialogs', 'CONSTANT', function ($rootScope, $scope, $window, $location, dialogs, CONSTANT) {

        console.log($rootScope.role);
        console.log($rootScope.user_gb);

//        if($rootScope.role != 'ANGE_ADMIN'){
//            dialogs.notify('알림', '앙쥬클럽 회원만 사용가능 합니다.', {size: 'md'});
//            $location.url('/main');
//        }
//
//        if($rootScope.user_gb != 'CLUB' || $rootScope.role != 'ANGE_ADMIN'){
//            dialogs.notify('알림', '앙쥬클럽 회원만 사용가능 합니다.', {size: 'md'});
//            $location.url('/main');
//        }

//        if($rootScope.role != 'ANGE_ADMIN' ){ //|| $rootScope.user_gb != 'CLUB'
//            dialogs.notify('알림', '앙쥬클럽 회원만 사용가능 합니다.', {size: 'md'});
//            return;
//        }


        $scope.search = {};

        $scope.selectIdx = 1;

        $scope.selectSubIdx = 1;
        //$scope.selectBoard = 'board';
        $scope.selectBoard = '';

        var condition = [{name: "제목+내용", value: "SUBJECT+BODY"}, {name: "작성자", value: "NICK_NM"}, {name: "말머리", value: "HEAD"}];
        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

//        $(document).ready( function() {
//            $("#click_board").on("click", function() {
//                $("#load_board").load("/partials/ange/club/clubboard-list.html");
//            });
//
//            $("#click_clinic").on("click", function() {
//                $("#load_clinic").load("/partials/ange/club/clubclinic-list.html");
//            });
//        });

        /********** 초기화 **********/

        $scope.init = function () {
            var getParam = function(key){
                var _parammap = {};
                document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
                    function decode(s) {
                        return decodeURIComponent(s.split("+").join(" "));
                    }

                    _parammap[decode(arguments[1])] = decode(arguments[2]);
                });

                return _parammap[key];
            };

            console.log('getParam("tab") = '+getParam("tab"));

            if(getParam("tab") == undefined){
                $scope.selectIdx = 1;
            }else{
                $scope.selectIdx = getParam("tab");
                $scope.selectBoard = getParam("type");

                if(getParam("page_no") != undefined){
                    $scope.PAGE_NO = 1
                }else{
                    $scope.PAGE_NO = getParam("page_no")
                }
                if(getParam("condition") != undefined){
                    $scope.search.CONDITION.value = getParam("condition");
                }
                $scope.search.KEYWORD = getParam("keyword");
            }

        };

        /********** 이벤트 **********/
        $scope.click_selectTab = function (idx){
            $scope.selectIdx = idx;

            if (idx == 1){
                $scope.selectSubIdx = 1;
            } else if (idx == 2) {
                $scope.selectSubIdx = 5;
            } else {
                $scope.selectSubIdx = 7;
            }
        }

        /********** 이벤트 **********/
        $scope.click_selectSubTab = function (idx){
            $scope.selectSubIdx = idx;
        }

        $scope.click_board = function(board_gb){
            $scope.selectBoard = board_gb;

        }


        // 하단 배너 이미지 조회
        $scope.getBanner1 = function () {
            $scope.search = {};
            $scope.search.ADP_IDX = CONSTANT.AD_CODE_BN57;
            $scope.search.ADA_STATE = 1;
            $scope.search.ADA_TYPE = 'banner';
            $scope.search.MENU = $scope.path[1];
            $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);

            $scope.getList('ad/banner', 'list', {NO:0, SIZE:1}, $scope.search, false)
                .then(function(data){
                    $scope.banner1 = data[0];
                    $scope.banner1.img = CONSTANT.AD_FILE_URL + data[0].ada_preview;
                })
                ['catch'](function(error){});
        };

        $scope.getBanner1();

        // 하단 배너 이미지 조회
        $scope.getBanner2 = function () {
            $scope.search = {};
            $scope.search.ADP_IDX = CONSTANT.AD_CODE_BN57;
            $scope.search.ADA_STATE = 1;
            $scope.search.ADA_TYPE = 'banner';
            $scope.search.MENU = $scope.path[1];
            $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);

            $scope.getList('ad/banner', 'list', {NO:0, SIZE:1}, $scope.search, false)
                .then(function(data){
                    $scope.banner2 = data[0];
                    $scope.banner2.img = CONSTANT.AD_FILE_URL + data[0].ada_preview;
                })
                ['catch'](function(error){});
        };

        $scope.getBanner2();

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            ['catch']($scope.reportProblems);

	}]);
});
