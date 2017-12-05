import angular from 'angular';
import uiRouter from 'angular-ui-router';
import <%= name %>Directive from './<%= name %>.directive';

let <%= name %>Module = angular.module('<%= name %>', [
  uiRouter
])

.directive('<%= name %>', <%= name %>Directive)

.name;

export default <%= name %>Module;
