const mongoose = require("mongoose");

/* EXAMPLE
{ 
    "_id": "5871dda29faedc3491ff93bb",
    "issue_title": "Fix error in posting data",
    "issue_text": "When we post data it has an error.",
    "created_on": "2017-01-08T06:35:14.240Z",
    "updated_on": "2017-01-08T06:35:14.240Z",
    "created_by": "Joe",
    "assigned_to": "Joe",
    "open": true,
    "status_text": "In QA"
}
*/

const issueSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date, required: true },
  updated_on: { type: Date, required: true },
  created_by: { type: String, required: true },
  assigned_to: String,
  open: { type: Boolean, required: true, default: true },
  status_text: String,
});

const projectSchema = new mongoose.Schema({
  project: { type: String, required: true },
});

module.exports = {
  Issue: mongoose.model("Issue", issueSchema),
  Project: mongoose.model("Project", projectSchema),
};
