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
    controllers.controller('scheduler', ['$scope', function ($scope) {

        // 페이지 타이틀
        $scope.message = 'ANGE CMS';

        $scope.pageTitle = '스케쥴';
        $scope.pageDescription = '업무일정을 공유합니다.';
        $scope.tailDescription = '일정을 입력한 후 \"등록\"버튼을 누르면 등록이 완료됩니다.<br/>\"취소\"버튼을 누르면 원래대로 돌아갑니다.';

    }]);
});
