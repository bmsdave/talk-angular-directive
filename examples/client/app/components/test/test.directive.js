import template from './test.html';
import controller from './test.controller';
import './test.styl';

let testDirective = {
  restrict: 'E',
  bindings: {},
  template,
  controller
};

export default testDirective;
