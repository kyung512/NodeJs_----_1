var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');

var template = require('./lib/template.js');

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function (error, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var html = template.HTML(list, title, 
          `<h2>${title}</h2>${description}`,  
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });

    } else {
      fs.readdir('./data', function (error, filelist) {
        var filteredId = path.parse(queryData.id).base;
        console.log(filteredId);
        fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.HTML(list, title, 
            `<h2>${title}</h2>${description}`,  
            `<a href="/create">create</a>
             <a href="/update?id=${title}">update</a>
             <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
             </form> 
           `
          );
          response.writeHead(200);
          response.end(html);
        });
      });
 
    }
  } else if (pathname === '/create') {
    fs.readdir('./data', function (error, filelist) {
      var title = 'WEB - create';
      var description = 'Hello, Node.js';
      var list = template.list(filelist);
      var html = template.HTML(list, title, `
        <form action="/create_process" method="post">
        <input type="text" name="title" placeholder="title">     
        <p>
          <textarea name="description" cols="30" rows="10" placeholder="description"></textarea>      
        </p>
        <input type="submit">    
        </form>
    `, '');
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === '/create_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      });
    });
  } else if (pathname === '/update') {
    fs.readdir('./data', function (error, filelist) {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.HTML(list, title, `
        <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${title}" >
        <input type="text" name="title" placeholder="title" value="${title}">     
        <p>
          <textarea name="description" cols="30" rows="10" placeholder="description">${description}</textarea>      
        </p>
        <input type="submit">    
        </form>
        `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === '/update_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(err) {
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
    });
  } else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, function(error) {     
        response.writeHead(302, {Location: `/`});
        response.end();
      })
    });

  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
  

});

app.listen(3000);