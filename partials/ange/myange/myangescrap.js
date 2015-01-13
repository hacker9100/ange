/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : myangescrap.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('myangescrap', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        $scope.search = {};
        // 초기화
        $scope.init = function() {
            $scope.community = "스크랩";
        };

        $scope.PAGE_SIZE = 20;
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

        /********** 이벤트 **********/
        $scope.getScarpList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/

            $scope.getList('com/scrap', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 조회 화면 이동
        $scope.click_showViewScrap = function (key) {

            if ($stateParams.menu == 'angeroom') {
                $location.url('/people/angeroom/view/'+key);
            } else if($stateParams.menu == 'momstalk') {
                $location.url('/people/momstalk/view/'+key);
            } else if($stateParams.menu == 'babycare') {
                $location.url('/people/babycare/view/'+key);
            } else if($stateParams.menu == 'firstbirthtalk') {
                $location.url('/people/firstbirthtalk/view/'+key);
            } else if($stateParams.menu == 'booktalk') {
                $location.url('/people/booktalk/view/'+key);
            }

        };

        // 검색
        $scope.click_searchScrap = function(){
            $scope.getScarpList();
        }

        // 상세조회 버튼 클릭
        $scope.click_showViewScrap = function (comm_no, key) {
            //$scope.openViewScrapModal({NO : key}, 'lg');

            if (comm_no == 1) {
                $location.url('/people/angeroom/view/'+key);
            } else if(comm_no == 2) {
                $location.url('/people/momstalk/view/'+key);
            } else if(comm_no == 3) {
                $location.url('/people/babycare/view/'+key);
            } else if(comm_no == 4) {
                $location.url('/people/firstbirthtalk/view/'+key);
            } else if(comm_no == 5) {
                $location.url('/people/booktalk/view/'+key);
            }
        };


        /*$scope.openViewScrapModal = function (item, size) {
            var dlg = dialogs.create('myangescrap_view.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                   *//* $scope.getItem('com/webboard', 'item', item, {}, false)
                        .then(function(data){
                            $scope.item = data;
                            var files = data.FILES;
                            for(var i in files) {
                                $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                            }

                            //$scope.search.TARGET_NO = $stateParams.id;
                        })
                        .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});


                    $scope.item = data;*//*
                    *//********** 공통 controller 호출 **********//*
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.getItem('com/webboard', 'item', item.NO, {}, false)
                        .then(function(data){
                            $scope.item = data;
                            var files = data.FILES;
                            for(var i in files) {
                                $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                            }

                            //$scope.search.TARGET_NO = $stateParams.id;
                        })
                        .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };*/
        /********** 화면 초기화 **********/
/*        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCmsBoard)
            .catch($scope.reportProblems);*/
        $scope.getSession()
            .then($scope.sessionCheck)
            .catch($scope.reportProblems);
        $scope.init();
        $scope.getScarpList();

    }]);
});
