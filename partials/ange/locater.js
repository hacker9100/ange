'use strict';

define([
    '../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('locater', ['$scope', '$stateParams', '$location', function ($scope, $stateParams, $location) {

/*
        var path = [
                        { url: '/webboard', title: '게시판', last: false},
                        { url: '/webboard/edit', title: '등록', last: false}
                    ];
*/

        var path = "/user/list";

        var nav = function(path) {
            var url = "";
            var items = new Array();
            var sp = path.split('/');

            for (var i = 1; i < sp.length; i++) {
//                alert(sp.splice(idx, sp.length));
                url += "/" + sp[i];
                var last = false;
                if (i + 1 == sp.length) last = true;
                items.push({url: url, title: sp[i], last: last });
            }

//            alert(JSON.stringify(items))

            return items;
        }

        $scope.items = nav(path);

        $scope.isActive = function(item) {
            if (item.last == true) {
                return true;
            }
            return false;
        };

	}]);
});
