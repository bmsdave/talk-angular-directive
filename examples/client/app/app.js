import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Common from './common/common';
import Components from './components/components';
import Directives from './directives/directives';
import AppComponent from './app.component';


angular.module('app', [
    uiRouter,
    Common,
    Components,
    Directives
])

    .config(($locationProvider) => {
        //noinspection BadExpressionStatementJS
        'ngInject';
        // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
        // #how-to-configure-your-server-to-work-with-html5mode
        $locationProvider.html5Mode(true).hashPrefix('!');
    })

    .component('app', AppComponent)
    .directive('appDirective', function () {
    return {
        restrict: 'E',
        controller: function ($scope, $element) {
            var text = $element.text();
            $element.text(text + ' Second');
        }
    }
    });
