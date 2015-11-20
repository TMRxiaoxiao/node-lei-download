/**
 * lei-download
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import path from 'path';
import mkdirp from 'mkdirp';
import {randomFilename, isURL} from './utils';
import copyFile from './copy';
import downloadFile from './download';


/*
 source, target => string
 progress, callback => function

 download(source, callback);
 download(source, progress, callback);
 download(source, target, callback);
 download(source, target, progress, callback);
*/
export default function download(...args) {
  var source, target, progress, callback;
  if (args.length < 2) {
    throw new TypeError('invalid argument number');
  }
  source = args[0];
  callback = args[args.length - 1];
  if (args.length === 2) {
    callback = args[1];
  } else if (args.length === 3) {
    if (typeof args[1] === 'function') {
      progress = args[1];
    } else {
      target = args[1];
    }
  } else {
    target = args[1];
    progress = args[2];
  }
  progress = progress || null;
  target = target || randomFilename(download.tmpDir);

  mkdirp(path.dirname(target), err => {
    if (err) return callback(err);

    if (isURL(source)) {
      downloadFile(source, target, progress, callback);
    } else {
      copyFile(source, target, progress, callback);
    }
  });
}
