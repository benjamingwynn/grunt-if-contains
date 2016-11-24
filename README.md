# grunt-if-contains

> Executes Grunt tasks when a file or multiple files contain a string/regular expression

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-if-contains --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-if-contains');
```

## The "grunt-if-contains" task

### Overview
In your project's Gruntfile, add a section named `'grunt-if-contains'` to the data object passed into `grunt.initConfig()`. This example tests Javascript files in the project root, and if they contain 'use strict' it executes the JSLint Grunt task on them.

```js
grunt.initConfig({
	'grunt-if-contains': {
		my_task: { // call this whatever you want to identify your task
			src [
				// files to check if the string exists in
				'*.js'
			],

			options: {
				ifContains: "use strict",

				// tasks to execute if the string is true in a file
				tasks: {
					'jslint': {
						// options for grunt-jslint
						directives: {
							white: true
						}
					}
				}
			}
		}
	}
})
```

### Options

#### options.ifContains
Type: `String`

Required. String to test for in the files provided. See the other configuration options for how this string is parsed and tested against.

#### options.regExp
Type: `Boolean`
Default value: `false`

Whether to parse the query as a regular expression.

#### options.matchmode
Type: `String/Number`
Default value: `2`

The logic to use to check whether to execute the tasks listed in the config. You may either use the number or string provided.

##### 'all' (0)
Only execute the task if all of the files match the query.

##### 'none' (1)
Only execute the task if none of the files match the query.

##### 'individually-immediately'' (2)
Execute the task for each of the files that match the query, and execute them one-by-one.

##### 'individually-queue' (3)
Execute the task for each of the files that match the query, and wait until all files have been tested before executing them.

##### 'any' (4)
Execute the task for all of the files if any of the files match the query.

##### 'once-first' (5)
Execute the task for the first file that matches the query, and only that file.

##### 'once-last' (6)
Execute the task for the last file that matches the query, and only that file.

## Contributing
Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* 1.0.0: release of grunt-if-contains

## License
Copyright (c) 2016 Benjamin Gwynn. Licensed under the MIT license.
