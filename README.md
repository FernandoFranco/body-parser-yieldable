# Body Parser Yieldable

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Node.js body parsing middleware with yieldable-parse.

Parse incoming request bodies in a middleware before your handlers, available
under the `req.body` property.

**Note** As `req.body`'s shape is based on user-controlled input, all
properties and values in this object are untrusted and should be validated
before trusting. For example, `req.body.foo.toString()` may fail in multiple
ways, for example the `foo` property may not be there or may not be a string,
and `toString` may not be a function and instead a string or other user input.

[Learn about the anatomy of an HTTP transaction in Node.js](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/).

_This does not handle multipart bodies_, due to their complex and typically
large nature.

## Installation

```sh
$ npm install body-parser-yieldable
```

## API

```js
const bodyParserYieldable = require('body-parser-yieldable');

const jsonParser = bodyParserYieldable([options]);
```

### bodyParserYieldable([options])

Returns middleware that only parses `json` and only looks at requests where
the `Content-Type` header matches the `type` option. This parser accepts any
Unicode encoding of the body and supports automatic inflation of `gzip` and
`deflate` encodings.

A new `body` object containing the parsed data is populated on the `request`
object after the middleware (i.e. `req.body`).

#### Options

The function takes an optional `options` object that may contain any of
the following keys:

##### inflate

When set to `true`, then deflated (compressed) bodies will be inflated; when
`false`, deflated bodies are rejected. Defaults to `true`.

##### limit

Controls the maximum request body size. If this is a number, then the value
specifies the number of bytes; if it is a string, the value is passed to the
[bytes](https://www.npmjs.com/package/bytes) library for parsing. Defaults
to `'100kb'`.

##### reviver

The `reviver` option is passed directly to `yieldableJSON.parseAsync` as the second
argument. You can find more information on this argument
[in the README documentation about APIs/parseAsync/reviver](https://github.com/ibmruntimes/yieldable-json).

##### intensity

The `intensity` option is passed directly to `yieldableJSON.parseAsync` as the third
argument. You can find more information on this argument
[in the README documentation about APIs/parseAsync/intensity](https://github.com/ibmruntimes/yieldable-json).

##### strict

When set to `true`, will only accept arrays and objects; when `false` will
accept anything `yieldableJSON.parseAsync` accepts. Defaults to `true`.

##### type

The `type` option is used to determine what media type the middleware will
parse. This option can be a string, array of strings, or a function. If not a
function, `type` option is passed directly to the
[type-is](https://www.npmjs.org/package/type-is#readme) library and this can
be an extension name (like `json`), a mime type (like `application/json`), or
a mime type with a wildcard (like `*/*` or `*/json`). If a function, the `type`
option is called as `fn(req)` and the request is parsed if it returns a truthy
value. Defaults to `application/json`.

##### verify

The `verify` option, if supplied, is called as `verify(req, res, buf, encoding)`,
where `buf` is a `Buffer` of the raw request body and `encoding` is the
encoding of the request. The parsing can be aborted by throwing an error.

## Examples

### Express/Connect top-level generic

This example demonstrates adding a generic JSON and URL-encoded parser as a
top-level middleware, which will parse the bodies of all incoming requests.
This is the simplest setup.

```js
const express = require('express');
const bodyParser = require('body-parser');
const bodyParserYieldable = require('body-parser-yieldable');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json in async mode
app.use(bodyParserYieldable());

app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.write('you posted:\n');
  res.end(JSON.stringify(req.body, null, 2));
})
```

### Express route-specific

This example demonstrates adding body parsers specifically to the routes that
need them. In general, this is the most recommended way to use body-parser with
Express.

```js
const express = require('express');
const bodyParser = require('body-parser');
const bodyParserYieldable = require('body-parser-yieldable');

var app = express();

// create application/json async parser
var jsonParser = bodyParserYieldable();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
  res.send('welcome, ' + req.body.username);
});

// POST /api/users gets JSON bodies
app.post('/api/users', jsonParser, function (req, res) {
  // create user in req.body
});
```

### Change accepted type for parsers

All the parsers accept a `type` option which allows you to change the
`Content-Type` that the middleware will parse.

```js
const express = require('express');
const bodyParser = require('body-parser');
const bodyParserYieldable = require('body-parser-yieldable');

var app = express();

// parse various different custom JSON types as JSON
app.use(bodyParserYieldable({ type: 'application/*+json' }));

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }));
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/body-parser-yieldable.svg
[npm-url]: https://npmjs.org/package/body-parser-yieldable
[travis-image]: https://img.shields.io/travis/expressjs/body-parser-yieldable/master.svg
[travis-url]: https://travis-ci.org/expressjs/body-parser-yieldable
[coveralls-image]: https://img.shields.io/coveralls/expressjs/body-parser-yieldable/master.svg
[coveralls-url]: https://coveralls.io/r/expressjs/body-parser-yieldable?branch=master
[downloads-image]: https://img.shields.io/npm/dm/body-parser-yieldable.svg
[downloads-url]: https://npmjs.org/package/body-parser-yieldable
