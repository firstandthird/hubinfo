# HubInfo

HubInfo is a jQuery plugin to show information about your GitHub repo.  Here is an example:


## Download

- Production [js](https://raw.github.com/jgallen23/hubinfo/master/dist/hubinfo.min.js) / [css](https://raw.github.com/jgallen23/hubinfo/master/dist/hubinfo.min.css)
- Development [js](https://raw.github.com/jgallen23/hubinfo/master/dist/hubinfo.js) / [css](https://raw.github.com/jgallen23/hubinfo/master/dist/hubinfo.css)
- [Source](http://github.com/jgallen23/hubinfo)

## Usage
Include hubinfo.js and hubinfo.css on your page and then put this in a script tag:

	$("#hubInfo").hubInfo({ 
		user: "jgallen23",
		repo: "hubinfo"
	});

## Advanced
Out of the box, the twitter share widget isn't there, but if you want to add it, you can do something like this:

	var hubInfo = $("#hubInfo").hubInfo({ 
		user: "jgallen23",
		repo: "hubinfo"
	});

	hubInfo.on('render', function() {
		$('<a href="https://twitter.com/share" class="twitter-share-button" data-via="JGAui">Tweet</a>').insertAfter('.repo-forks');
		!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
	});

## History

[View](https://raw.github.com/jgallen23/hubinfo/master/history.md)

## Contributors
- Greg Allen ([@jgaui](http://twitter.com/jgaui)) [jga.me](http://jga.me)
