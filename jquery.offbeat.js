// jQuery plugin template from http://jqueryboilerplate.com / https://github.com/jquery-boilerplate/boilerplate/issues
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "offBeat",
        defaults = {
            eventDelayMS  : 500,
            loadingClass  : pluginName+"Loading"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );

        this._defaults 					= defaults;
        this._name 							= pluginName;
        this._startTypingEvent 	= "inputStart";
        this._isTypingEvent 		= "inputting";
        this._endTypingEvent   	= "inputStop";

        // Create a data object that is unique to this instance of the plugin
				this.data = {};
        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).

            // Add handlers that were specified up-front
            if(this.options.hasOwnProperty('startHandler')) {
							$(this.element).on(this._startEvent, this.options.startHandler);
            }
            if(this.options.hasOwnProperty('endHandler')) {
            	$(this.element).on(this._endEvent, this.options.endHandler);
            }
            // Attach input handler
						$(this.element).bind('input', (function bindThisToScope(plugin) {
							// event handlers are executed in non-local scope (global?)
							// so instead, we execute `bindThisToScope` immediately
							// and pass `this` to it and return a function
							// thus inputHandlerWithPluginInScope is actually applied as
							// the handler for the input event, with `plugin` containing `this`
							return function inputHandlerWithPluginInScope() {

								// Work out whether to cancel the timer
								if(plugin.hasOwnProperty('timer')) {
									// There is a timer; clear it
									clearTimeout(plugin.timer);
								} else {
									// There is no timer yet; fire the start event
									$(plugin.element).trigger(plugin._startTypingEvent, plugin.data);
								}

								// User is inputting - fire this event
								$(plugin.element).trigger(plugin._isTypingEvent, plugin.data);

								// Set up the timer for the stop event
								plugin.timer = setTimeout(function() {
									// Fire the event
									$(plugin.element).trigger(plugin._endTypingEvent, plugin.data);
									// Remove the timer so we can tell when the user starts timing again
									delete plugin.timer;
								}, plugin.options.eventDelayMS);
		          }
	          })(this));
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );