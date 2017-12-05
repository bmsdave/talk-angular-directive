import template from './<%= name %>.html';
import controller from './<%= name %>.controller';
import './<%= name %>.sass';

let <%= name %>Directive = {
  restrict: 'E',
  bindings: {},
  template,
  controller
};

export default <%= name %>Directive;
