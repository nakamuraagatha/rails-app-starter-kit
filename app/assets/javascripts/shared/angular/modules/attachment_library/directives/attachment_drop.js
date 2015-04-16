/*
 * An area for users to drop attachments dragged from the attachment browser,
 * and associate the dropped attachments with a model.
 *
 * Usage:
 *   <attachment-drop attachments="Array expr"
 *                    attachment-owner-id="some id"
 *                    attachment-owner-type="some server model class">
 *   </attachment-drop>
 *
 * The 'attachments' attribute must be passed an array of attachments in the
 * following format (at a minimum):
 *
 *   [{ id: id, name: 'some name', url: 'some url' }, ...]
 */
angular.module('AttachmentDrop', []).
  directive('attachmentDrop', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'shared/directives/attachment_drop.html',
        replace: true,

        scope: {
          attachments: '='
        },

        link: function (scope, element, attrs) {
          var dropAreaElement = $(element).find('.attachment-drop-area');

          dropAreaElement.droppable({
            accept: '.droppable-attachment',
            hoverClass: 'attachment-drop-area-active',
            drop: function (event, ui) {
              console.log(attrs.attachmentOwnerId);
              console.log(attrs.attachmentOwnerType);
              console.log(ui);
            }
          });
        }
      }
    }]);
