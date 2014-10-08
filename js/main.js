/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : requireJS를 사용할 때 최초로 호출되는 파일로 requireJS의 설정을 한다.
 */

/**
 * require 설정
 * RequireJS는 AMD API 명세를 구현한 구현체 중 하나이다. 여기에 조금 더 편리하게 사용할 수 있도록 몇 가지 기능들을 추가했다.
 * RequireJS의 자세한 사용법은 http://requirejs.org/docs/api.html#usage를 참고한다.
 */
require.config({
    // require.js가 로딩되면 이 객체를 자동으로 읽어 들여 반영한다.
    // baseUrl은 JavaScript 파일들이 존재하는 base 위치를 지정한다.
    baseUrl:'js',

    // paths는 baseUrl에서 지정한 경로에 존재하지 않는 모듈을 찾기위해서 경로를 매핑해준다.
    // 보통 맨뒤 js확장자는 별도롤 붙이지 않으며, 맨 뒤에 js를 붙이지 않아도 자동으로 js를 붙여서 찾아준다.
    // 라이브러리 경로 선언을 위해서도 사용된다.
    paths: {
        'text': '../lib/require/text', //HTML 데이터를 가져올때 text! 프리픽스를 붙여준다.
        'jquery': '../lib/jquery/jquery.min', // jquery를 사용한다.
        'jquery-ui': '../lib/jquery/jquery-ui-1.10.2.min', // bootstrap 사용을 위해 로딩한다.
        'domReady': '../lib/domReady/domReady', // requirejs로 library를 로딩할때 사용된다.
        'angular': '../lib/angular/angular', // angularjs를 사용한다.

        'ngBootstrap': '../lib/bootstrap/js/bootstrap.min', // bootstrap을 사용한다.
        'uiBootstrap': '../lib/ui-bootstrap/ui-bootstrap-0.11.2.min', // bootstrap의 ui 컴포넌트를 사용하게한다.

        'ngResource': '../lib/angular/angular-resource.min', // restful방식으로 http 통신을 통한 서비스를 한다.
        'uiRouter': '../lib/angular-ui/angular-ui-router.min', // index에서 url 라우팅을 동적으로 해준다.

        'ckeditor-core': '../lib/ckeditor/ckeditor',
        'ckeditor-jquery': '../lib/ckeditor/adapters/jquery',
        'plupload': '../lib/plupload/plupload.full.min',
//        'ngPlupload': '../lib/plupload/plupload-angular-directive',
        'uiPlupload': '../lib/plupload/jquery.ui.plupload/jquery.ui.plupload',
        'ngActivityIndicator': '../lib/ngActivityIndicator/ngActivityIndicator',

//        'ngMock': '../lib/angular/angular-mocks',

        'library': '../lib'
    },

    // shim은 AMD를 지원하지 않는 외부 라이브러리를 모듈로 사용할 수 있게 한다.
    // AMD : JavaScript 표준 API 라이브러리 제작 그룹에는 CommonJS만 있는 것이 아니고, AMD(Asynchronous Module Definition)라는 그룹도 있다.
    // AMD 그룹은 비동기 상황에서도 JavaScript 모듈을 쓰기 위해 CommonJS에서 함께 논의하다 합의점을 이루지 못하고 독립한 그룹이다.
    shim: {
        'jquery': {
            exports: '$'
        },
        'angular': {
            deps: ['jquery'],    // 반드시 먼저 로딩해야될 모듈을 정의한다.
            exports: 'angular'   // 반환되는 변수값이다. angular는 전역변수 "angular"를 사용한다.
        },
        'jquery-ui': {
            deps: ['jquery']
        },
        'ngBootstrap':{
            deps:['jquery','angular']//,
//            exports: "$.fn.popover"
        },
        'uiBootstrap':{
            deps:['jquery','angular','ngBootstrap']//,
//            exports: "$.fn.popover"
        },
        'ngResource':{
            deps: ['angular']
        },
        'uiRouter':{
            deps: ['angular']
        },
        'ckeditor-jquery':{
            deps:['jquery','ckeditor-core']
        },
        'plupload':{
            deps:['jquery','jquery-ui'],
            exports: "plupload"
        },
        'uiPlupload':{
            deps:['plupload']
        },
        'ngActivityIndicator':{
            deps:['angular']
        }
//        'ngMock':{
//            deps: ['angular']
//        }
    },

    // 부트스트랩 방법1
    // bootstrap.js 파일을 로드한다.
    deps: [
        './bootstrap'
    ]
});
