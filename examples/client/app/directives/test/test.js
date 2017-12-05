import angular from 'angular';
import testDirective from './test.directive';

let testModule = angular.module('test', [])

.directive('test', testDirective)

.name;

export default testModule;
