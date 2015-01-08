/*
 * Angular application routes.
 * Uses the 'app' variable defined in app.js, so must be loaded after it.
 */
app.config([
  '$routeProvider', 'ROUTE_UTILS',
  function ($routeProvider, ROUTE_UTILS) {
    var R = ROUTE_UTILS; // Shortcut

    $routeProvider.
      // Home routes
      when('/', {
        templateUrl: 'admin/controllers/home/index.html',
        controller: 'HomeCtrl'
      }).

      when('/unauthorized', {
        templateUrl: 'shared/401.html'
      }).
      when('/server_error', {
        templateUrl: 'shared/500.html'
      }).
      otherwise({
        templateUrl: 'shared/404.html'
      });
  }]);

app.run([
  '$rootScope', '$window', '$location', 'PleaseWaitSvc',
  function($rootScope, $window, $location, PleaseWaitSvc) {
    // To show a 'Please Wait...' message between route changes
    $rootScope.$on('$routeChangeStart', function() {
      PleaseWaitSvc.request();
    });

    /*
     * Works in conjunction with 'requireSignIn' and 'requireServerAuth'.
     * If their promises do not resolve, we catch the $routeChangeError that
     * results, and redirect to the sign-in page.
     *
     * Also hides the 'Please Wait...' message requested above.
     */
    $rootScope.$on('$routeChangeError', function(e, curr, prev, rejection) {
      PleaseWaitSvc.releaseAll();

      switch (rejection) {
        case 'NOT_SIGNED_IN':
          $window.location.href = '/users/sign_in?x_return_to=' +
          $location.path();

          break;
        case 'ROLE_NOT_AUTHORIZED':
        case 'SERVER_DID_NOT_AUTH':
          $location.path('/unauthorized').replace();

          break;
        default:
          $location.path('/server_error').replace();

          break;
      }
    });

    // This hides the 'Please Wait...' message requested above.
    $rootScope.$on('$routeChangeSuccess', function() {
      PleaseWaitSvc.releaseAll();
    });
  }]);
