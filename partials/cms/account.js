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
    controllers.controller('account', ['$scope', function ($scope) {

        // 페이지 타이틀
        $scope.message = 'ANGE CMS';

        $scope.pageTitle = '개인정보';
        $scope.pageDescription = '개인정보를 조회하고 수정할 수 있습니다.';
        $scope.tailDescription = '내용을 수정한 후 \"수정\"버튼을 누르면 수정이 완료됩니다.<br/>\"취소\"버튼을 누르면 원래대로 돌아갑니다.';

    }]);
});
