/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : permission.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('permission', ['$scope', '$stateParams', 'dataService', '$location', function ($scope, $stateParams, dataService, $location) {

        /********** 초기화 **********/
        // 초기화
        $scope.initEdit = function() {
            dataService.db('permission').find({},{ROLE: true},function(data, status){
                if (status != 200) {
                    alert('권한 조회에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        alert(data.msg);
                    } else {
                        if (angular.isObject(data)) {
                            $scope.roles = data;
                            $scope.ROLE = data[0];
                        } else {
                            // TODO: 데이터가 없을 경우 처리
                            alert("권한 조회 데이터가 없습니다.");
                        }
                    }
                }
            });
        };

        /********** 이벤트 **********/
        $scope.$watch('ROLE', function(data) {
            $scope.getPermission();
        });

        // 권한 조회
        $scope.getPermission = function() {
            dataService.db('permission').findOne($scope.ROLE.ROLE_ID,{},function(data, status){
                if (status != 200) {
                    alert('권한 조회에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        alert(data.msg);
                    } else {
                        if (angular.isObject(data)) {
                            $scope.list = data;
                        } else {
                            // TODO: 데이터가 없을 경우 처리
                            alert("권한 조회 데이터가 없습니다.");
                        }
                    }
                }
            });
        }

        // 권한 저장 버튼 클릭
        $scope.click_savePermission = function() {
            dataService.db('permission').update($scope.ROLE.ROLE_ID, $scope.list,function(data, status){
                if (status != 200) {
                    alert('권한 수정에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        alert(data.msg);
                    } else {
                        alert("권한이 수정 되었습니다.");
                    }
                }
            });
        };

        /********** 화면 초기화 **********/
        // 페이지 타이틀
        $scope.$parent.message = 'ANGE CMS';
        $scope.$parent.pageTitle = '권한 관리';
        $scope.$parent.pageDescription = 'CMS 사용 권한을 관리합니다.';

        $scope.initEdit();

    }]);
});
