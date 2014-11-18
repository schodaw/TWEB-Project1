'use strict';

describe('Controller: AttendlectureCtrl', function () {

  // load the controller's module
  beforeEach(module('twebProject1App'));

  var AttendlectureCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AttendlectureCtrl = $controller('AttendlectureCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
