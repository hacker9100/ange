/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('task_list', ['$scope', '$stateParams', 'dataService', '$q', '$location', function ($scope, $stateParams, dataService, $q, $location) {

        /********** 초기화 **********/
        // 목록 데이터
        $scope.listData = [];
        // 검색 조건
        $scope.search = {};
        // 선택 카테고리
        $scope.CATEGORY = [];
        // 카테고리 데이터
        $scope.category = [];

        // 카테고리 선택 콤보박스 설정
        $scope.select_settings = {externalIdProp: '', idProp: 'NO', displayProp: 'CATEGORY_NM', dynamicTitle: false, showCheckAll: false, showUncheckAll: false};

        var menuSearch = {};

        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        // 초기화
        $scope.initList = function() {
            var deferred = $q.defer();

            $scope.oneAtATime = true;

            for (var i = nowYear - 5; i < nowYear + 5; i++) {
                year.push(i+'');
            }

            // 카테고리 목록 조회
            dataService.db('category').find({},{},function(data, status){
                if (status != 200) {
                    deferred.reject('카테고리 조회에 실패 했습니다.');
                } else {
                    if (angular.isObject(data)) {
                        if (!data.err) {

                            $scope.category = data;

                            var category_a = [];
                            var category_b = [];

                            for (var i in data) {
                                var item = data[i];

                                if (item.CATEGORY_GB == '1') {
                                    category_a.push(item);
                                } else if (item.CATEGORY_GB == '2' && item.PARENT_NO == '0') {
                                    category_b.push(item);
                                }
                            }

                            $scope.category_a = category_a;
                            $scope.category_b = category_b;

                            deferred.resolve();
                        } else {
                            deferred.reject(data);
                        }
                    } else {
                        // TODO: 데이터가 없을 경우 처리
                        deferred.reject("카테고리 데이터가 없습니다.");
                    }
                }
            });

            // 검색어
            var order = [{name: "기자", value: "EDITOR_NM"}, {name: "제목+내용", value: "SUBJECT"}];

            $scope.years = year;
            $scope.order = order;
            $scope.search.YEAR = nowYear+'';
            $scope.search.ORDER = order[0];

            deferred.promise;
        };

        /********** 이벤트 **********/
        // 카테고리 주제 대분류 선택
        $scope.$watch('CATEGORY_M', function(data) {
            var category_s = [];

            if (data != undefined) {
                for (var i in $scope.category) {
                    var item = $scope.category[i];

                    if (item.PARENT_NO == data.NO && item.CATEGORY_GB == '2' && item.PARENT_NO != '0') {

                        category_s.push(item);
                    }
                }
            }

            $scope.category_s = category_s;
        });

        // 추가된 카테고리 클릭
        $scope.click_removeCategory = function(idx) {
            $scope.CATEGORY.splice(idx, 1);
        }

        // 연도 변경 선택
        $scope.$watch('search.YEAR', function (data) {
            if (data != null) {
                dataService.db('project').find({},{YEAR: data},function(data, status){
                    if (status != 200) {
                        alert('조회에 실패 했습니다.');
                    } else {
                        if (angular.isObject(data)) {
                            if (data.err == true) {
                                alert(data.msg);
                            } else {
                                $scope.projects = data;
                            }
                        } else {
                            // TODO: 데이터가 없을 경우 처리
                            alert("조회 데이터가 없습니다.");
                        }
                    }
                });
            }
        });

        // 등록 버튼 클릭
        $scope.click_createNewTask = function () {
            $location.url('/task/0');
        };

        // 태스크 수정 화면 이동
        $scope.click_showEditTask = function (key) {
            $location.url('/task/'+key);
        };

        // 콘텐츠 수정 화면 이동
        $scope.click_showEditContent = function (key) {
            $location.url('/content/'+$stateParams.menu+'/'+key);
        };

        // 이력조회 버튼 클릭
        $scope.click_showGetHistory = function (key) {
            alert("준비중입니다.")
        };

        // 삭제 버튼 클릭
        $scope.click_deleteTask = function (idx) {

            var task = $scope.list[idx];

            if (task.PHASE == '30') {
                alert("완료 상태의 태스크는 삭제할 수 없습니다.");
                return;
            }

            dataService.db('task').remove(task.NO,function(data, status){
                if (status != 200) {
                    alert('프로젝트 목록 조회에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        alert(data.msg);
                    } else {
                        alert("삭제 되었습니다.");
                        // TODO: 삭제 후 처리.
                    }
                }
            });
        };

        $scope.list = [];
        $scope.pageNo = 0;
        $scope.pageSize = 4;
        $scope.perCnt = 0;
        $scope.perSize = 2;
        $scope.totalCnt = 0;

        // 검색 버튼 클릭
        $scope.click_searchTask = function() {
            $scope.list = [];
            $scope.listData = [];

            $scope.pageNo = 0;
            $scope.perCnt = 0;

            $scope.search.CATEGORY = $scope.CATEGORY;
            $scope.getTaskList($scope.search);
        };

        // 태스크 목록 조회
        $scope.getTaskList = function (search) {
            $scope.isLoading = true;

            dataService.db('task').find({NO:$scope.pageNo, SIZE:$scope.pageSize},search,function(data, status){
                if (status != 200) {
                    alert('태스크 목록 조회에 실패 했습니다.');
                } else {
                    if (angular.isObject(data)) {
                        if (data.err == true) {
                            alert(data.msg);
                        } else {
                            $scope.totalCnt = data[0].TOTAL_COUNT;
                            angular.forEach(data, function(model) {
                                $scope.listData.push(model);
                            });

                            if ($scope.list.length == 0) {
                                $scope.list = $scope.listData.slice($scope.perCnt, $scope.perSize);
                            }
                        }
                    } else {
                        // TODO: 데이터가 없을 경우 처리
                        alert("태스크 목록 데이터가 없습니다.");
                    }
                }

                $scope.isLoading = false;
            });
        };

        $scope.$watch('perCnt', function() {
            if ( $scope.perCnt >= $scope.list.length) {
                angular.forEach($scope.listData.slice($scope.perCnt, $scope.perCnt + $scope.perSize), function(model) {
                    $scope.list.push(model);
                });
            }
        });

        $scope.addTask = function () {
            $scope.perCnt += $scope.perSize;

            if ($scope.perCnt >= $scope.totalCnt) return;

            if ($scope.perCnt + $scope.perSize >= $scope.listData.length) {
                $scope.pageNo++;
                $scope.getTaskList();
            }
        };

        /********** 화면 초기화 **********/
        var initSearch = {};

        // 페이지 타이틀
        if ($stateParams.menu == 'article') {
            $scope.$parent.pageTitle = '원고 관리';
            $scope.$parent.pageDescription = '태스크 내용을 확인하여 원고를 작성하고 관리합니다.';
            $scope.$parent.tailDescription = '.';

            $scope.isTask = true;
            initSearch = {PHASE: '0, 10, 11, 12'};
        } else if ($stateParams.menu == "article_confirm") {
            $scope.$parent.pageTitle = '원고 승인';
            $scope.$parent.pageDescription = '태스크 내용을 확인하여 원고를 작성하고 관리합니다.';
            $scope.$parent.tailDescription = '.';

            $scope.isTask = true;
            initSearch = {PHASE: '11, 12'};
        } else {
            $scope.$parent.message = 'ANGE CMS';
            $scope.$parent.pageTitle = '태스크 관리';
            $scope.$parent.pageDescription = '기사주제 설정하고 할당하여 관리합니다.';
            $scope.$parent.tailDescription = '.';

            $scope.isTask = false;
            $scope.search = {};
        }

        $scope.initList();
        $scope.getTaskList(initSearch);

    }]);
});
