const { Storage } = require("@google-cloud/storage");

const CLOUD_BUCKET = process.env.CLOUD_BUCKET;
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.KEYFILE_PATH,
});
const bucket = storage.bucket(CLOUD_BUCKET);

const getPublicUrl = (filename) => {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
};

const multipleToGCS = (req, res, next) => {
  if (!req.files) {
    return next();
  }

  let promises = [];
  req.files.forEach((image, index) => {
    const gcsname =
      req.headers.decode.username + Date.now() + image.originalname;
    const file = bucket.file(gcsname);

    const promise = new Promise((resolve, reject) => {
      const stream = file.createWriteStream({
        metadata: {
          contentType: image.mimetype,
        },
      });

      stream.on("finish", async () => {
        try {
          req.files[index].cloudStorageObject = gcsname;
          await file.makePublic();
          req.files[index].cloudStoragePublicUrl = getPublicUrl(gcsname);
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      stream.on("error", (err) => {
        req.files[index].cloudStorageError = err;
        reject(err);
      });

      stream.end(image.buffer);
    });

    promises.push(promise);
  });

  Promise.all(promises)
    .then((_) => {
      promises = [];
      next();
    })
    .catch(next);
};

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
};

const makeGCSName = (file) => {
  const name = file.originalname.toLowerCase().split(" ").join("-");
  const ext = MIME_TYPE_MAP[file.mimetype];
  cb(null, name + "-" + Date.now() + "." + ext);
};


singleToGCS = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  let image = req.file;
  const gcsname = makeGCSName(req.file);
  const file = bucket.file(gcsname);

  const promise = new Promise((resolve, reject) => {
    const stream = file.createWriteStream({
      metadata: {
        contentType: image.mimetype,
      },
    });

    stream.on("finish", async () => {
      try {
        req.file.cloudStorageObject = gcsname;
        await file.makePublic();
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    stream.on("error", (err) => {
      req.file.cloudStorageError = err;
      reject(err);
    });

    stream.end(image.buffer);
  });

  Promise.all([promise])
    .then((_) => {
      next();
    })
    .catch(next);

};

module.exports = {
  multipleToGCS,
  singleToGCS,
};
