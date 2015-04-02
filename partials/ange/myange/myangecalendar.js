/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : myangecalendar.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('myangecalendar', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {
			
            $scope.community = "캘린더";
			$scope.monthtable = "<b>Hi</b>";
			
			$scope.data = 	{ 
								"1":{ "day":"1","event":"" },
								"2":{ "day":"1","event":"" },
								"3":{ "day":"1","event":"" },
								"4":{ "day":"1","event":"" },
								"5":{ "day":"1","event":"" },
								"6":{ "day":"1","event":"" },
								"7":{ "day":"1","event":"" },
								"8":{ "day":"1","event":"" },
								"9":{ "day":"1","event":"" },
								"10":{ "day":"1","event":"" },
								"11":{ "day":"1","event":"" },
								"12":{ "day":"1","event":"" },
								"13":{ "day":"2","event":"" } 
							}
							
			
			$scope.getEventList();
        };
		
		
		// 일반 게시판 목록 조회
        $scope.getEventList = function () {

            //$scope.search.BOARD_GB = 'BOARD';

            $scope.getList('ange/calendar', 'list', {USER_ID: "test004", YEAR: "2015", MONTH:"3" }, $scope.search, true)
                .then(function(data){
					
                    $scope.data = data;

                })
                ['catch'](function(error){
					alert('error');
				});
        };


        $scope.init();

    }]);
});
