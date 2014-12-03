/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : 사용할 모든 service를 로드
 */
define([
//    './contentFectory',
//    './contentsService',

    // 공통
    './dataService',

    // 콘텐츠
    './projectService', // CMS 프로젝트 관련 서비스 모듈. project.php와 통신
    './taskService', // CMS 태스크 관련 서비스 모듈. task.php와 통신
    './contentService', // CMS 콘텐츠 관련 서비스 모듈. content.php와 통신
    './approvalService', // CMS 결재 관련 서비스 모듈. approval.php와 통신

    // 게시판
    './webboardService',

    // 관리자
    './userService', // 사용자 관련 서비스 모듈. user.php와 통신
    './permissionService',
    './categoryService',

    // 공통
    './loginService'
], function () {});