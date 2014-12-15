/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : projectEdit.html 화면 콘트롤러
 */
'use strict';

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('project_edit', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 썸네일을 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data !== 'undefined') {
                $scope.file = data[0];
            }
        });

        /********** 초기화 **********/
        // 프로젝트 모델
        $scope.item = {};
        // 시리즈 데이터
        $scope.series = [];

        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        // 초기화
        $scope.init = function(session) {
            var ret = $scope.getList('cms/series', 'list', {}, {}, false)
                .then(function(data){
                    $scope.series = data;

                    if ($stateParams.id == 0) {
                        var arr_series = [];

                        for (var i in $scope.series) {
                            var item = $scope.series[i];
                            if (item.SERIES_GB == $scope.TYPE) {
                                arr_series.push(item);
                            }
                        }

                        $scope.arr_series = arr_series;
                        $scope.item.SERIES = arr_series[0];
                    }
                })
                .catch(function(error){throw('시리즈:'+error);});

            for (var i = 2010; i < nowYear + 5; i++) {
                year.push(i+'');
            }

            $scope.years = year;
            $scope.item.YEAR = nowYear+'';

            return ret;
        }

        /********** 이벤트 **********/
        // 시리즈 유형 선택
        $scope.$watch('TYPE', function(data) {
            var arr_series = [];

            if (data != undefined) {
                for (var i in $scope.series) {
                    var item = $scope.series[i];
                    if (item.SERIES_GB == data) {
                        arr_series.push(item);
                    }
                }

                $scope.arr_series = arr_series;
                $scope.item.SERIES = arr_series[0];
            }

        });


        // 목록 버튼 클릭
        $scope.click_showProjectList = function () {
            $location.url('/project/list');
        };

        // 프로젝트 조회
        $scope.getProject = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('cms/project', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        $scope.TYPE = data.SERIES.SERIES_GB;

                        angular.forEach($scope.series,function(value, idx){
                            if(JSON.stringify(value) == JSON.stringify(data.SERIES)) {
                                $scope.item.SERIES = $scope.series[idx];
                                return;
                            }
                        });

                        var file = data.FILE;
                        for(var i in file) {
                            $scope.file = {"name":file.FILE_NM,"size":file[0].FILE_SIZE,"url":UPLOAD.BASE_URL+file[0].PATH+file[0].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+file[0].PATH+"thumbnail/"+file[0].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+file[0].PATH+"medium/"+file[0].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[0].FILE_NM,"deleteType":"DELETE"};
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.TYPE = 1;
            }
        };

        // 저장 버튼 클릭
        $scope.click_saveProject = function () {
//            $scope.item.FILE = $scope.queue;
            $scope.item.FILE = $scope.file;

            if ($stateParams.id == 0) {
                $scope.insertItem('cms/project', 'item', $scope.item, false)
                    .then(function(){$location.url('/project/list');})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('cms/project', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){$location.url('/project/list');})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getProject)
            .catch($scope.reportProblems);

    }]);
});
