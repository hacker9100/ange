'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('dashboard', ['$scope', '$location', function ($scope, $location) {

        $scope.message = "ANGE CMS";

		$scope.pageTitle = "마이페이지";
		$scope.pageDescription = "홍길동 님의 대시보드입니다.";

        var views = [{name: "board1View"}, {name: "board2View"}, {name: "board3View"}];

        $scope.views = views;
	}]);
});
