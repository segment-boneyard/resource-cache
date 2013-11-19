
var defaults = require('defaults');
var Emitter = require('events').EventEmitter;
var inherit = require('util').inherits;
var LRU = require('lru-cache');
var ms = require('ms');
var request = require('request');


/**
 * Expose `ResourceCache`.
 */

module.exports = ResourceCache;


/**
 * Construct a new resource cache.
 *
 * @param {Object} options
 *   @param {Number} max
 *   @param {Number} refresh
 *   @param {Number} timeout
 */

function ResourceCache (options) {
  if (!(this instanceof ResourceCache)) return new ResourceCache(options);
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

inherit(ResourceCache, Emitter);


/**
 * Get the cached resource.
 *
 * @param {String} string
 * @returns {Number}
 */
ResourceCache.prototype.get = function (url, options) {
  var cached = this.cache.get(url);
  var resource = null;

  if (cached) resource = cached.resource;
  if (!cached || Date.now() - cached.updated >= this.options.refresh)
    this.fetch(url, options);

  return resource;
};


/**
 * Fetch the resource, and cache it.
 *
 * @param {String} url
 * @return {[type]}
 */

ResourceCache.prototype.fetch = function (url) {
  var self = this;
  var req = { url: url, timeout: this.options.timeout };
  // TODO: replace with superagent once javaresource parser is native
  request.get(req, function (err, res) {
    if (err && res.statusCode !== 200) return;
    var resource = res.body;
    self.cache.set(url, { updated: Date.now(), resource: resource });
    self.emit('fetch', url, resource);
  });
};