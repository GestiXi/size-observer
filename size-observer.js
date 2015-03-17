// ==========================================================================
// Project:     Size Observer
// Description: Efficiently observe size changes of a jQuery element
// Copyright:   ©2014-2015 Nicolas BADIA
// License:     Licensed under the MIT license (see LICENCE)
// Version:     1.0
// ==========================================================================

!function($) { "use strict";

  // ..........................................................
  // SIZE OBSERVER PLUGIN DEFINITION
  //
  
  var itemsToObserve = [],  
    count = 0,
    timer,
    _newSize;

  /**
    To use this plugin you can directly specify a callback as first
    parameter. It will be call each time the size of the element changes.

    You can also specify the properties to observes `height` or `width`
    as first parameter, and the callback as second parameter.

    Example:

        $('img').onResize(function() {
          console.log('The size of my picture changed');
        });

        // Same as:

        $('img').onResize(['height', 'width'], function() {
          console.log('The size of my picture changed');
        });


        // Only check the height:

        $(document).onResize('height', function() {
          console.log('The size of my document changed');
        });


    @param properties
    @param callback
  */
  $.fn.onResize = function(properties, callback) {
    var propertiesType = $.type(properties);

    if (propertiesType === 'function') {
      callback = properties;
      properties = ['height', 'width'];
    }
    else if (propertiesType === 'string') properties = [properties];

    if ($.type(callback) !== 'function') return;

    return this.each(function() {
      var $this = $(this),
          instance = $this.data('onResize');
      
      if (!instance) {
        instance = new OnResize(this, properties, callback);
        $this.data('onResize', instance);
      }
      else {
        instance.addProperties(properties);
        instance.handlers.push(callback);
      }
    })
  }

  // ..........................................................
  // SIZE OBSERVER PUBLIC CLASS DEFINITION
  //

  var OnResize = function(element, properties, callback) {
    var that = this;

    that.element = element;
    that.handlers = [callback];
    that.addProperties(properties);

    itemsToObserve.push(that);
    checkItem(that);
  }

  $.fn.onResize.Constructor = OnResize;

  OnResize.prototype = {

    constructor: OnResize,

    addProperties: function(properties) {
      var that = this;
      that.properties = $.unique($.merge(that.properties || [], properties));
      that.check = that.sizeCheckFunction(that.properties);
    },

    sizeCheckFunction: function(properties) {
      var element = this.element,
        targets, 
        keyList,
        array = [];

      if (element === window) {
        targets = [document.documentElement];
        keyList = {
          height: 'clientHeight',
          width: 'clientWidth'
        };
      }
      else if (element === document) {
        targets = [document.body, document.documentElement];
        keyList = {
          height: ['clientHeight', 'scrollHeight', 'offsetHeight'],
          width: ['clientWidth', 'scrollWidth', 'offsetWidth']
        };
      }
      else {
        targets = [element];
        keyList = {
          height: 'clientHeight',
          width: 'clientWidth',
          top: 'offsetTop',
          left: 'offsetLeft',
          bottom: 'offsetBottom',
          right: 'offsetRight'
        };

        if ($.inArray('left', properties) !== -1 || $.inArray('offsetLeft', properties) !== -1) {
          keyList.push({ t: element, k: 'offsetLeft' });
        }
      }

      for (var i = properties.length - 1; i >= 0; i--) {
        var property = properties[i];

        for (var j = targets.length - 1; j >= 0; j--) {
          var target = targets[j],
            keys;

          if (keys = keyList[property]) {
            if ($.type(keys) !== 'array') keys = [keys];
            for (var k = keys.length - 1; k >= 0; k--) {
              array.push({ t: target, k: keys[k] });
            };
          }
          else {
            array.push({ t: target, k: property });
          }
        };
      };

      return function() {
        var newSize = '';
        for (var i = array.length - 1; i >= 0; i--) {
          var key = array[i];
          newSize += key.t[key.k]+'-';
        };

        return this.size !== newSize ? newSize : false;
      }
    }
  };

  var checkItem = function(item) {
    _newSize = item.check();

    if (_newSize !== false) {
      if (item.hasOwnProperty('size')) {
        for (var i = item.handlers.length - 1; i >= 0; i--) {
          item.handlers[i].call(item.element, item);
        };
      }
      item.size = _newSize;
    }
  };

  var run = function () {
    for (var i = itemsToObserve.length - 1; i >= 0; i--) {
      checkItem(itemsToObserve[i]);
    };
    
    timer = setTimeout(run, count < 10 ? 64 : (count < 100 ? 250 : 1000));
    count++;
  };

  var doRun = function() {
    if (timer) clearTimeout(timer);
    count = 0;
    run();
  };

  doRun();

  $(window).on('resize', function() { 
    doRun();
  });

  $(window).on('scroll', function() {
    doRun();
  });

}(window.jQuery);
