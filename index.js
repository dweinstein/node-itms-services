const plist = require('plist');
const request = require('request');
const urlParse = require('url').parse;
const qsParse = require('querystring').parse;
const deepGet = require('lodash-deep').deepGet;

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
function extractAssetUrl (plist) {
  return deepGet(plist, 'items.0.assets.0.url');
}

//
// Get the underlying asset URL from the itms-services URI
//
function getAssetUrl (itmsUrl, cb) {
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
      const assetUrl = extractAssetUrl(plist);
      return cb(null, assetUrl);
    });
  }
}

module.exports = {
  getAssetUrl: getAssetUrl
};

