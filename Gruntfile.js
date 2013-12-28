module.exports = function (grunt) {
  var files = ['lib/utils/*.js', 'lib/*.js', 'lib/systems/*.js', 'lib/managers/*.js'];
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n\n',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        src: files,
        dest: '<%= pkg.name %>.js'
      }
    },
    jshint: {
      beforeconcat: files,
      afterconcat: ['<%= pkg.name %>.js']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '<%= pkg.name %>.js',
        dest: '<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'jshint']);
};