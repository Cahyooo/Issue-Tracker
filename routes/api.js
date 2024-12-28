"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const { Issue, Project } = require("../model/model");

// Connecting monggose
mongoose
  .connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      const query = req.query;
      const project = req.params.project;
      const projectData = await Project.findOne({ project });
      if (!projectData) {
        return res.json({ error: "no such project" });
      }

      let data;
      if (Object.keys(query).length === 0) {
        data = await Issue.find({ projectId: projectData._id }).collation({
          locale: "en",
          strength: 2,
        });
      } else {
        data = await Issue.find({
          projectId: projectData._id,
          ...query,
        }).collation({
          locale: "en",
          strength: 2,
        });
      }

      if (data.length === 0) {
        return res.json({ error: "no such project" });
      }
      return res.json(data);
    })

    .post(async function (req, res) {
      const project = req.params.project;
      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to || "";
      const status_text = req.body.status_text || "";

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }

      let projectData = await Project.findOne({
        project,
      });

      if (!projectData) {
        projectData = new Project({
          project,
        });
        await projectData
          .save()
          .then((data) => {})
          .catch((err) => {
            res.status(400).json({ error: err.message });
          });
      }

      const issueData = new Issue({
        projectId: projectData._id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open: true,
        created_on: new Date(),
        updated_on: new Date(),
      });

      await issueData
        .save()
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.status(400).json({ error: err.message });
        });
    })

    .put(async function (req, res) {
      const project = req.params.project;
      const {
        _id: id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;

      if (!id) {
        return res.json({ error: "missing _id" });
      }

      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      ) {
        return res.json({ error: "no update field(s) sent", _id: id });
      }

      await Issue.findByIdAndUpdate(
        id,
        { ...req.body, updated_on: new Date() },
      )
        .then((data) => {
          if (!data) {
            return res.json({ error: "could not update", _id: id });
          }
          res.json({
            result: "successfully updated",
            _id: id,
          });
        })
        .catch((err) => {
          res.json({ error: "could not update", _id: id });
        });
    })

    .delete(async function (req, res) {
      const project = req.params.project;
      const id = req.body._id;

      if (!id) {
        return res.json({ error: "missing _id" });
      }

      await Issue.findByIdAndDelete(id)
        .then((data) => {
          if (!data) {
            return res.json({ error: "could not delete", _id: id });
          }
          res.json({ result: "successfully deleted", _id: id });
        })
        .catch((err) => {
          res.json({ error: "could not delete", _id: id });
        });
    });
};
