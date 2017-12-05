import angular from 'angular';
import Test from './test/test';

let directiveModule = angular.module('app.directives', [
  Test
])
  .name;

export default directiveModule;
