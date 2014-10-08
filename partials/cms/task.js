'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('task', ['$scope', '$location', function ($scope, $location) {
	
		$scope.message = "ANGE CMS";

		$scope.pageTitle = "태스크 관리";
		$scope.pageDescription = "기사주제 설정하고 할당하여 관리합니다.";

    }]);
});
