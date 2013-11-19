var assert = require('assert');
var Cache = require('..');

describe('resource-cache', function () {

  var url = 'https://a.klaviyo.com/media/js/learnmarklet.js';

  describe('#get', function () {
    it('should return a null the first time', function () {
      var cache = new Cache();
      var js = cache.get(url);
      assert(js === null);
    });

    it('should properly fetch', function (done) {
      var cache = new Cache();
      cache.on('fetch', function (u, js) {
        assert(url === u);
        assert(js);
        js = cache.get(url);
        assert(js);
        done();
      });
      var js = cache.get(url);
      assert(js === null);
    });
  });
});