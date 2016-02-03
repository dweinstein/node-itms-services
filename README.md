# SYNOPSIS

ITMS services asset downloader for apple iOS ad hoc distribution builds. Helps download the IPA by reading the asset location out of the plist manifest.

# INSTALL

```sh
$ npm install -g itms-services
```

# USAGE

```sh
$ itms-services -h
itms-services [-u uri] [-o out]
  -u [uri]   itms url from which to download IPA.
  -o [out]   write to output file

$ itms-services -u "itms-services://?action=download-manifest&url=https://s3.amazonaws.com/foo/bar/xxxxxxxxxxx.plist" -o - > out.ipa

$ itms-services -u "itms-services://?action=download-manifest&url=https://s3.amazonaws.com/foo/bar/xxxxxxxxxxx.plist" -o ./out.ipa
```
