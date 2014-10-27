'use strict';

describe('Controller: DisplayCtrl', function () {

  // load the controller's module
  beforeEach(module('twebProject1App'));

  var DisplayCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DisplayCtrl = $controller('DisplayCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
