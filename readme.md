# Introduction

Easily track and debug Google Analytics events with this plugin. No initialization or set up required for basic features.

All you need to do is:

1. Include Google Analytics on your page.
2. Include GA Events Tracker in your Javascript
3. Add two data attributes to the elements in the page you want to track events against:
	* Category
	* Label

**Category** can be defined on a per-element basis, per-section / parent basis, or per-page basis.
**Label** must be defined on a per-element basis, but can support more complex names by concationation.  For more information read this section.


# Usage & Overview

Google Analytics supports tracking user events on the page, and can capture how users interact with your site.  This tool hopes to streamline adding events and allow for quick debugging.

The data that can be sent to GA when an event is fired is shown below:

* **Category** - Describes the object the user is interacting with. These usually correlate with page components. (e.g, "Carousel", "Video", "Call To Action", etc) - Required  
* **Action** - Describes the interaction the user is performing on the object. Default value sent for this plugin is "Click." (e.g, "Click", "Play", "Hover") - Required  
* **Label** - Describes the *individual* instance of the object the user is interacting with. Helps you determine which compoinents on the page is being interacted with. These names should be specific.  
* **Value** - A numeric value associated with the event.  

For more info on events, read the [GA documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)

For quickest, out of the box functionality, you can simply add the following data attributes to your markup:

```
<a href="buy-it-now.html" data-ga-category="buy-it-now" data-ga-label="widget">Buy Widget Now</a>
```
This would send the following data to Google Analytics:

* Category: `buy-it-now`  
* Action: `click`  
* Label: `widget`  

## Setting Category Precedence

If you had multiple "buy it now" buttons on the page, you can save some typing:

```
<section id="store" data-ga-category="buy-it-now">
  <h1>Store</h1>
  <div class="widget-1">
    <h2>Widget 1</h2>
    <a href="buy-it-now.html?item=widget-1" data-ga-label="widget-1">Buy Widget 1 Now</a>
  </div>
  <div class="widget-2">
    <h2>Widget 2</h2>
    <a href="buy-it-now.html?item=widget-2" data-ga-label="widget-2">Buy Widget 2 Now</a>
  </div>
</section>
```

Here, each individual anchor link tracks the unique `ga-label` that has been assigned to it (`widget-1` and `widget-2` respectively) but the plugin will assign the category of `buy-it-now` since it has a common ancestor in the markup - in this case, the `#store` section is a parent of both anchors.

This allows you to set categories on containers, or even on a page-level, instead of having to define them on an individual element basis.  Note that the code will first look in the element itself, and then travel up the DOM tree to find the closest `data-ga-category` element and apply that value to the element:

```
<body data-ga-category="global">
  <a href="/" data-ga-label="home">Back To Home Page</a>
  <section id="store" data-ga-category="store">
    <h1>Store</h1>
    <div class="widget-1">
      <h2>Widget 1</h2>
      <a href="buy-it-now.html?item=widget-1" data-ga-label="widget-1">Buy Widget 1 Now</a>
    </div>
    <div class="widget-2">
      <h2>Widget 2</h2>
      <a href="buy-it-now.html?item=widget-2" data-ga-label="widget-2" data-ga-category="buy-it-now">Buy Widget 2 Now</a>
    </div>
  </section>
</body>
```
The mappings below describe what data gets sent:

| Label | Category | Reason |
| ----- | ----- | ---- |
| home | global | `data-ga-category` was assigned to the `body` element. This value applies to any elements on the page that don't have a more-specific assignment. |
| widget-1 | store | `data-ga-category` was assigned to a parent element, `#store`. |
| widget-2 | buy-it-now | `data-ga-category` was assigned to actual element being interacted with. |

## Setting The Action

By default, the action sent to GA is `click`, but you can easily set a different value using the `data-ga-action` attribute.

The supported actions are:

* **click** - will fire when user clicks or taps the element (default)  
* **hover** - will fire when user mouses over the element  
* **hover-out** - will fire when user mouses out from the object  
* **hover-in-out** - will fire when user mouses over the element, and again when the user mouses out from the object  

sends a *hover* event when the user hovers over the element:
```
<a href="#" data-ga-action="hover" data-ga-label="some-button">Rollover To See More</a>
```

If you set a custom action name that is not supported, such as "play" or "touch" or anything else, that data will still get sent to GA but it will happen on the click event.

sends a *tap* event when the user clicks the element:
```
<a href="#" data-ga-action="tap" data-ga-label="some-button">Tap</a>
```

### Setting Multiple Actions

If you want to track multiple actions, simply use a comma-separated list of actions. Note that this works best with the supported actions.

```
<a href="#" data-ga-action="hover, click" data-ga-label="some-button">Rollover To See More, Click To Visit Page</a>
```

If you set multiple actions that are not supported, it will send them all on the click event, which could add more statistical noise to the analytics.