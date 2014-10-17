/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : webboardEdit.html 화면 콘트롤러
 */
'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('webboardEdit', ['$scope', '$stateParams', 'webboardService', '$location', function ($scope, $stateParams, webboardService, $location) {

        // Date Picker
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
//        $scope.disabled = function(date, mode) {
//            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
//        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

//        var rand = ""+(Math.random() * 10000);
//        $scope.board.ckEditor = rand;

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });
//        $scope.ckeditor = '<p>Hello</p>\n';
//        $scope.board = { "BODY": '<p>Hello</p>\n' };

        // PL Upload
        $scope.percent = '';
        // A variable to store the overall percentage
        // of the file uploaded.

        $scope.files = [];
        // An empty array to store the files uploaded.

/*
        $scope.$watch('files', function() {
//            alert($scope.board[FILE]);
//            $scope.board.FILE = $scope.files;
        });
*/

		$scope.message = "ANGE CMS";

		$scope.pageTitle = "게시판 등록";
		$scope.pageDescription = "CMS 게시판 등록입니다.";

        $scope.saveBoard = function () {
            var id = ($stateParams.id) ? parseInt($stateParams.id) : 0;

            if (id <= 0) {
                $scope.board.FILES = $scope.files;

                webboardService.createBoard($scope.board).then(function(data){
                    alert(JSON.stringify(data));
                    $location.path('/webboard');
                });
            }
            else {
                webboardService.updateBoard(id, $scope.board).then(function(data){
                    $location.path('/webboard');
                });
            }
        };

        // callback for ng-click 'deleteContent':
        $scope.deleteBoard = function (boardNo) {
            webboardService.deleteBoard(boardNo).then(function(data){
                $location.path('/webboard');
            });
        };

        if ($stateParams.id != 0) {
            webboardService.getBoard($stateParams.id).then(function(board){
                $scope.board = board.data[0];
            });
        }
    }]);
});
