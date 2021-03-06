(function () {
  'use strict';

  angular
    .module('app.core')
    .component('gtAggregationCardList', {
      templateUrl: 'app/core/components/gt-aggregation-card-list/gt-aggregation-card-list.html',
      controller: AggregationCardListController,
      controllerAs: 'vm',
      bindings: {
        aggregation: '='
      }
    });

  /** @ngInject */
  function AggregationCardListController($scope, $timeout, Aggregation, eventCode) {
    const vm = this;
    const listeners = [];

    // Data

    vm.aggregation = vm.aggregation || Aggregation.none();

    // Methods

    vm.$onInit = init;
    vm.$onDestroy = destroy;

    //////////

    function init() {
      listeners.push($scope.$on(eventCode.REVIEW_CREATED, onReviewChanged));
      listeners.push($scope.$on(eventCode.REVIEW_UPDATED, onReviewChanged));
      listeners.push($scope.$on(eventCode.REVIEW_REMOVED, onReviewChanged));
    }

    function destroy() {
      angular.forEach(listeners, (listener) => {
        listener();
      });
    }

    async function onReviewChanged($event, review) {
      $timeout(async() => {
        vm.aggregation = await Aggregation.get(review.course) || Aggregation.none();
      }, 100);
    }
  }
})();
