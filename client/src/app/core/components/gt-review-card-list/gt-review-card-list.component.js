(function () {
  'use strict';

  angular
    .module('app.core')
    .component('gtReviewCardList', {
      templateUrl: 'app/core/components/gt-review-card-list/gt-review-card-list.html',
      controller: ReviewCardListController,
      controllerAs: 'vm',
      bindings: {
        reviews: '=',
        showCourseTitle: '<',
        onReady: '&'
      }
    });

  /** @ngInject */
  function ReviewCardListController($rootScope, $mdDialog, Util, Review, Course, Semester, eventCode) {
    const vm = this;

    // Data

    // Methods

    vm.$postLink = vm.onReady;

    vm.edit = edit;
    vm.remove = remove;

    //////////

    async function edit($event, review) {
      const dialog = {
        controller: 'ReviewDialogController as vm',
        templateUrl: 'app/core/dialogs/gt-review/gt-review.html',
        parent: angular.element('body'),
        targetEvent: $event,
        clickOutsideToClose: true,
        locals: {
          review
        },
        resolve: {
          courses: Course.all,
          semesters: Semester.all
        }
      };

      try {
        const edited = await $mdDialog.show(dialog);
        const updated = await Review.update(edited);
        const index = _.findIndex(vm.reviews, ['_id', updated._id]);
        if (index >= 0) {
          vm.reviews[index] = updated;
          $rootScope.$broadcast(eventCode.REVIEW_UPDATED, updated);
          Util.toast('Updated.');
        }
      } catch (error) {
        Util.toast(error);
      }
    }

    async function remove($event, review) {
      try {
        await Util.confirm({ targetEvent: $event, title: 'Remove' });
        await Review.remove(review);
        _.remove(vm.reviews, ['_id', review._id]);
        $rootScope.$broadcast(eventCode.REVIEW_REMOVED, review);
        Util.toast('Removed.');
      } catch (error) {
        Util.toast(error);
      }
    }
  }
})();
