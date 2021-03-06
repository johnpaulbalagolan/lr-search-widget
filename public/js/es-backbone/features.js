define([
  'jquery',
  'perfectScrollbar'
], function($) {
  'use strict';

  var Features = {};

  $.fn.slideFadeToggle = function(speed, easing, callback) {
    return this.animate({opacity: 'toggle', height: 'toggle'}, speed, easing, callback);
  };


  $.fn.tabs = function(options) {
    // Plugin options.
    var settings = $.extend({
        tabPaneClass: '',
        startTabId: ''
      }, options);

    var tabContainer = this,
        tabPane = $('.' + settings.tabPaneClass),
        startTab = $('#' + settings.startTabId);

    // Initial state.
    tabPane.hide();
    tabContainer.find('a:first').addClass('lr-nav__active');
    startTab.fadeIn();

    tabContainer.find('a').on('click', function(e) {
        e.preventDefault();
        if ($(this).hasClass('lr-nav__active')) {
          return;
        }
        else {
          $.fn.tabs.resetTabs(tabPane, tabContainer);
          $(this).addClass('lr-nav__active');
          $($(this).attr('href')).fadeIn();
        }
    });

    return this;
  };

  $.fn.tabs.resetTabs = function(tabPane, tabContainer) {
    tabPane.hide();
    tabContainer.find('a').removeClass('lr-nav__active');
  };




  // http://stackoverflow.com/a/13542669/2448360
  function shadeColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
  }

  Features.createWidgetStyles = function(widgetKey, settings) {
    // Set up style variables.
    var fontFamily = settings.font || 'Helvetica, Arial, "Nimbus Sans L", sans-serif';
    var mainColorMedium = settings.main_color || '#2e7fa4';
    var supportColor = settings.support_color || '#dd9a27';
    var bgColor = settings.bg_color || '#ffffff';
    var headingColor = settings.heading_color || '#2e7fa4';

    var mainColorDark = shadeColor(mainColorMedium, -0.4);
    var mainColorLight = shadeColor(mainColorDark, 0.5);
    var mainColorLightest = shadeColor(mainColorDark, 0.9);
    var supportColorDark = shadeColor(supportColor, -0.4);

    var stylePrefix = ' div.lr-embed-'+widgetKey;

    // if styles are already defined, remove it before creating new styles
    $('#widget-style-'+widgetKey).remove()

    // Inline style block.
    var colorStyles = '<style type="text/css" id="widget-style-'+widgetKey+'">'+
      stylePrefix+' { font-family: '+fontFamily+'; background-color: '+bgColor+' }'+
      stylePrefix+' a:link, div.lr-embed a:visited { color: ' + mainColorMedium + '; }'+
      stylePrefix+' a:hover, div.lr-embed a:focus, div.lr-embed a:active { color: ' + mainColorDark + '; }'+
      stylePrefix+' a.lr-nav__link { background-color: ' + mainColorLightest + '; }'+
      stylePrefix+' a.lr-nav__link:link, div.lr-embed a.lr-nav__link:visited { color: ' + mainColorLight + '; }'+
      stylePrefix+' a.lr-nav__link:hover, div.lr-embed a.lr-nav__link:focus, div.lr-embed a.lr-nav__link:active, div.lr-embed a.lr-nav__link.lr-nav__active { color: ' + mainColorMedium + '; }'+
      stylePrefix+' h2.lr-section__title { color: ' + supportColor + ';}' +
      stylePrefix+' a.lr-tags__link { background-color: ' + mainColorLightest + '; }'+
      stylePrefix+' span.listview-list-item__title { color: ' + mainColorMedium + '; }'+
      stylePrefix+' span.listview-list-item__title:hover { background-color: ' + mainColorLightest + '; }'+
      stylePrefix+' a.listview-list-item__link { color: ' + supportColor + '; }'+
      stylePrefix+' a.listview-list-item__link:hover { color: ' + supportColorDark + '; }'+
      stylePrefix+' a.lr-listview__breadcrumbs__link { color: ' + supportColor + ';}'+
      stylePrefix+' a.lr-listview__breadcrumbs__link:last-child:hover { color: ' + supportColor + ';}'+
      stylePrefix+' figcaption.lr-piechart__selection { color: ' + mainColorMedium + ';}'+
      stylePrefix+' footer.lr-footer { background-color: ' + mainColorMedium + ';}'+
      stylePrefix+' h1.lr-branding__title { color: ' + headingColor + ';}'+
      '</style>';

    $('head').append(colorStyles);
  };

  $.fn.listview = function(options) {
    // Plugin options.
    var settings = $.extend({
        type: '',
        listViewTitle: 'Browse'
      }, options);

    return this.each(function() {

      var elem = $(this),
          containerId = elem.attr('id'),
          activeIdName = containerId + '-active',
          activeId = '#' + activeIdName,
          breadCrumbContainer = $('<h2 id="' + containerId + '-breadcrumbs" class="lr-section__title listview__breadcrumbs" data-breadcrumb-type="' + containerId + '">' + settings.listViewTitle + '</h2>'),
          topLevelList = elem.children('ul');

      function getListLevel(listItemSpan) {
        return listItemSpan.data(containerId + '-lv-level');
      }

      function activateList(list) {
        list.parents(activeId).removeAttr('id');
        topLevelList.find('.slideInLeft').removeClass('animated slideInLeft');
        list.addClass('animated slideInRight')
          .attr('id', activeIdName).show();
      }

      function deActivateList(listItemSpan) {
        $('[data-' + containerId + '-lv-level=' + getListLevel(listItemSpan) + ']').hide();
      }

      function navigateBreadCrumb(breadCrumbLink) {

        var breadCrumbLinks = breadCrumbContainer.children('a'),
            parentListLevel = breadCrumbLink.data('breadcrumb-level'),
            matchingListItems = breadCrumbLink.data('breadcrumb-target'),
            maxListLevel = breadCrumbLinks.last().data('breadcrumb-level'),
            breadCrumbLinkIndex = breadCrumbLinks.index(breadCrumbLink),
            breadCrumbCount = 0;

        // Walk up the breadcrumb tree, activate the parent list items, and deactivate the currently active list.
        breadCrumbLinks.each(function() {
          if($(this).data('breadcrumb-level') >= parentListLevel)
          {
            var i = $(this).data('breadcrumb-level'),
                    $elements = elem.find('[data-' + containerId + '-lv-level="' + i + '"]');

            $elements.siblings('ul').hide().removeClass('animated slideInRight');
            $elements.addClass('animated slideInLeft').show();
          }
        });

        // Make sure there is only one list with activeId.
        matchingListItems
        .parents('ul:eq(0)')
        .attr('id', activeIdName)
        .show()
        .find(activeId).removeAttr('id');

        // Re-populate breadcrumbs. Keep track of breadcrumb count,
        // so we can remove unneeded crumbs, and put back the default title when needed.
        breadCrumbLinks.detach();
        breadCrumbLinks.each(function(index, value) {
          if (index <= breadCrumbLinkIndex) {
            breadCrumbContainer.append($(this));
            breadCrumbCount++;
          }
        });

        if (breadCrumbCount === 1) {
          breadCrumbContainer.empty();
          breadCrumbContainer.append(settings.listViewTitle);
        }
      }

      function populateBreadcrumbs(listItemSpan) {
        var breadCrumbLevel = listItemSpan.siblings('.listview-list').find('.listview-list-item__title').data(containerId + '-lv-level'),
            breadCrumbText = listItemSpan.data('breadcrumb-label'),
            breadCrumbTextClean = breadCrumbText.replace(/ *\([^)]*\) */g, ""), // Remove text between brackets (e.g. resource count).
            breadCrumbRoot = '<a class="lr-listview__breadcrumbs__link lr-listview__breadcrumbs__label" data-breadcrumb-level="0">' + settings.type + '</a>',
            breadCrumbLink = '<a class="lr-listview__breadcrumbs__link" data-breadcrumb-level="' + breadCrumbLevel + '">' + breadCrumbTextClean + '</a>';

        if (breadCrumbContainer.text() === settings.listViewTitle) {
          breadCrumbContainer.empty();
          breadCrumbContainer.prepend($(breadCrumbRoot).data('breadcrumb-target', listItemSpan));
        }
        if (breadCrumbContainer.data('breadcrumb-type') === containerId) {
          breadCrumbContainer.append($(breadCrumbLink).data('breadcrumb-target', listItemSpan));
        }
      }

      // Add title/breadcrumb container.
      elem.prepend(breadCrumbContainer);

      // Assign id to top level list.
      activateList(topLevelList);

      // Add classes, inner wrapper and icon to list items.
      elem.find('li').each(function(index, value) {
        var $li = $(this),
            $listItemText = $li.children('span'),
            resourceCount = $li.data('resourceCount'),
            resourceFilter = $li.data('resourceFilter'),
            itemText = $listItemText.text();

        $li.addClass('listview-list-item');

        $listItemText.data('breadcrumb-label', itemText)
                     .addClass('listview-list-item__title')

        if ($li.has('ul').length) {
          $listItemText
            .addClass('has-children')
            .append('<i class="fa fa-caret-right"></i>');
        }
        else {
          $listItemText
            .addClass('no-children');
        }



        if(resourceCount && resourceFilter) {
          var $link =
            $('<a href="#" />')
              .text('[View '+resourceCount+' Resources]')
              .addClass('listview-list-item__link')
              .attr('title', 'Find Matching Resources')
              .click(function(e) {
                e.preventDefault();
                e.stopPropagation();

                if(settings.filterCallback)
                {
                  settings.filterCallback(resourceFilter, itemText, $li);
                }

              })

          $listItemText.append(' ', $link);
          //$listItemText.append('(', $link, ')');
        }



        /*if (settings.type === 'Subjects') {
          $(this).children('.has-children')
            .append('<span class="listview-list-item__tip">Filter more</span>');
          $(this).children('.no-children')
            .append('<span class="listview-list-item__tip">View resources</span>');
        }
        else if (settings.type === 'Standards') {
          var standardsInfo = $(this).children('.lr-standards__info');
          $(this).children('.no-children')
            .prepend('<i class="fa fa-caret-right"></i>')
            .append(standardsInfo);
        }*/
      });

      // Add class and level data attribute to lists.
      // Outermost list gets a special class.
      topLevelList.addClass('listview-list-root');
      elem.find('ul').each(function(index, value) {
        $(this).addClass('listview-list').hide();
        $(this).find('.listview-list-item__title').attr('data-' + containerId + '-lv-level', index);
      });

      // Initial state: show top level list.
      topLevelList.show();

      // Traverse list.
      elem.on('click', '.has-children', function() {
        populateBreadcrumbs($(this));
        deActivateList($(this));
        activateList($(this).siblings('ul'));
      });

      // Navigate breadcrumbs.
      elem.on('click', '.lr-listview__breadcrumbs__link', function() {
        var breadCrumbLinks = breadCrumbContainer.children('a');
        var breadCrumbLinkIndex = breadCrumbLinks.index($(this));
        if (breadCrumbLinkIndex === breadCrumbLinks.length - 1) {
          return;
        }
        else {
          navigateBreadCrumb($(this));
        }
      });

      // Toggle standards info.
      if (false && settings.type === 'Standards') {
        $('.lr-standards__info').hide();
        elem.on('click', '.no-children', function() {
          $(this).children('.lr-standards__info').slideFadeToggle();
          $(this).toggleClass('lr-standards__info--expanded');
        });
      }

    });
  };

  $(function() {

    // Add scrollbar to search results and filters.
    /*$('#lr-results-list, #lr-results-facets').css('overflow', 'hidden').perfectScrollbar({
       wheelSpeed: 20,
       wheelPropagation: true,
       suppressScrollX: true
    });*/

    // Implement tabs plugin for main nav.
    $('#lr-nav').tabs({
      tabPaneClass: 'lr-tab-pane',
      startTabId: 'lr-section-search'
    });

    // Activate search tab when clicking on widget title/logo.
    $('#lr-logo, #lr-branding-title').click(function() {
      $.fn.tabs.resetTabs($('.lr-tab-pane'), $('#lr-nav'));
      $('#lr-section-search').fadeIn();
      $('#lr-nav a:first').addClass('lr-nav__active');
    });

    // Search filter control: expand and collapse.
    $('#lr-results-facets').hide();
    $('#lr-results-filter__title, #js-lr-results-expand').click(function() {
      $('#lr-results-expand').toggleClass('fa-caret-down').toggleClass('fa-caret-up');
      $('#lr-results-filter__title').toggleClass('lr-results-filter__title--active');
      $('#lr-results-facets').slideFadeToggle(200, function() {
        $(this).perfectScrollbar('update');
      });
    });
    $('#lr-results-collapse').click(function() {
      $('#lr-results-facets').slideFadeToggle(200, function() {
        $('#lr-results-filter__title').removeClass('lr-results-filter__title--active');
        $('#lr-results-expand').fadeIn();
      });
    });

    // Clear search field.
    $('#lr-search-term').keypress(function() {
      $('#lr-clear-keyword').show();
      $('#lr-search-button').hide();
    });
    if ($('#lr-search-term').val()) {
      $('#lr-clear-keyword').show();
    }
    $('#lr-clear-keyword').click(function(event) {
      event.preventDefault();
      $('#lr-search-term').val('').focus().removeClass('active');
      $('#lr-clear-keyword').hide();
      $('#lr-search-button').show();
    });
  });

  return Features;

});


