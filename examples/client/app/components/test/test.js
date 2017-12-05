import angular from 'angular';
import uiRouter from 'angular-ui-router';
import testDirective from './test.directive';

let testModule = angular.module('test', [
  uiRouter
])

.directive('test', testDirective)

.name;

export default testModule;
