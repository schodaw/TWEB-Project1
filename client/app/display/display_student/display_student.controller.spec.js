'use strict';

describe('Controller: DisplayStudentCtrl', function () {

  // load the controller's module
  beforeEach(module('twebProject1App'));

  var DisplayStudentCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DisplayStudentCtrl = $controller('DisplayStudentCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
