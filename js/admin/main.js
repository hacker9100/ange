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
    baseUrl:'/js/admin',
    urlArgs: "bust=" +  (new Date()).getTime(),

    // paths는 baseUrl에서 지정한 경로에 존재하지 않는 모듈을 찾기위해서 경로를 매핑해준다.
    // 보통 맨뒤 js확장자는 별도롤 붙이지 않으며, 맨 뒤에 js를 붙이지 않아도 자동으로 js를 붙여서 찾아준다.
    // 라이브러리 경로 선언을 위해서도 사용된다.
    paths: {
        'text': '../../lib/require/text', //HTML 데이터를 가져올때 text! 프리픽스를 붙여준다.
        'jquery': '../../lib/jquery/jquery.min', // jquery
        'jquery-ui': '../../lib/jquery/jquery-ui-1.10.2.min', // bootstrap 사용을 위해 로딩한다.
        'domReady': '../../lib/domReady/domReady', // requirejs로 library를 로딩할때 사용된다.

        // bootstrpa 모듈
        'js-bootstrap': '../../lib/bootstrap/js/bootstrap.min', // bootstrap을 사용한다.
        'ui-bootstrap': '../../lib/ui-bootstrap/ui-bootstrap-0.11.2', // bootstrap의 ui 컴포넌트를 사용하게한다.(Customizing)

        // angularjs 모듈
        'angular': '../../lib/angular-1.2.1/angular', // angularjs를 사용한다.
        'angular-resource': '../../lib/angular-1.2.1/angular-resource', // restful방식으로 http 통신을 통한 서비스를 한다.
        'angular-sanitize': '../../lib/angular-1.2.1/angular-sanitize', // html 코드를 화면에서 html로 동적으로 변환 시켜준다.
        'angular-ui-router': '../../lib/angular-ui/angular-ui-router.min', // index에서 url 라우팅을 동적으로 해준다.
        'angular-translate': '../../lib/angular/angular-translate.min', //
        'i18n': '../../lib/angular-1.2.1/i18n/angular-locale_ko-kr', //
//        'ngCookies': '../../lib/angular/angular-cookies.min', //

        'lodash' : '../../lib/dropdown-multiselect/lodash',

        // ng-table 모듈
        'ng-table': '../../lib/ng-table/ng-table',

        // modal 모듈
        'dialog-translation': '../../lib/dialog/dialogs-default-translations.min',
        'dialog': '../../lib/dialog/dialogs',

        // ckeditor 모듈
        'ckeditor-core': '../../lib/ckeditor/ckeditor', // ckeditor
        'ckeditor-jquery': '../../lib/ckeditor/adapters/jquery', // angularjs에서 ckeditor를 사용할 수 있게 해주는 어덥터다.
        'ckfinder': '../../lib/ckfinder/ckfinder', // ckeditor에서 업로드를 할 수 있게 해준다.

        // fileupload 모듈
        'ui-widget': '../../lib/file-upload/vendor/jquery.ui.widget',
        'load-image': '../../lib/file-upload/load-image/load-image',
        'load-image-ios': '../../lib/file-upload/load-image/load-image-ios',
        'load-image-orientation': '../../lib/file-upload/load-image/load-image-orientation',
        'load-image-meta': '../../lib/file-upload/load-image/load-image-meta',
        'load-image-exif': '../../lib/file-upload/load-image/load-image-exif',
        'load-image-exif-map': '../../lib/file-upload/load-image/load-image-exif-map',
        'canvas-to-blob': '../../lib/file-upload/gallery/canvas-to-blob.min',
        'blueimp-helper': '../../lib/file-upload/gallery/blueimp-helper',
        'blueimp-gallery': '../../lib/file-upload/gallery/blueimp-gallery',
        'jquery-blueimp-gallery': '../../lib/file-upload/gallery/jquery.blueimp-gallery',
        'iframe-transport': '../../lib/file-upload/jquery.iframe-transport',
        'fileupload': '../../lib/file-upload/jquery.fileupload',
        'fileupload-process': '../../lib/file-upload/jquery.fileupload-process',
        'fileupload-image': '../../lib/file-upload/jquery.fileupload-image',
        'fileupload-audio': '../../lib/file-upload/jquery.fileupload-audio',
        'fileupload-video': '../../lib/file-upload/jquery.fileupload-video',
        'fileupload-validate': '../../lib/file-upload/jquery.fileupload-validate',
        'fileupload-angular': '../../lib/file-upload/jquery.fileupload-angular',

        // fullcalendar 모듈
        'fullcalendar': '../../lib/fullcalendar/fullcalendar',
        'ko': '../../lib/fullcalendar/lang/ko',
        'uiCalendar': '../../lib/fullcalendar/calendar',
        'moment': '../../lib/fullcalendar/lib/moment.min',

        'library': '../../lib'
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
        'js-bootstrap':{
            deps:['angular']
        },
        'ui-bootstrap':{
            deps:['jquery','angular','js-bootstrap']
        },
        'angular-resource':{
            deps: ['angular']
        },
        'angular-sanitize':{
            deps: ['angular']
        },
        'angular-ui-router':{
            deps: ['angular']
        },
        'angular-translate':{
            deps: ['angular']
        },
        'ng-table':{
            deps: ['angular']
        },
        'dialog-translation':{
            deps: ['angular']
        },
        'dialog':{
            deps: ['angular', 'angular-translate', 'ui-bootstrap']
        },
        'ckeditor-jquery':{
            deps:['jquery','ckeditor-core']
        },
        'ngActivityIndicator':{
            deps:['angular']
        },
        'fullcalendar':{
            deps:['jquery','moment']
        },
        'ko':{
            deps:['jquery','moment']
        },
        'uiCalendar':{
            deps:['angular','fullcalendar']
        },
        'jquery-blueimp-gallery':{
            deps:['jquery','blueimp-gallery']
        },
        'jqImage':{
            deps:['jquery','load-image','load-image-meta','load-image-exif','load-image-ios','canvas-to-blob','fileupload-process']
        },
        'jqAudio':{
            deps:['jquery','load-image','fileupload-process']
        },
        'jqVideo':{
            deps:['jquery','load-image','fileupload-process']
        },
        'jqIframeTransport':{
            deps:['jquery']
        },
        'jqValidate':{
            deps:['jquery','fileupload-process']
        },
        'ngFileupload':{
            deps:['jquery','angular','jquery-blueimp-gallery','fileupload','fileupload-process','fileupload-image','fileupload-audio','fileupload-video','fileupload-validate']
        }
    },

    // 부트스트랩 방법1
    // bootstrap.js 파일을 로드한다.
    deps: [
        './bootstrap'
    ]
});
