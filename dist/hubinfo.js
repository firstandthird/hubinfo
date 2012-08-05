/*
  * hubInfo - a github repo widget 
  * v0.1.2
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

  var getLastCommits = function(user, repo, nbCommits, cb) {
    $.ajax({
      url: 'https://api.github.com/repos/'+user+'/'+repo+'/commits',
      dataType: 'jsonp',
      success: function(json) {
        var commits = json.data.slice(0, nbCommits);
        cb(commits);
      }
    });
  };

  var fetchData = function(user, repo, nbCommits, cb) {
    var count = 0;
    var total = 2;
    var projectInfo;
    var commitsInfo;
    var check = function() {
      if (count == total)
        cb(projectInfo, commitsInfo);
    };
    getProjectInfo(user, repo, function(project) {
      count++;
      projectInfo = project;
      check();
    });
    getLastCommits(user, repo, nbCommits, function(commits) {
      count++;
      commitsInfo = commits;
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

    fetchData(opts.user, opts.repo, opts.nbCommits, function(project, commits) {
      if (opts.debug) {
        console.log(arguments);
      }
      
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
            .end();

          for (var j in commits) {
            var jtem = commits[j];
            tmpl
              .find('.repo-commits')
                .append('<a class="repo-commit-message nb'+j+'"></a>')
                .append('<div class="repo-commit-date nb'+j+'">committed <span></span></div>')
                .end()
              .find('.repo-commit-message.nb'+j)
                .html(jtem.commit.message)
                .attr('href', 'https://github.com/'+opts.user+'/'+opts.repo+'/commit/' + jtem.sha)
                .end()
              .find('.repo-commit-date.nb'+j+' span')
                .html(relativeDate(jtem.commit.committer.date))
                .end();
          }

        var el = $(item);
        el.html(tmpl);
        el.trigger('render');
      
      });
    });
    return self;
  };

  $.fn.hubInfo.defaults = {
    user: '',
    repo: '',
    nbCommits: 1,
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
        '<div class="repo-commits"></div>',
      '</div>'
    ].join('')
  };
}(jQuery);
