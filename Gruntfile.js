module.exports = function(grunt) {
  grunt.initConfig({
    info: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*!\n'+
              ' * <%= info.name %> - <%= info.description %>\n'+
              ' * v<%= info.version %>\n'+
              ' * <%= info.homepage %>\n'+
              ' * copyright <%= info.copyright %> <%= grunt.template.today("yyyy") %>\n'+
              ' * <%= info.license %> License\n'+
              '*/\n'
    },
    jshint: {
      main: [
        'grunt.js', 
        'lib/scripts/*.js'
      ]
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: 'lib/scripts/hubinfo.js',
        dest: 'dist/hubinfo.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: 'dist/hubinfo.js',
        dest: 'dist/hubinfo.min.js'
      }
    },
    less: {
      styles: {
        files: {
          'dist/hubinfo.css': 'lib/styles/hubinfo.less'
        }
      }
    },
    watch: {
      main: {
        files: '<%= jshint.main %>',
        tasks: 'default' 
      },
      ci: {
        files: [
          '<%= jshint.main %>'
        ],
        tasks: ['default']
      },
      styles: {
        files: 'lib/styles/*.less',
        tasks: ['styles']
      }
    },
    reloadr: {
      main: [
        'example/*',
        'dist/*'
      ]
    },
    connect: {
      server:{
        port: 8000,
        base: '.'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-reloadr');
  grunt.registerTask('default', ['styles', 'jshint', 'concat', 'uglify']);
  grunt.registerTask('dev', ['connect:server', 'reloadr', 'watch']);
  grunt.registerTask('ci', ['connect:server', 'watch:ci']);
  grunt.registerTask('styles', ['less']);
};