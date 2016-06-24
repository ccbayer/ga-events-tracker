var gaEvents = window.gaEvents || {};

$.extend(window.gaEvents,
{
	AnalyticsService: function(){},
	defaults: {
		gaObjectName: "ga",
		whitelist: [],
		queryStringKey: "debug",
		queryStringValue: "true",
		defaultAction: "click"
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
	getParentLabel: function ($el,whichLabel) {
		var 
			returnVal = '',
			label = $el.closest('[data-ga-'+ whichLabel +'-label]').attr('data-ga-'+ whichLabel +'-label')
		;
		if (typeof(label != "undefined") && label.length > 0) {
			returnVal = label + '_'
		}
		return returnVal;
	},
	getLabel: function($el) {
		var
			pageLabel = gaEvents.getParentLabel($el, 'page'),
			sectionLabel = gaEvents.getParentLabel($el, 'section'),
			thisElLabel = $el.data('gaLabel')
		;
		if(thisElLabel.length > 0) {
			return pageLabel + sectionLabel + thisElLabel;
		} else {
			console.log('Missing required data attribute: data-ga-label');
			return false;
		}
	},
	getValue: function($el) {
		return $el.data('gaValue');
	},
	getAction: function($el) {
		return $el.data('gaAction');
	},
	getCategory: function($el) {
		var cat = $el.data('gaCategory') ? $el.data('gaCategory') : $el.closest('data-ga-category').data('gaCategory');
		return cat;
	},
	template: `
	<div id="ga-debug-message">
		<div><strong>Category:</strong> <span id="debug-category"></span></div>
		<div><strong>Action:</strong> <span id="debug-action"></span></div>
		<div><strong>Label:</strong> <span id="debug-label"></span></div>
		<div><strong>Value:</strong> <span id="debug-value"></span></div>
	</div>`
});

gaEvents.AnalyticsService.prototype = {
	trackEvent: function(category, action, label, value) {
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
			theAction = action ? action : gaEvents.settings.defaultAction,
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
		var pageSectionLabelDebugMessage = function(which, value) { 
			return `<div class="debug-label-section-msg debug-label-${which}" id="debug-label-${which}"><strong>Label - ${which}:</strong> <span>${value}</span></div>`;
		}

		// add new element for debugging output
		$('body').append(gaEvents.template);

		// page / section labels
		$('[data-ga-page-label], [data-ga-section-label]').on('mouseover', function() {
			var 
				$this = $(this),
				which = $this.data('gaPageLabel') ? 'page' : 'section',
				output = pageSectionLabelDebugMessage(which, $this.attr('data-ga-' + which +'-label'));
			;
			$this.addClass('debug-position-relative debug-label-' + which).append(output);
		});

		$('[data-ga-page-label], [data-ga-section-label]').on('mouseout', function() {
			var 
				$this = $(this),
				which = $this.data('gaPageLabel') ? 'page' : 'section',
				output = pageSectionLabelDebugMessage(which, $this.attr('data-ga-page-label'));
			;
			$this.removeClass('debug-position-relative debug-label-' + which);
			$this.find('debug-label-section-msg').remove();
		});

		// label & action
		$('[data-ga-label]').on('mouseover', function() {
			var 
				label = gaEvents.getLabel($(this)),
				action = $(this).data('gaAction') ? $(this).data('gaAction') : gaEvents.settings.defaultAction
			;
			gaEvents.displayDebugInfo('action', action);
			gaEvents.displayDebugInfo('label', label);
		});

		// debug categories
		$('[data-ga-category]').on('mouseover', function() {
			gaEvents.displayDebugInfo('category', $(this).data('gaCategory'));
		});

		// debug tracking info
		$('[data*=ga-]').on('mouseout', function() {
			gaEvents.clearDebugInfo('event');
			gaEvents.clearDebugInfo('category');
		});
	}

	});

}( jQuery ));