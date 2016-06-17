var gaEvents = window.gaEvents || {};

$.extend(window.gaEvents,
{
	AnalyticsService: function(){},
	defaults: {
		gaObjectName: "ga",
		whitelist: [],
		queryStringKey: "debug",
		queryStringValue: "true",
		defaultEvent: "click"
	},
	settings: {},
	isInWhiteList: function() {
		var url = window.location.hostname;
		if(settings.whitelist.length > 0) {
			for (var domain in settings.whitelist) {
				if((url.indexOf(domain) > -1)) {
					console.log('You are on a white-listed GA Debug server!');
					return true;
				} else {
					continue;
				}
			}
		} else {
			// no whitelist set; allow on any domain
			return true;
		}
	},
	debugMode: false,
	getQueryVariable: function(key, value) {
	    var query = window.location.search.substring(1);
	    var vars = query.split('&');
	    for (var i = 0; i < vars.length; i++) {
	        var pair = vars[i].split('=');
	        if (decodeURIComponent(pair[0]) === key && decodeURIComponent(pair[1]) === value) {
	        	return true;
	        }
		}
	},
	displayDebugInfo: function(which, content) {
		$('#ga-debug-message #debug-' + which).html(content);
	},
	clearDebugInfo: function(which) {
		$('#ga-debug-message #debug-' + which).html('');
	},
	getLabel: function($el) {
		return $el.data('gaLabel');
	},
	getValue: function($el) {
		return $el.data('gaValue');
	},
	getEvent: function($el) {
		return $el.data('gaEvent');
	},
	getAction: function($el) {
		return $el.data('gaAction');
	},
	getCategory: function($el) {
		return $el.data('gaCategory');
	},
	template: '<div id="ga-debug-message"><div>Event Section: <span id="debug-event-section"></span></div><div>Category: <span id="debug-category"></span></div><div>Event: <span id="debug-event"></span></div></div>'
});

gaEvents.AnalyticsService.prototype = {
	trackEvent: function(category, action, label, value) {
		console.log(category);
		console.log(action);
		console.log(label);
		ga('send', 'event', category, action, label, value);
	}
};
// initialize instance of SocialService object
var analyticsService = new gaEvents.AnalyticsService();

(function ( $ ) {
	// default settings
	gaEvents.settings = $.extend(gaEvents.settings, gaEvents.defaults);

	// adds a generic initalizer, although it's not needed, to set options.
	$.fn.gaEventTracker = function( options ) {
		gaEvents.settings = $.extend( {}, gaEvents.defaults, options );
	};


	$(function () {

	// default
	$('[data-ga-label]').on('click', function() {
		var 
			$this = $(this),
			category = gaEvents.getCategory($this),
			action = gaEvents.getAction($this),
			theAction = action ? action : gaEvents.settings.defaultEvent,
			label = gaEvents.getLabel($this),
			value = ""
		;
		
		if(typeof(category) !== "undefined") {
			analyticsService.trackEvent(category, theAction, label, value);
		}
	});

	// hover
	$('[data-ga-action="hover"]').on('mouseenter', function() {
		var 
			$this = $(this),
			category = gaEvents.getCategory($this),
			action = gaEvents.getAction($this),
			theAction = action ? action : 'hover',
			label = gaEvents.getLabel($this),
			value = ""
		;
		if(category) {
			analyticsService.trackEvent(category, theAction, label, value);
		}
	});


	// hover
	$('[data-ga-action="hoverout"]').on('mouseexit', function() {
		var 
			$this = $(this),
			action = gaEvents.getAction($this),
			theAction = action ? action : 'hoverout',
			category = gaEvents.getCategory($this),
			label = gaEvents.getLabel($this),
			value = ""
		;
		if(category) {
			analyticsService.trackEvent(category, theAction, label, value);
		}
	});
	// debugging

	if(gaEvents.getQueryVariable(gaEvents.settings.queryStringKey, gaEvents.settings.queryStringValue)) {

		gaEvents.debugMode = true;

		// add new element for debugging output
		$('body').append(gaEvents.template);

		// debug event sections
		$('[data-event-section]').on('mouseover', function(){
			$('[data-event-section]').removeClass('debug-highlight-event-section');
			$(this).addClass('debug-highlight-event-section');
			gaEvents.displayDebugInfo('event-section', $(this).data('eventSection'));
		});

		$('[data-event-section]').on('mouseout', function(){
			gaEvents.clearDebugInfo('event-section');
		});

		// debug categories
		$('[data-ga-category]').on('mouseover', function() {
			gaEvents.displayDebugInfo('category', $(this).data('gaCategory'));
		});

		// debug tracking info
		$('[data-tracking-info]').on('mouseover', function() {

			$('[data-tracking-info]').removeClass('debug-highlight-event');
			$(this).addClass('debug-highlight-event');
			gaEvents.displayDebugInfo('event', $(this).data('trackingInfo'));
		});

		// debug tracking info
		$('[data-tracking-info]').on('mouseout', function() {
			gaEvents.clearDebugInfo('event');
			gaEvents.clearDebugInfo('category');
		});
	}

	});

}( jQuery ));
