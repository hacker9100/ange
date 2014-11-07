/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : projectEdit.html 화면 콘트롤러
 */
'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('project_edit', ['$scope', '$rootScope', '$stateParams', '$q', 'dataService', '$location', function ($scope, $rootScope, $stateParams, $q, dataService, $location) {

        var uploadUrl = 'http://localhost/serverscript/upload/../../upload/files/';

        /* 파일 업로드 설정 */
        var url = '/serverscript/upload/';
        $scope.options = { url: url, autoUpload: true, dropZone: angular.element('#dropzone') };

//        $scope.file = {"name":"Koala.jpg","size":595284,"url":"http://localhost/app/serverscript/upload/../../upload/files/Koala.jpg","thumbnailUrl":"http://localhost/app/serverscript/upload/../../upload/files/thumbnail/Koala.jpg","deleteUrl":"http://localhost/app/serverscript/upload/?file=Koala.jpg","deleteType":"DELETE"};

        // 파일 업로드 후 파일 정보가 변경되면 화면에 썸네일을 로딩
        $scope.$watch('newFile', function(data){
            $scope.file = data[0];
        });

        /********** 초기화 **********/
        // 프로젝트 모델
        $scope.item = {};

        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        // 초기화
        $scope.initEdit = function() {
            var deferred = $q.defer();

            dataService.db('series').find({},{},function(data, status){
                if (status != 200) {
                    deferred.reject('시리즈 조회에 실패 했습니다.');
                } else {
                    if (angular.isObject(data)) {
                        if (!data.err) {
                            $scope.series = data;
                            $scope.item.SERIES = data[0];

                            deferred.resolve();
                        } else {
                            deferred.reject(data.msg);
                        }
                    } else {
                        // TODO: 데이터가 없을 경우 처리
                        alert("시리즈 조회 데이터가 없습니다.");
                    }
                }
            });

            for (var i = 2010; i < nowYear + 5; i++) {
                year.push(i+'');
            }

            $scope.years = year;
            $scope.item.YEAR = nowYear+'';

            return deferred.promise;
        }

        /********** 이벤트 **********/
        // 목록 버튼 클릭
        $scope.click_showProjectList = function () {
            $location.url('/project');
        };

        // 프로젝트 조회
        $scope.getProject = function () {
            var deferred = $q.defer();

            if ($stateParams.id != 0) {
                dataService.db('project').findOne($stateParams.id,{},function(data, status){
                    if (status != 200) {
                        deferred.reject('프로젝트 조회에 실패 했습니다.');
                    } else {
                        if (angular.isObject(data)) {
                            if (!data.err) {
                                $scope.item = data;

                                angular.forEach($scope.series,function(value, idx){
                                    if(JSON.stringify(value) == JSON.stringify(data.SERIES));
                                    $scope.item.SERIES = $scope.series[idx];
                                    return;
                                });

                                // 파일 순서 : 1. 원본, 2. 썸네일, 3. 중간사이즈
                                var file = data.FILE;
                                if (file.length > 0) {
                                    $scope.file = {"name":file[0].FILE_NM,"size":file[0].FILE_SIZE,"url":uploadUrl+file[0].FILE_NM,"thumbnailUrl":uploadUrl+"thumbnail/"+file[0].FILE_NM,"mediumUrl":uploadUrl+"medium/"+file[0].FILE_NM,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[0].FILE_NM,"deleteType":"DELETE"};
                                }

                                deferred.resolve();
                            } else {
                                deferred.reject(data.msg);
                            }
                        } else {
                             // TODO: 데이터가 없을 경우 처리
                            alert("조회 데이터가 없습니다.");
                        }
                    }
                });
            }

            return deferred.promise;
        };

        // 저장 버튼 클릭
        $scope.click_saveProject = function () {
            $scope.item.FILE = $scope.file;

            if ($stateParams.id == 0) {
                dataService.db('project').insert($scope.item,function(data, status){
                    if (status != 200) {
                        alert('등록에 실패 했습니다.');
                    } else {
                        if (!data.err) {
                            $location.url('/project');
                        } else {
                            alert(data.msg);
                        }
                    }
                });
            } else {
                dataService.db('project').update($stateParams.id,$scope.item,function(data, status){
                    if (status != 200) {
                        alert('수정에 실패 했습니다.');
                    } else {
                        if (!data.err) {
                            $location.url('/project');
                        } else {
                            alert(data.msg);
                        }
                    }
                });
            }
        };

        /********** 화면 초기화 **********/
        // 페이지 타이틀
        $scope.$parent.message = 'ANGE CMS';
        if ( $stateParams.id != 0) {
            $scope.$parent.pageTitle = '프로젝트 수정';
            $scope.$parent.pageDescription = '프로젝트를 수정합니다.';
        } else {
            $scope.$parent.pageTitle = '프로젝트 등록';
            $scope.$parent.pageDescription = '프로젝트를 등록합니다.';
        }

        $scope.initEdit()
            .then($scope.getProject)
            .catch($scope.$parent.reportProblems);

    }]);
});
