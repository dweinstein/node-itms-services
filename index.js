const plist = require('plist');
const request = require('request');
const urlParse = require('url').parse;
const qsParse = require('querystring').parse;
const deepGet = require('lodash-deep').deepGet;

// itms-services://?action=download-manifest&url=https://s3.amazonaws.com/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.plist

//
// Get the manifest url (the value of the 'url' param in the query component of the url)
//
function getManifestUrl (url) {
  const parsed = urlParse(url);
  if (!(/^itms-services:$/).test(parsed.protocol)) {
    return null;
  }
  const query = qsParse(parsed.query);
  if (!(/^download-manifest$/).test(query.action)) {
    return null;
  }
  return query.url;
}

//
// Parse the plist from the manifest url
//
function getPlist (url, cb) {
  request.get(url, function (err, resp, body) {
    if (err) {
      return cb(err);
    }
    if (resp.statusCode !== 200) {
      return cb(new Error('received HTTP ' + resp.statusCode));
    }
    return cb(null, plist.parse(body));
  });
}

//
// Extract the asset url from the manifest itms plist
//
function getAssetUrl (plist) {
  return deepGet(plist, 'items.0.assets.0.url');
}

//
// Get a readable stream from which the asset can be read
//
function getAssetStream (itmsUrl, cb) {
  const manifestUrl = getManifestUrl(itmsUrl);
  if (!manifestUrl) {
    process.nextTick(function () {
      return cb(new Error('could not extract manifest url'));
    });
  } else {
    getPlist(manifestUrl, function (err, plist) {
      if (err) {
        return cb(err);
      }
      const assetUrl = getAssetUrl(plist);
      if (!assetUrl) {
        return cb(new Error('no asset url extracted'));
      }
      return cb(null, request.get(assetUrl));
    });
  }
}

module.exports = getAssetStream;

