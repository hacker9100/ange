'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('dashboard', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {

        $scope.message = "ANGE CMS";

		$scope.pageTitle = "대시보드";
		$scope.pageDescription = $rootScope.uid + "님의 대시보드입니다.";

        var views = [{name: "board1View"}, {name: "board2View"}, {name: "board3View"}];

        $scope.views = views;
	}]);
});
