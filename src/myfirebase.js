const serviceAccount = require("./gigpeople-1241e-5deced0212b5.json");
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const fsNotif = admin.firestore().collection("notifications");

module.exports = {admin, fsNotif};