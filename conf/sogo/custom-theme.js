(function() {
  'use strict';
  angular.module('SOGo.Common')
    .config(configure);

  configure.$inject = ['$mdThemingProvider'];
  function configure($mdThemingProvider) {
    // Custom modern blue primary palette
    var modernBlue = $mdThemingProvider.extendPalette('blue', {
      '500': '2563eb',
      '600': '1d4ed8',
      '700': '1e40af',
      '800': '1e3a8a',
      'contrastDefaultColor': 'light'
    });

    // Clean slate background
    var cleanGrey = $mdThemingProvider.extendPalette('grey', {
      '50':  'f8fafc',
      '100': 'f1f5f9',
      '200': 'e2e8f0',
      '300': 'cbd5e1',
      '400': '94a3b8',
      '500': '64748b',
      '600': '475569',
      '700': '334155',
      '800': '1e293b',
      '900': '0f172a'
    });

    $mdThemingProvider.definePalette('modern-blue', modernBlue);
    $mdThemingProvider.definePalette('clean-grey', cleanGrey);

    $mdThemingProvider.theme('default')
      .primaryPalette('modern-blue', {
        'default': '600',
        'hue-1': '500',
        'hue-2': '700',
        'hue-3': '800'
      })
      .accentPalette('modern-blue', {
        'default': '500',
        'hue-1': '400',
        'hue-2': '600',
        'hue-3': '700'
      })
      .backgroundPalette('clean-grey');

    $mdThemingProvider.generateThemesOnDemand(false);
  }
})();