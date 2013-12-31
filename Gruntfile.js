module.exports = function (grunt) {
  var files = ['lib/**/!(artemis).js', 'lib/artemis.js'];
  var webGlobalVar = 'artemis';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n\n',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n\n' +
          '(function (root, factory) {\n' +
          '  if (typeof define === \'function\' && define.amd) {\n' +
          '    define(factory);\n' +
          '  } else if (typeof exports === \'object\') {\n' +
          '    module.exports = factory();\n' +
          '  } else {\n' +
          '    root.' + webGlobalVar + ' = factory();\n' +
          '  }\n' +
          '}(this, function () {\n',
        footer: '\n\n  return artemis;\n}));'
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