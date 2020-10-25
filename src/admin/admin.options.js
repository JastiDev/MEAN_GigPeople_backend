const AdminBro = require('admin-bro');
const AdminBroMongoose = require("admin-bro-mongoose");

AdminBro.registerAdapter(AdminBroMongoose);

const resources = [
  require('../models/Bid'),
  require('../models/Category'),
  require('../models/User'),
  require('../models/FinancialProfile'),
  require("../models/WorkerProfile"),
  require('../models/EmployerProfile'),
  require('../models/Chat'),
  require('../models/EmployerReview'),
  require('../models/Message'),
  require('../models/Skill'),
  require('../models/Task'),
  require('../models/Transaction'),
  require('../models/WorkerReview'),
  require('../models/Contract')
];

const options = {
  resources: resources,
};

module.exports = options;