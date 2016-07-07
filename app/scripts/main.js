var fs = require('fs');
var dust = require('dustjs-linkedin');
var express = require('express');
var app = express();
// var request = require('request');

/**
 * compiling on the server, avoid in production!
 */

var appRoot = process.cwd();
var src = fs.readFileSync(appRoot + '/app/views/hello-world.dust', 'utf8');
var compiled = dust.compile(src, 'say-hello-world');
// var compiled = dust.compile("Say hello {world}", 'say-hello-world');
dust.loadSource(compiled);
dust.render('say-hello-world', { world: "Venus" }, function(err, out) {
  // `out` contains the rendered output.
  console.log(out);
});


var templateName = 'hello-world';

// Pre-2.7
fs.readFile(appRoot +'/app/lib/' + templateName + '.js', { encoding: 'utf8' }, function(err, data) {
  dust.loadSource(data);
  dust.render(templateName, { world: "Pluto" }, function(err, out) {
    console.log(out);
  });
});

/**
 *  When loading multiple templates, tell dust how load them on the fly
 *  http://www.dustjs.com/guides/onload/
 */
dust.onLoad = function(tmpl, options, cb) {
  fs.readFile(appRoot + '/app/views/' + tmpl + '.dust',
              { encoding: 'utf8' }, cb);
};



// Precompile as CommonJS modules-- as of Dust 2.7
// require(appRoot+'/app/lib/' + templateName + '.js')(dust);
// callback();

app.get('/hello', function(req, res) {

	dust.render("hello-world", { "world": "Moon"}, function (err, out) {
			res.send(out);
		});

	// dust.stream("hello-world", {
	//     	"world": "Sun"
	//   	}).pipe(res);

});


app.listen(3010, function () {
  console.log('Visit http://localhost:3010 to see streaming!');
});
