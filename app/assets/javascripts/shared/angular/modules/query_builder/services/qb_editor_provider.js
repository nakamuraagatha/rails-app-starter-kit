/*
 * To create editors for qb-filters.
 * Can be configured by adding user-defined editor factories.
 *
 * Configuration:
 *   app.config(['QBEditorProvider', function (QBEditorProvider) {
 *     QBEditorProvider.addEditorFactory({
 *       createEditorHtml: function (column, op) {
 *         // Return some suitable HTML.
 *         // This may contain Angular directives, since it is compiled before
 *         // being added to the DOM.
 *         // The 'model' and 'column' variables are exposed on the scope, for
 *         // access to the data required to set up an editor. Note that
 *         // 'column' is also passed into this function as an argument, and is
 *         // as defined in the 'options' attribute passed to the
 *         // 'query-builder' directive.
 *       }
 *     });
 *
 *     // Add more factories if required.
 *     // The order of addition matters, since factories are tried in order of
 *     // their addition, and the first one that returns some HTML wins.
 *   }]);
 */
angular.module('QBEditorProvider', [])
  .provider('QBEditor', [
    function () {
      /**
       * Creates a 'select' element based editor.
       *
       * @param column {Object} - The column.
       * @param op {string} - The operator.
       *
       * @returns {string} The editor HTML. It may contain Angular directives,
       * since it is compiled before being added to the DOM.
       */
      var SELECT_EDITOR_HTML = function (column, op) {
        if (column.type === 'select') {
          var selectizeOptions = _.extend({
            labelField: 'label', valueField: 'value',
            searchField: 'label',
            maxItems: 1
          }, column.selectizeOptions);

          var ngModelExpr = (selectizeOptions.maxItems === 1)
            ? "model.values[0]"
            : "model.values";

          var selectizeOptionsStr =
            _.replaceAll(JSON.stringify(selectizeOptions), '"', "'");

          var editorHtml =
            '<selectize class="filter-value" '
              + 'ng-model="' + ngModelExpr + '"'
              + 'options="' + selectizeOptionsStr + '">' +
            '</selectize>';

          return editorHtml;
        }
      };

      /**
       * Creates an 'input type="xxx"' element based editor.
       *
       * @param column {Object} - The column.
       * @param op {string} - The operator.
       *
       * @returns {string} The editor HTML. It may contain Angular directives,
       * since it is compiled before being added to the DOM.
       */
      var INPUT_TYPE_EDITOR_HTML = function (column, op) {
        var editorHtml = '';
        var opArity = (op === 'range') ? 2 : 1;

        for (var i = 0; i < opArity; ++i) {
          editorHtml +=
            '<input type="' + (column.type || 'text')
              + '" class="filter-value form-control"'
              + ' ng-model="model.values[' + i + ']">';
        }

        return editorHtml;
      };

      // The list of user defined editor factories
      var editorFactories = [];

      /**
       * Adds an editor factory.
       * The order of addition is important, since editor creation is tried in
       * the same order.
       *
       * @param factory {{createEditorHtml: function(string, string)}} - Where
       * the function must:
       * * accept a column type and an operator
       * * return a string containing the editor's HTML, or null
       */
      var addEditorFactory = function (factory) {
        editorFactories.push(factory);
      };

      /**
       * Gets the editor HTML as generated by the registered factories.
       * Falls back on a default editor if the user defined factories (tried in
       * order of their addition) fail.
       *
       * @param column {Object} - The column.
       * @param op {string} - The operator.
       *
       * @returns {string} The editor HTML.
       */
      var getEditorHtml = function (column, op) {
        for (var i = 0;i < editorFactories.length; ++i) {
          var editor = editorFactories[i].createEditorHtml(column, op);

          if (editor) {
            return editor;
          }
        }

        // Default editors
        return SELECT_EDITOR_HTML(column, op)
          || INPUT_TYPE_EDITOR_HTML(column, op);
      };

      // Return the provider object
      return {
        addEditorFactory: addEditorFactory,

        // The service object
        $get: function () {
          return {
            getEditorHtml: getEditorHtml
          };
        }
      };
    }]);
