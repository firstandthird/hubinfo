!function($) {
  // Simple JavaScript Templating
  // John Resig - http://ejohn.org/ - MIT Licensed
  (function(){
    var cache = {};
    this.tmpl = function tmpl(str, data){
      // Figure out if we're getting a template, or if we need to
      // load the template - and be sure to cache the result.
      var fn = !/\W/.test(str) ?
        cache[str] = cache[str] ||
          tmpl(document.getElementById(str).innerHTML) :
        
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
          "var p=[],print=function(){p.push.apply(p,arguments);};" +
          
          // Introduce the data as local variables using with(){}
          "with(obj){p.push('" +
          
          // Convert the template into pure JavaScript
          str
            .replace(/[\r\t\n]/g, " ")
            .split("{!").join("\t")
            .replace(/((^|!})[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)!}/g, "',$1,'")
            .split("\t").join("');")
            .split("!}").join("p.push('")
            .split("\r").join("\\'")
        + "');}return p.join('');");
      
      // Provide some basic currying to the user
      return data ? fn( data ) : fn;
    };
  })();

  var getProjectInfo = function(user, repo, cb) {
    $.ajax({
      url: 'https://api.github.com/repos/'+user+'/'+repo,
      dataType: 'jsonp',
      success: function(res) {
        if (res.data.message == 'Not Found')
          throw new Error('Invalid user or repo');
        cb(res.data);
      }
    });
  };

  var getLastCommit = function(user, repo, cb) {
    $.ajax({
      url: 'http://github.com/api/v2/json/commits/list/'+user+'/'+repo+'/master',
      dataType: 'jsonp',
      success: function(json) {
        var latest = json.commits[0];
        cb(latest);
      }
    });
  };

  var fetchData = function(user, repo, cb) {
    var count = 0;
    var total = 2;
    var data = {};
    var check = function() {
      if (count == total)
        cb(data);
    };
    getProjectInfo(user, repo, function(project) {
      count++;
      data.project = project;
      check();
    });
    getLastCommit(user, repo, function(commit) {
      count++;
      data.commit = commit;
      check();
    });
  };

  var relativeDate = function(date) {
    if (typeof date === 'string') {
      var d = date.split('T')[0].split('-');
      date = new Date(d[0], d[1]-1, d[2]);
    }
    var today = new Date().getTime();
    var diff = today - date.getTime();
    var seconds = diff / 1000;
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) {
      return 'today';
    } else if (days > 30) {
      return Math.floor(days / 30) + ' month(s) ago';
    }
    return days + ' day(s) ago';
  };

  $.fn.hubInfo = function(options) {
    var opts = $.extend({}, $.fn.hubInfo.defaults, options);
    var self = this;

    fetchData(opts.user, opts.repo, function(data) {
      if (opts.debug)
        console.log(data);
      data.relativeDate = relativeDate;
      
      var template = tmpl(opts.template, data);
      self.each(function(i, item) {
        var el = $(item);
        el.html(template);
      
      });
    });
    return self;
  };

  $.fn.hubInfo.defaults = {
    user: '',
    repo: '',
    debug: false,
    template: '' 
  };
}(jQuery);
