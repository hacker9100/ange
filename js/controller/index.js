/**
 * Author : Han-sik Choi
 * Blog   : http://hans.or.kr
 * Date   : 2014-06-07
 * Description : 사용할 모든 controller를 로드
 */

define([
//    './contentMainController',
//    './contentMenuController',
//    './contentListController',
//    './contentDetailController',
//    './managementMainController',

    '../../partials/cms/locater',

    // CMS Controller
    '../../partials/cms/dashboard_calendara',

    '../../partials/cms/upload',
    '../../partials/cms/signin',

    '../../partials/cms/dashboard',
    '../../partials/cms/project',
    '../../partials/cms/task',
    '../../partials/cms/article',
    '../../partials/cms/article_confirm',
    '../../partials/cms/edit',

    '../../partials/cms/webboard',
    '../../partials/cms/webboardEdit',
    '../../partials/cms/webboardView'
], function () {});
