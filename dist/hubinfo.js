/*!
  * hubInfo - a github repo widget 
  * v0.0.1
  * https://github.com/jgallen23/hubinfo
  * copyright JGA 2012
  * MIT License
  */

!function($) {
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
    var projectInfo;
    var lastCommit;
    var check = function() {
      if (count == total)
        cb(projectInfo, lastCommit);
    };
    getProjectInfo(user, repo, function(project) {
      count++;
      projectInfo = project;
      check();
    });
    getLastCommit(user, repo, function(commit) {
      count++;
      lastCommit = commit;
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

    fetchData(opts.user, opts.repo, function(project, lastCommit) {
      if (opts.debug)
        console.log(data);
      
      self.each(function(i, item) {
        var tmpl = $(opts.template);
        tmpl
          .find('.repo-lang')
            .html(project.language)
            .end()
          .find('.repo-watchers')
            .html(project.watchers)
            .attr('href', project.html_url)
            .end()
          .find('.repo-forks')
            .html(project.forks)
            .attr('href', project.html_url)
            .end()
          .find('.repo-name')
            .html(project.name)
            .attr('href', project.html_url)
            .end()
          .find('.repo-commit-message')
            .html(lastCommit.message)
            .attr('href', 'http://github.com'+lastCommit.url)
            .end()
          .find('.repo-commit-date span')
            .html(relativeDate(lastCommit.committed_date))
            .end();

        var el = $(item);
        el.html(tmpl);
      
      });
    });
    return self;
  };

  $.fn.hubInfo.defaults = {
    user: '',
    repo: '',
    debug: false,
    template: [
      '<div class="github-repo">',
        '<div class="repo-header">',
          '<div class="repo-stats">',
            '<span class="repo-lang"></span>',
            '<a class="repo-watchers"></a>',
            '<a class="repo-forks"></a>',
          '</div>',
          '<div>',
            '<a class="repo-name"></a>',
          '</div>',
        '</div>',
        '<div class="repo-commit">',
          '<a class="repo-commit-message"></a>',
          '<div class="repo-commit-date">committed <span></span></div>',
        '</div>',
      '</div>'
    ].join('')
  };
}(jQuery);
