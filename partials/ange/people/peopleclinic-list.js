/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : peopleclinic-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peopleclinic-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams) {

        $scope.tmpMenu = $stateParams.menu;
        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

        $scope.search = {};

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT"} , {name: "등록자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            $scope.VIEW_ROLE = 'CLINIC';
            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'CLINIC';
            $scope.search.SYSTEM_GB = 'ANGE';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                .catch(function(error){});

        };

        /********** 이벤트 **********/
        // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('people/clinic/view/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        /********** 화면 초기화 **********/
        //$scope.init();

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

//            if ($stateParams.menu == 'childdevelop') {
//                $scope.search['COMM_NO'] = '9';
//            } else if($stateParams.menu == 'chlidoriental') {
//                $scope.search['COMM_NO'] = '10';
//            } else if($stateParams.menu == 'obstetrics') {
//                $scope.search['COMM_NO'] = '11';
//            } else if($stateParams.menu == 'momshealth') {
//                $scope.search['COMM_NO'] = '12';
//            } else if($stateParams.menu == 'financial') {
//                $scope.search['COMM_NO'] = '13';
//            }

            $scope.search.SORT = 'BOARD_NO';
            $scope.search.ORDER = 'DESC'

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO- 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 조회 화면 이동(비밀글)
        $scope.click_showViewPeopleBoard = function (key, regid, password_fl) {

            console.log(regid);
            console.log($scope.role);

            if(password_fl != 0 && $scope.uid == regid){
                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);

//                if ($stateParams.menu == 'childdevelop') {
//                    $location.url('/people/childdevelop/view/'+key);
//                } else if($stateParams.menu == 'chlidoriental') {
//                    $location.url('/people/chlidoriental/view/'+key);
//                } else if($stateParams.menu == 'obstetrics') {
//                    $location.url('/people/obstetrics/view/'+key);
//                } else if($stateParams.menu == 'momshealth') {
//                    $location.url('/people/momshealth/view/'+key);
//                } else if($stateParams.menu == 'financial') {
//                    $location.url('/people/financial/view/'+key);
//                }
            }else if($scope.role == $scope.VIEW_ROLE){
                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);

//                if ($stateParams.menu == 'childdevelop') {
//                    $location.url('/people/childdevelop/view/'+key);
//                } else if($stateParams.menu == 'chlidoriental') {
//                    $location.url('/people/chlidoriental/view/'+key);
//                } else if($stateParams.menu == 'obstetrics') {
//                    $location.url('/people/obstetrics/view/'+key);
//                } else if($stateParams.menu == 'momshealth') {
//                    $location.url('/people/momshealth/view/'+key);
//                } else if($stateParams.menu == 'financial') {
//                    $location.url('/people/financial/view/'+key);
//                }
            }
            else{
                dialogs.notify('알림', '비밀글입니다. 작성자와 해당게시판 상담가만 볼 수 있습니다.', {size: 'md'});
            }

        };

        $scope.click_showViewPeopleBoard2 = function (key) {

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);

//            if ($stateParams.menu == 'childdevelop') {
//                $location.url('/people/childdevelop/view/'+key);
//            } else if($stateParams.menu == 'chlidoriental') {
//                $location.url('/people/chlidoriental/view/'+key);
//            } else if($stateParams.menu == 'obstetrics') {
//                $location.url('/people/obstetrics/view/'+key);
//            } else if($stateParams.menu == 'momshealth') {
//                $location.url('/people/momshealth/view/'+key);
//            } else if($stateParams.menu == 'financial') {
//                $location.url('/people/financial/view/'+key);
//            }
        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleClinic = function () {

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');

//            if ($stateParams.menu == 'childdevelop') {
//                $location.url('/people/childdevelop/edit/0');
//            } else if($stateParams.menu == 'chlidoriental') {
//                $location.url('/people/chlidoriental/edit/0');
//            } else if($stateParams.menu == 'obstetrics') {
//                $location.url('/people/obstetrics/edit/0');
//            } else if($stateParams.menu == 'momshealth') {
//                $location.url('/people/momshealth/edit/0');
//            } else if($stateParams.menu == 'financial') {
//                $location.url('/people/financial/edit/0');
//            }
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.getPeopleBoardList();
        }

        $scope.init();
        $scope.getPeopleBoardList();

    }]);
});
