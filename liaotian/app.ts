import * as http from 'http';
import * as fs from 'fs';
import * as url from 'url';
import * as querystring from 'querystring';

const forbidden = (f: string) => `
	<!doctype html>
	<html>
		<head>
			<meta charset="utf-8">
			<meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
			<title>403 forbidden</title>
		</head>
		<body>
			<h1>没有权限访问此页面:f</h1>
		</body>
	</html>
`;
const password = 'che-chat-admin-password-chehtqw370883';

let app: http.Server = http.createServer(function (req: http.IncomingMessage, res: http.ServerResponse) {
	let q: { [key: string]: any };
	let pathname: string;
	const r: RegExp = /\/+/g;
	q = querystring.parse(url.parse(req.url as string).query || '');
	pathname = url.parse(req.url as string).pathname as string;
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
				const user: { [key: string]: any } = JSON.parse(fs.readFileSync('./users.json').toString());
				const chats: [object] = JSON.parse(fs.readFileSync('./chats.json').toString());
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
			} catch {
				res.end('error');
			}
			break;
		case '/login':
			try {
				const user: { [key: string]: any } = JSON.parse(fs.readFileSync('./users.json').toString());
				if (user[q.user].password === q.password) {
					res.end('success');
				} else {
					throw 'err';
				}
			} catch {
				res.end('error');
			}
			break;
		case '/setup':
			try {
				const user: { [key: string]: any } = JSON.parse(fs.readFileSync('./users.json').toString());
				if (user[q.user] === undefined) {
					user[q.user] = {
						password: q.password,
						op: false
					};
					fs.writeFileSync('./users.json', JSON.stringify(user));
					res.end('success');
				} else {
					throw 'err';
				}
			} catch {
				res.end('error');
			}
			break;
		case '/admin':
			res.writeHead(200, {
				'Content-Type': 'text/html;charset=utf-8'
			});
			if (q.password === password) {
				res.end(fs.readFileSync('./admin.html').toString());
			} else {
				res.end(forbidden(pathname));
			}
			break;
		case '/getUsers':
			if (q.password === password) {
				res.writeHead(200, {
					'Content-Type': 'application/json;charset=utf-8'
				});
				res.end(fs.readFileSync('./users.json').toString());
			} else {
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
				try{
					fs.writeFileSync('./users.json', q.msg);
				}catch{
					res.end("error");
				}
			} else {
				res.writeHead(200, {
					'Content-Type': 'text/html;charset=utf-8'
				});
				res.end(forbidden(pathname));
			}
			break;
		case '/editChats':
			if (q.password === password) {
				try{
					fs.writeFileSync('./chats.json', q.msg);
				}catch{
					res.end("error");
				}
			} else {
				res.writeHead(200, {
					'Content-Type': 'text/html;charset=utf-8'
				});
				res.end(forbidden(pathname));
			}
			break;
		default:
			res.end(`
				<!doctype html>
					<html>
						<head>
							<meta charset="utf-8">
							<meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
							<title>404 Not Found</title>
						</head>
						<body>
							<h1>找不到此API或页面：${pathname}</h1>
						</body>
					</html>
				`);
			break;
	}
});

app.listen(80);
