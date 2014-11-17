'use strict';

describe('Controller: DisplayTeacherCtrl', function () {

  // load the controller's module
  beforeEach(module('twebProject1App'));

  var DisplayTeacherCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DisplayTeacherCtrl = $controller('DisplayTeacherCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
