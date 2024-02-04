"use strict";
exports.__esModule = true;
var http = require("http");
var fs = require("fs");
var url = require("url");
var querystring = require("querystring");
var forbidden = function (f) { return "\n\t<!doctype html>\n\t<html>\n\t\t<head>\n\t\t\t<meta charset=\"utf-8\">\n\t\t\t<meta charset=\"utf-8\" name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no\">\n\t\t\t<title>403 forbidden</title>\n\t\t</head>\n\t\t<body>\n\t\t\t<h1>\u6CA1\u6709\u6743\u9650\u8BBF\u95EE\u6B64\u9875\u9762:f</h1>\n\t\t</body>\n\t</html>\n"; };
var password = 'che-chat-admin-password-chehtqw370883';
var app = http.createServer(function (req, res) {
    var q;
    var pathname;
    var r = /\/+/g;
    q = querystring.parse(url.parse(req.url).query || '');
    pathname = url.parse(req.url).pathname;
    pathname = pathname.replace(r, '(.,)');
    while (pathname.indexOf('(.,)') !== -1) {
        pathname = pathname.replace('(.,)', '/');
    }
    pathname = pathname;
    switch (pathname) {
        case '/favicon.png':
            res.writeHead(200, {
                'Content-Type': 'image/png'
            });
            res.end(fs.readFileSync('./favicon.png').toString());
            break;
        case '/':
            res.writeHead(200, {
                'Content-Type': 'text/html;charset=utf-8'
            });
            res.end(fs.readFileSync('./index.html').toString());
            break;
        case '/get':
            res.writeHead(200, {
                'Content-Type': 'application/json;charset=utf-8'
            });
            res.end(fs.readFileSync('./chats.json').toString());
            break;
        case '/post':
            try {
                var user = JSON.parse(fs.readFileSync('./users.json').toString());
                var chats = JSON.parse(fs.readFileSync('./chats.json').toString());
                if (user[q.user].password !== q.password) {
                    throw 'error';
                }
                chats.push({
                    chat: q.chat,
                    user: q.user,
                    op: user[q.user].op
                });
                fs.writeFileSync('./chats.json', JSON.stringify(chats));
                res.end('success');
            }
            catch (_a) {
                res.end('error');
            }
            break;
        case '/login':
            try {
                var user = JSON.parse(fs.readFileSync('./users.json').toString());
                if (user[q.user].password === q.password) {
                    res.end('success');
                }
                else {
                    throw 'err';
                }
            }
            catch (_b) {
                res.end('error');
            }
            break;
        case '/setup':
            try {
                var user = JSON.parse(fs.readFileSync('./users.json').toString());
                if (user[q.user] === undefined) {
                    user[q.user] = {
                        password: q.password,
                        op: false
                    };
                    fs.writeFileSync('./users.json', JSON.stringify(user));
                    res.end('success');
                }
                else {
                    throw 'err';
                }
            }
            catch (_c) {
                res.end('error');
            }
            break;
        case '/admin':
            res.writeHead(200, {
                'Content-Type': 'text/html;charset=utf-8'
            });
            if (q.password === password) {
                res.end(fs.readFileSync('./admin.html').toString());
            }
            else {
                res.end(forbidden(pathname));
            }
            break;
        case '/getUsers':
            if (q.password === password) {
                res.writeHead(200, {
                    'Content-Type': 'application/json;charset=utf-8'
                });
                res.end(fs.readFileSync('./users.json').toString());
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'text/html;charset=utf-8'
                });
                res.end(forbidden(pathname));
            }
            break;
        case '/vue':
            res.writeHead(200, {
                'Content-Type': 'text/javascript;charset=utf-8'
            });
            res.end(fs.readFileSync('./vue.js'));
            break;
        case '/jquery':
            res.writeHead(200, {
                'Content-Type': 'text/javascript;charset=utf-8'
            });
            res.end(fs.readFileSync('./jquery.min.js'));
            break;
        case '/editUsers':
            if (q.password === password) {
                try {
                    fs.writeFileSync('./users.json', q.msg);
                }
                catch (_d) {
                    res.end("error");
                }
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'text/html;charset=utf-8'
                });
                res.end(forbidden(pathname));
            }
            break;
        case '/editChats':
            if (q.password === password) {
                try {
                    fs.writeFileSync('./chats.json', q.msg);
                }
                catch (_e) {
                    res.end("error");
                }
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'text/html;charset=utf-8'
                });
                res.end(forbidden(pathname));
            }
            break;
        default:
            res.end("\n\t\t\t\t<!doctype html>\n\t\t\t\t\t<html>\n\t\t\t\t\t\t<head>\n\t\t\t\t\t\t\t<meta charset=\"utf-8\">\n\t\t\t\t\t\t\t<meta charset=\"utf-8\" name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no\">\n\t\t\t\t\t\t\t<title>404 Not Found</title>\n\t\t\t\t\t\t</head>\n\t\t\t\t\t\t<body>\n\t\t\t\t\t\t\t<h1>\u627E\u4E0D\u5230\u6B64API\u6216\u9875\u9762\uFF1A".concat(pathname, "</h1>\n\t\t\t\t\t\t</body>\n\t\t\t\t\t</html>\n\t\t\t\t"));
            break;
    }
});
app.listen(80);
//# sourceMappingURL=app.js.map