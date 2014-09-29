/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-25
 * Description : $stateProvider에 각 메뉴별로 url과 해당 화면 정보, 콘트롤을 정의 한다.
 */

define([], function() {
    var json = '';

    jQuery.ajax({
        url: "js/menu.json",
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (response) {
            alert("1"+JSON.stringify(response))
            json = response;
            console.log("success");
        },
        error: function (response) {
            var text = response.responseText;
            var data = eval("states = (" + text + ")");
            console.log("failed");

            json = data;
        }
    });

    return json;
});