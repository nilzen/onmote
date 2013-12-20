module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      libs: {
        files: [
          { 
            expand: true,
            flatten: true,
            src: [
              'bower_components/angular/angular.js',
              'bower_components/angular/angular.min.js',
              'bower_components/angular/angular.min.js.map',
              'bower_components/underscore/underscore.js',
              'bower_components/underscore/underscore-min.js',
              'bower_components/underscore/underscore-min.map'
            ],
            dest: 'public/js/libs/'
          }
        ]
      }
    },
    bower: {
      install: {
        options: {
          copy: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['bower', 'copy']);
};