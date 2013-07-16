'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var ZineBakerGenerator = module.exports = function ZineBakerGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	// setup the test-framework property, Gruntfile template will need this
	this.testFramework = options['test-framework'] || 'mocha';


	// for hooks to resolve on mocha by default
	if (!options['test-framework']) {
		options['test-framework'] = 'mocha';
	}
	// resolved to mocha by default (could be switched to jasmine for instance)
	this.hookFor('test-framework', { as: 'app' });


	// initial index.html file
	this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
	// initial main.css file
	this.mainLessFile = this.readFileAsString(path.join(this.sourceRoot(), 'main.less'));


	this.on('end', function () {
		this.installDependencies({ skipInstall: options['skip-install'] });
	});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(ZineBakerGenerator, yeoman.generators.Base);



ZineBakerGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// have Yeoman greet the user.
	console.log(this.yeoman);

	// user prompts during install
	var prompts = [{
		name: 'pubAuthor',
		message: 'What is the author/editor\s name?'
	}, {
		name: 'pubName',
		message: 'What do you want to call your zine?'
	}, {
		name: 'jsBootstrap',
		message: 'Would you like to install Bootstrap Javascript files?',
		default: 'Y/n',
		warning: 'Yes: ...just do it'
	}, {
		name: 'jsLettering',
		message: 'Would you like to install Lettering.js?',
		default: 'Y/n',
		warning: 'Yes: of course you want to control your typefaces'
	}, {
		name: 'jsRetina',
		message: 'Would you like to install Retina.js',
		default: 'Y/n',
		warning: 'Yes: of course you want support for retina displays much easier'
	}, {
		name: 'jsPaper',
		message: 'Would you like to install Paper.js?',
		default: 'Y/n',
		warning: 'Yes: a framework for canvas drawing http://paperjs.org/'
	}];

	this.prompt(prompts, function (props) {
		this.pubAuthor = props.pubAuthor;
		this.pubName = props.pubName;
		this.jsBootstrap = (/y/i).test(props.jsBootstrap);
		this.jsLettering = (/y/i).test(props.jsLettering);
		this.jsRetina = (/y/i).test(props.jsRetina);
		this.jsPaper = (/y/i).test(props.jsPaper);

		cb();
	}.bind(this));

};



ZineBakerGenerator.prototype.projectfiles = function projectfiles() {
	// grunt.js file
	this.copy('Gruntfile.js');

	// package.json file
	this.copy('_package.json', 'package.json');

	// bower files
	this.copy('bowerrc', '.bowerrc');
	this.copy('_bower.json', 'bower.json');

	// git files
	this.copy('gitignore', '.gitignore');
	this.copy('gitattributes', '.gitattributes');

	// editor config files
	this.copy('editorconfig', '.editorconfig');

	// js hint files
	this.copy('jshintrc', '.jshintrc');

	// main.js file
	this.copy('main.js', 'app/scripts/main.js');

	// app iconfiles
	this.copy('application-icon-72x72.png', 'app/images/application-icon-72x72.png');
	this.copy('application-icon-114x114.png', 'app/images/application-icon-114x114.png');
	this.copy('application-icon-144x144.png', 'app/images/application-icon-144x144.png');

	// book.json file
	this.copy('_book.json', 'app/book.json');
};



ZineBakerGenerator.prototype.writeLess = function writeLess() {
	var contentText = [];

	if (this.jsRetina) {
		contentText = ['@import \"../bower_components/retina.js-js/src/retina.less\"'];
	}

	// append additionally loaded Less modules
	var insertPoint = 'Additional Less modules\n *\n *	------------------------------------------------------------------------ */\n';
	this.mainLessFile = this.mainLessFile.replace(insertPoint, insertPoint + contentText.join('\n'));

	// copy the rest of the less files
	this.copy('app.less', 'app/styles/app.less');
	this.copy('media-queries.less', 'app/styles/media-queries.less');
	this.copy('typography.less', 'app/styles/typography.less');
};



ZineBakerGenerator.prototype.writeIndex = function writeIndex() {
	// prepare default content text
	// var defaults = ['HTML5 Boilerplate', 'Twitter Bootstrap'];

	var contentText = [
		'\t\t',
		'\t\t',
		'\t\t',
		'\t\t<!-- ARTICLE CONTENT BEGIN -->',
		'\t\t<div class="article">',
		'\t\t	<div class="pages">',
		'\t\t',
		'\t\t',
		'\t\t		<!-------------------------------------------------------------------------',
		'\t\t		 -',
		'\t\t		 -  Page 1',
		'\t\t		 -',
		'\t\t		 - ------------------------------------------------------------------------ -->',
		'\t\t		<div class="page">',
		'\t\t			\'Allo, \'Allo!',
		'\t\t		</div> <!-- end page -->',
		'\t\t',
		'\t\t',
		'\t\t	</div> <!-- end pages -->',
		'\t\t</div> <!-- end article -->'
	];


	this.indexFile = this.appendScripts( this.indexFile, 
		'scripts/main.js',
		[
			'scripts/main.js'
		]
	);


	if (this.jsLettering) {
		this.indexFile = this.appendScripts(this.indexFile, 'scripts/vendor/jquery.js', [
			'bower_components/Lettering.js/jquery.lettering.js'
		]);
	}


	if (this.jsRetina) {
		this.indexFile = this.appendScripts(this.indexFile, 'scripts/main.js', [
			'bower_components/retina.js-js/src/retina.js'
		]);
	}


	if (this.jsBootstrap) {
		// wire Twitter Bootstrap plugins
		this.indexFile = this.appendScripts(this.indexFile, 'scripts/vendor/bootstrap.js', [
			'bower_components/bootstrap/js/bootstrap-affix.js',
			'bower_components/bootstrap/js/bootstrap-alert.js',
			'bower_components/bootstrap/js/bootstrap-dropdown.js',
			'bower_components/bootstrap/js/bootstrap-tooltip.js',
			'bower_components/bootstrap/js/bootstrap-modal.js',
			'bower_components/bootstrap/js/bootstrap-transition.js',
			'bower_components/bootstrap/js/bootstrap-button.js',
			'bower_components/bootstrap/js/bootstrap-popover.js',
			'bower_components/bootstrap/js/bootstrap-typeahead.js',
			'bower_components/bootstrap/js/bootstrap-carousel.js',
			'bower_components/bootstrap/js/bootstrap-scrollspy.js',
			'bower_components/bootstrap/js/bootstrap-collapse.js',
			'bower_components/bootstrap/js/bootstrap-tab.js'
		]);
	}


	if (this.jsPaper) {
		this.indexFile = this.appendScripts(this.indexFile, 'scripts/vendor/paper.js', [
			// i only include the core ... because all we
			// wire up paper.js directly with javascript
			// https://twitter.com/PaperJS/statuses/352849799407599616
			'bower_components/paper/dist/paper-core.js',
			// pack my personal paper.js library together
			'bower_components/frederickkPaper/distribution/FrederickkPaper.js'
		]);
	}


	// append the default content
	this.indexFile = this.indexFile.replace('<body>', '<body>\n' + contentText.join('\n'));
};



ZineBakerGenerator.prototype.app = function app() {
	// create basic structure
	this.mkdir('app');
	this.mkdir('app/copy');
	this.mkdir('app/images');
	this.mkdir('app/scripts');
	this.mkdir('app/styles');
	this.mkdir('app/typefaces');

	// create index files
	this.write('app/index.html', this.indexFile);
	this.write('app/styles/main.less', this.mainLessFile);
};




