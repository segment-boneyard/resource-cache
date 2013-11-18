
var defaults = require('defaults');
var Emitter = require('events').EventEmitter;
var inherit = require('util').inherits;
var LRU = require('lru-cache');
var ms = require('ms');
var request = require('request');


/**
 * Expose `ScriptCache`.
 */

module.exports = ScriptCache;


/**
 * Construct a new script cache.
 *
 * @param {Object} options
 *   @param {Number} max
 *   @param {Number} refresh
 *   @param {Number} timeout
 */

function ScriptCache (options) {
  if (!(this instanceof ScriptCache)) return new ScriptCache(options);
  this.options = defaults(options, {
    max: 1000,
    refresh: ms('4m'),
    timeout: ms('1m')
  });

  this.cache = LRU(this.options);
}


/**
 * Inherit from `Emitter`.
 */

inherit(ScriptCache, Emitter);


/**
 * Get the cached script.
 *
 * @param {String} string
 * @returns {Number}
 */
ScriptCache.prototype.get = function (url, options) {
  var cached = this.cache.get(url);
  var script = null;

  if (cached) script = cached.script;
  if (!cached || Date.now() - cached.updated >= this.options.refresh)
    this.fetch(url, options);

  return script;
};


/**
 * Fetch the script, and cache it.
 *
 * @param {String} url
 * @return {[type]}
 */

ScriptCache.prototype.fetch = function (url) {
  var self = this;
  var req = { url: url, timeout: this.options.timeout };
  // TODO: replace with superagent once javascript parser is native
  request.get(req, function (err, res) {
    if (err && res.statusCode !== 200) return;
    var script = res.body;
    self.cache.set(url, { updated: Date.now(), script: script });
    self.emit('fetch', url, script);
  });
};