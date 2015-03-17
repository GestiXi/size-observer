Size Observer
=============

**Simple plugin that aim to provide an efficient way to observe the size of DOM elements.**

------

## Installation ##

Size Observer depends on jQuery. To use it, include this in your page :

    <script src="jquery.js" type="text/javascript"></script>
    <script src="size-observer.js" type="text/javascript"></script>

------

## Usage ##

To use this plugin you can directly specify a callback as first
parameter. It will be call each time the size of the element changes.

You can also specify the properties to observes `height` or `width`
as first parameter, and the callback as second parameter.


##### Example :

    $(function() {
      $('img').onResize(function() {
        console.log('The size of this element changed: ', this);
      });

      // Same as:

      $('img').onResize(['height', 'width'], function() {
        console.log('The size of this element changed: ', this);
      });


      // Only check the height:

      $(document).onResize('height', function() {
        console.log('The height of the document changed: ', this);
      });


      // Only check the width:

      $(window).onResize('width', function() {
        console.log('The width of the window changed: ', this);
      });
    });

------

## Author ##

**Nicolas Badia**

+ [https://twitter.com/@nicolas_badia](https://twitter.com/@nicolas_badia)
+ [https://github.com/nicolasbadia](https://github.com/nicolasbadia)


------

## Copyright and license

Copyright 2013-2015 GestiXi under [The MIT License (MIT)](LICENSE).
