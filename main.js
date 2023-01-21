'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const fs = require('fs');

module.context.use(router);


// continued
router.get('/', function (req, res) {
  let path = `${module.context.basePath}/index.html`;
  let l = fs.read(path);
  res.set('content-type', "text/html")
  res.send(l);
});

// continued
router.get('/tree', function (req, res) {
	let sep=fs.pathSeparator;
  let base = module.context.basePath.split(sep).slice(0, -3).join(sep);

  let db = req.queryParams.db || module.context.basePath.split(sep).slice(-3)[0];
  let app = req.queryParams.app || module.context.basePath.split(sep).slice(-2)[0];
  let file = req.queryParams.file || 'manifest.json';
  let fullPath = [base,db,app,"APP"].join(sep);//`${base}/${db}/${app}/APP/`;
  let tree = fs.listTree(fullPath).filter(f=>fs.isFile(`${fullPath}${sep}${f}`));

  res.send({
    sep:sep,base:base,db:db,app:app,fullPath:fullPath,tree:tree
  });return;


  res.send(l);
});

// continued
router.get('/apps', function (req, res) {
	let sep=fs.pathSeparator;
  let base = module.context.basePath.split(sep).slice(0, -3).join(sep);

  let db = req.queryParams.db || "_system";
  let list = fs.list(`${base}/${db}`);
  res.send({ base: base, apps: list });
});

// continued
router.get('/file', function (req, res) {
	let sep=fs.pathSeparator;
  let base = module.context.basePath.split(sep).slice(0, -3).join(sep);

  let db = req.queryParams.db || module.context.basePath.split(sep).slice(-3)[0];
  let app = req.queryParams.app || module.context.basePath.split(sep).slice(-2)[0];
  let file = req.queryParams.file || 'manifest.json';

  let fullPath = `${base}/${db}/${app}/APP/${file}`;
  let l = fs.read(fullPath);

  //res.send(`{file:"${path}", content:"${l}"}`);
  res.send({ path: file, fullPath: fullPath, content: l });

});

// continued
router.put('/file', function (req, res) {
	let sep=fs.pathSeparator;
  let base = module.context.basePath.split(sep).slice(0, -3).join(sep);

  let db = req.queryParams.db || module.context.basePath.split(sep).slice(-3)[0];
  let app = req.queryParams.app || module.context.basePath.split(sep).slice(-2)[0];
  let file = req.queryParams.file || 'manifest.json';

  let fullPath = `${base}/${db}/${app}/APP/${file}`;


  let l = fs.write(fullPath, req.body);

  res.send(req);

});

