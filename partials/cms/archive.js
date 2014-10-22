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
    controllers.controller('archive', ['$scope', function ($scope) {

        // 페이지 타이틀
        $scope.message = 'ANGE CMS';

        $scope.pageTitle = 'Archive';
        $scope.pageDescription = '지난 기사자료를 조회할 수 있습니다.';
        $scope.tailDescription = '검색영역에서 원하는 기사를 찾을 수 있습니다.<br />제목을 클릭하면 자세한 내용을 조회할 수 있습니다.';

    }]);
});
