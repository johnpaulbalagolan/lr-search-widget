// Generated by CoffeeScript 1.7.1
(function() {
  var LRSearchWidgets, WidgetConfig, context,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  context = this;

  if (window.location.protocol === 'file:') {
    document.write('Error: Cannot load search widget in local file due to Javascript restrictions');
    return;
  }

  LRSearchWidgets = context.LRSearchWidgets = {
    loaded: false,
    widgets: {},
    ready: function(callback) {
      if (this.loaded) {
        return callback();
      } else {
        return this.pending.push(callback);
      }
    },
    pending: [],
    start: function() {
      var callback, _i, _len, _ref, _results;
      this.loaded = true;
      _ref = this.pending;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        _results.push(callback());
      }
      return _results;
    }
  };

  WidgetConfig = window.LRWidget || {
    api_key: '',
    domain: '',
    production: true
  };

  require.config({
    waitSeconds: 30,
    baseUrl: '//cdnjs.cloudflare.com/ajax/libs/',
    shim: {
      'jquery.primer': {
        deps: ['jquery']
      },
      'magnific': {
        deps: ['jquery']
      },
      'jquery.flot': {
        deps: ['jquery'],
        exports: '$.plot'
      },
      'jquery.flot.pie': {
        deps: ['jquery.flot']
      },
      'jquery.flot.selection': {
        deps: ['jquery.flot']
      },
      'select2': {
        deps: ['jquery']
      },
      mustache: {
        exports: 'Mustache'
      },
      magnific: {
        deps: ['jquery'],
        exports: '$.magnific'
      }
    },
    paths: {
      jquery: 'jquery/1.11.0/jquery',
      jqueryMigrate: 'jquery-migrate/1.2.1/jquery-migrate.min',
      mustache: 'mustache.js/0.7.2/mustache.min',
      hogan: 'hogan.js/3.0.0/hogan.min.amd',
      underscore: 'underscore.js/1.6.0/underscore-min',
      backbone: 'backbone.js/1.1.2/backbone-min',
      excanvas: 'flot/0.8.2/excanvas.min',
      'jquery.flot': 'flot/0.8.2/jquery.flot.min',
      'jquery.flot.pie': 'flot/0.8.2/jquery.flot.pie.min',
      'jquery.flot.selection': 'flot/0.8.2/jquery.flot.selection.min',
      'jquery.flot.all': window.LRWidget.domain + '/js/jquery.flot-all',
      'jquery.lazyload': window.LRWidget.domain + '/js/jquery.lazyload',
      select2: 'select2/3.4.5/select2.min',
      esbb: window.LRWidget.domain + '/js/es-backbone',
      magnific: window.LRWidget.domain + '/js/jquery.magnific-popup.min',
      perfectScrollbar: window.LRWidget.domain + '/vendor/perfect-scrollbar/min/perfect-scrollbar-0.4.8.min',
      'jquery-noconflict': window.LRWidget.domain + '/js/jquery-noconflict',
      'backbone-noconflict': window.LRWidget.domain + '/js/backbone-noconflict',
      'underscore-noconflict': window.LRWidget.domain + '/js/underscore-noconflict'
    },
    map: {
      '*': {
        'jquery': 'jquery-noconflict',
        'backbone': 'backbone-noconflict',
        'underscore': 'underscore-noconflict'
      },
      'jquery-noconflict': {
        'jquery': 'jquery'
      },
      'backbone-noconflict': {
        'backbone': 'backbone'
      },
      'underscore-noconflict': {
        'underscore': 'underscore'
      }
    },
    urlArgs: WidgetConfig.production ? 'bust=' + window.LRWidgetBuildVersion : "bust=" + new Date().getTime()
  });

  require(['jquery', 'underscore', 'backbone', 'esbb/es-backbone', 'esbb/simple-view'], function($, _, Backbone, ESBB, ESBBApp) {
    var WidgetModel, defers;
    WidgetModel = (function(_super) {
      __extends(WidgetModel, _super);

      function WidgetModel() {
        return WidgetModel.__super__.constructor.apply(this, arguments);
      }

      return WidgetModel;

    })(Backbone.Model);
    defers = [];
    $('.lr-search-widget').each(function() {
      var defer, demo, widgetKey;
      $(this).html('Loading search widget...');
      widgetKey = $(this).data('widgetKey');
      demo = !!$(this).data('demo');
      defers.push(defer = $.Deferred());
      return $.ajax(WidgetConfig.domain + '/api/embed/widget?jsonp=?', {
        dataType: 'jsonp',
        data: {
          widget_key: widgetKey,
          api_key: WidgetConfig.api_key,
          demo: demo
        }
      }).done((function(_this) {
        return function(t) {
          var esbbSimpleApp, queryModel, resultsModel, widgetConfigModel;
          $(_this).html(t.templates.core);
          resultsModel = new ESBB.SearchResultsModel();
          queryModel = new ESBBApp.SearchQueryProxyModel({
            config: {
              search_url: WidgetConfig.domain + '/api/search?api_key=' + WidgetConfig.api_key + '&jsonp=?',
              index: 'lr',
              index_type: 'lr_doc'
            },
            limit: 10,
            query: '',
            facets: t.settings.show_facets || demo ? ['url_domain', 'keys', 'publisher_full', 'mediaFeatures', 'grades'] : [],
            filter_keys: t.settings.filters || [],
            highlight: ['description']
          });
          widgetConfigModel = new WidgetModel(t.settings);
          queryModel.on('change:filter_keys', function() {
            return queryModel.search();
          });
          queryModel.resultsModel = resultsModel;
          esbbSimpleApp = new ESBBApp.SimpleAppView({
            model: resultsModel,
            query: queryModel,
            el: $(_this),
            globalConfig: WidgetConfig,
            widgetConfig: widgetConfigModel,
            templates: t.templates
          });
          LRSearchWidgets.widgets[widgetKey] = {
            queryModel: queryModel,
            resultsModel: resultsModel,
            view: esbbSimpleApp,
            configModel: widgetConfigModel,
            widgetKey: widgetKey
          };
          return defer.resolve();
        };
      })(this)).fail((function(_this) {
        return function() {
          return defer.reject();
        };
      })(this));
    });
    return $.when.apply($, defers).then(function() {
      LRSearchWidgets.start();
      return require(['esbb/features', 'esbb/features/standards-browser', 'esbb/features/subjects-browser'], function(Features, StandardsBrowser, SubjectsBrowser) {
        _.each(LRSearchWidgets.widgets, function(widget, widgetKey) {
          widget.configModel.on('buildStyles change:font change:main_color change:support_color change:bg_color change:heading_color', function() {
            return Features.createWidgetStyles(widgetKey, widget.configModel.toJSON());
          });
          widget.configModel.trigger('buildStyles');
          StandardsBrowser.start(WidgetConfig, widget, function(filterValue, itemText) {
            widget.view.$el.find('a.lr-nav-link__search').trigger('click');
            widget.queryModel.clearSearch().addTermFilter('standards', filterValue.toLowerCase(), itemText).search();
            return widget.queryModel.trigger('change');
          });
          SubjectsBrowser.start(WidgetConfig, widget, function(filterValue, itemText) {
            widget.view.$el.find('a.lr-nav-link__search').trigger('click');
            widget.queryModel.clearSearch().addTermFilter('subjects', filterValue.toLowerCase(), itemText).search();
            return widget.queryModel.trigger('change');
          });
          return widget.queryModel.search();
        });
      });
    });
  });

}).call(this);
