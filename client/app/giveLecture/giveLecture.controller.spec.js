'use strict';

describe('Controller: GivelectureCtrl', function () {

  // load the controller's module
  beforeEach(module('twebProject1App'));

  var GivelectureCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GivelectureCtrl = $controller('GivelectureCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
