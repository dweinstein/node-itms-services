#!/usr/bin/env node
const getAssetStream = require('..');
const fs = require('fs');
const rc = require('rc');

const cfg = rc('itms_serices', {
  url: undefined,
  help: undefined,
  out: undefined
}, require('minimist')(process.argv, {
  alias: {
    url: ['u', 'uri'],
    help: ['h', 'usage'],
    out: ['o']
  }
}));

const usage =
`Usage: ${process.argv[1]} [-u uri] [-o out]
  -u [uri]   itms url from which to download IPA.
  -o [out]   write to output file
`;

if (cfg.help) {
  console.log(usage);
  process.exit(0);
}

if (!cfg.url || !cfg.out) {
  console.error(usage);
  process.exit(1);
}

const outStream = cfg.out === '-' ? process.stdout : fs.createWriteStream(cfg.out);

getAssetStream(cfg.url, function (err, stream) {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
  stream.pipe(outStream)
    .on('finished', function () {
      console.log('done');
    });
});
