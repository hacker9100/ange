/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : series.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('series', ['$scope', '$stateParams', 'dataService', '$location', function ($scope, $stateParams, dataService, $location) {

        /********** 초기화 **********/
        $scope.key = '';

        // 초기화
        $scope.init = function() {

        };

        /********** 이벤트 **********/
        // 시리즈 삭제 버튼 클릭
        $scope.click_deleteSeries = function (idx) {
            var series = $scope.list[idx];

            dataService.db('series').remove(series.NO,function(data, status){
                if (status != 200) {
                    alert('삭제에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        alert(data.msg);
                    } else {
                        $scope.list.splice(idx, 1);
                    }
                }
            });
        };

        // 검색 버튼 클릭
        $scope.click_searchSeries = function () {
            $scope.getSeriesList($scope.search);
        }

        // 시리즈 목록 조회
        $scope.getSeriesList = function (search) {
            $scope.isLoading = true;
            dataService.db('series').find({},search,function(data, status){
                if (status != 200) {
                    alert('시리즈 조회에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        alert(data.msg);
                    } else {
                        if (angular.isObject(data)) {
                            $scope.list = data;
                        } else {
                            // TODO: 데이터가 없을 경우 처리
                            alert("시리즈 조회 데이터가 없습니다.");
                        }
                    }
                }

                $scope.isLoading = false;
            });
        };

        // 시리즈 저장 버튼 클릭
        $scope.click_saveSeries = function () {
            if ($scope.key == '') {
                dataService.db('series').insert($scope.item,function(data, status){
                    if (status != 200) {
                        alert('등록에 실패 했습니다.');
                    } else {
                        if (data.err == true) {
                            alert(data.msg);
                        } else {
                            $scope.getSeriesList();
                        }
                    }
                });
            } else {
                dataService.db('series').update($scope.key,$scope.item,function(data, status){
                    if (status != 200) {
                        alert('수정에 실패 했습니다.');
                    } else {
                        if (data.err == true) {
                            alert(data.msg);
                        } else {
                            $scope.getSeriesList();
                        }
                    }
                });
            }

            $scope.key = '';
        };

        // 시리즈 편집 클릭
        $scope.click_getSeries = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                dataService.db('series').findOne($scope.key,{},function(data, status){
                    if (status != 200) {
                        alert('시리즈 조회에 실패 했습니다.');
                    } else {
                        if (data.err == true) {
                            alert(data.msg);
                        } else {
                            if (angular.isObject(data)) {
                                $scope.item = data;
                            } else {
                                // TODO: 데이터가 없을 경우 처리
                                alert("시리즈 조회 데이터가 없습니다.");
                            }
                        }
                    }
                });
            }
        };

        // 시리즈 상태변경 버튼 클릭
        $scope.click_updateStatus = function (idx) {
            var series = $scope.list[idx];
            series.SERIES_ST = (series.SERIES_ST == "1" ? "0" : "1");

            dataService.db('series').update(series.NO,series,function(data, status){
                if (status != 200) {
                    alert('수정에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        alert(data.msg);
                    } else {
                        $scope.getSeriesList();
                    }
                }
            });
        };

        // 취소 클릭
        $scope.click_cancel = function () {
            $scope.key = '';
            $scope.item = null;
        };

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getSeriesList();

    }]);
});
