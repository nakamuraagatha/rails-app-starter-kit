// Manages the Post resource on the server.
angular.module('Post', ['ArrayMetadataResponseAdapter'])
  .factory('Post', [
    '$resource', 'ArrayMetadataResponseAdapter',
    function($resource, ArrayMetadataResponseAdapter) {
      return $resource(
        '/posts/:collectionAction/:postId/:memberAction.json',
        { postId: '@id' },
        // Extra methods for compatibility with Rails, and our data format
        {
          query: ArrayMetadataResponseAdapter.adaptToArray(
            'items', 'metadata', {
              method: 'GET'
            }),
          edit: {
            method: 'GET',
            params: { memberAction: 'edit' }
          },
          update: {
            method: 'PUT'
          }
        });
    }]);
