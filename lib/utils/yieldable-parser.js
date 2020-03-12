var yieldableJSON = require('yieldable-json');

module.exports = function parser(body, reviver, intensity, callback) {
  yieldableJSON.parseAsync(body, reviver, intensity, function parseAsync(err, obj) {
    if (err) callback(new SyntaxError(err.message));
    else callback(null, obj);
  });
};
