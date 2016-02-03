function isItmsUrl (url) {
  return url.indexOf('itms-services://') === 0;
}
module.exports = isItmsUrl;
