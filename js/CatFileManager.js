const fs = require("fs");
const https = require("https");
const path = require("path");

// From https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
// Resolves with 1 if successful, and rejects with err if unsuccessful
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    let file = fs.createWriteStream(dest);
    let request = https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        resolve(1);
      });
    }).on('error', (err) => { // Handle errors
      fs.unlinkSync(dest);
      reject(err);
    });
  });
};


// Downloads images for each cat breed
// DEST must be the path to the desired folder, the file naming occurs in this function
// Ex. DEST can be __dirname/images/
function downloadAll(imgobj, path) {
  let ps = [];
  let keys = Object.keys(imgobj);
  for (let ci of keys) {
    let imgs = imgobj[ci];
    for (let i = 0; i < imgs.length; i++) {
      let cnt = i + 1;
      let ext = ci + cnt.toString() + ".jpg";
      let dp = downloadImage(imgs[i], path + ext);
      ps.push(dp);
    }
  }
  return Promise.all(ps);
}

// Returns a list of all file names in a directory
// ex. path = __dirname + /images/
function readDirectory(dirpath) {
  let names = [];
  return new Promise((resolve, reject) => {
    fs.readdir(dirpath, (err, files) => {
      files.forEach(file => {
        names.push(file);
      });
      if (err) {
        reject(err);
      }
      resolve(names);
    });
  });
}

function removeFilesInDirectory(dirpath) {
  return new Promise((resolve, reject) => {
    readDirectory(dirpath).then((res) => {
      removeFilesLoop(dirpath, res);
      resolve("done removing!");
    }).catch((err) => {
      reject(err);
    })
  })
}

// Helper function for removing files
function removeFilesLoop(dirpath, files) {
  for (let file of files) {
    try {
      fs.unlinkSync(path.join(dirpath, file));
    } catch (err) {
      throw err;
    }
  }
}


module.exports.downloadImage = downloadImage;
module.exports.downloadAll = downloadAll;
module.exports.readDirectory = readDirectory;
module.exports.removeFilesInDirectory = removeFilesInDirectory;