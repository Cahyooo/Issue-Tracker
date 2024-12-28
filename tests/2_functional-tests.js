const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

/*

Create an issue with every field: POST request to /api/issues/{project}
Create an issue with only required fields: POST request to /api/issues/{project}
Create an issue with missing required fields: POST request to /api/issues/{project}
View issues on a project: GET request to /api/issues/{project}
View issues on a project with one filter: GET request to /api/issues/{project}
View issues on a project with multiple filters: GET request to /api/issues/{project}
Update one field on an issue: PUT request to /api/issues/{project}
Update multiple fields on an issue: PUT request to /api/issues/{project}
Update an issue with missing _id: PUT request to /api/issues/{project}
Update an issue with no fields to update: PUT request to /api/issues/{project}
Update an issue with an invalid _id: PUT request to /api/issues/{project}
Delete an issue: DELETE request to /api/issues/{project}
Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
Delete an issue with missing _id: DELETE request to /api/issues/{project}

*/

suite("Functional Tests", function () {
    let id;

  // #1
  test("Create an issue with every field", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "Title",
        issue_text: "Text",
        created_by: "Creator",
        assigned_to: "Assignee",
        status_text: "Status text",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.issue_text, "Text");
        assert.equal(res.body.created_by, "Creator");
        assert.equal(res.body.assigned_to, "Assignee");
        assert.equal(res.body.status_text, "Status text");
        assert.equal(res.body.created_on, res.body.updated_on);
        assert.equal(res.body.open, true);

        id = res.body._id;

        done();
      });
  });

  // #2
  test("Create an issue with only required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "Title",
        issue_text: "Text",
        created_by: "Creator",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.issue_text, "Text");
        assert.equal(res.body.created_by, "Creator");
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.status_text, "");
        assert.equal(res.body.created_on, res.body.updated_on);
        assert.equal(res.body.open, true);
        done();
      });
  });

  // #3
  test("Create an issue with missing required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "Title",
        issue_text: "Text",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });

  // #4
  test("View issues on a project", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  // #5
  test("View issues on a project with one filter", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?issue_title=Title")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  // #6
  test("View issues on a project with multiple filters", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?issue_title=Title&created_by=Creator")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  // #7
  test("Update one field on an issue", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: id,
        issue_title: "Title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        done();
      });
  });

  // #8
  test("Update multiple fields on an issue", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: id,
        issue_title: "Title",
        issue_text: "Text",
        created_by: "Creator",
        assigned_to: "Assignee",
        status_text: "Status text",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        done();
      });
  });

  // #9
  test("Update an issue with missing _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        issue_title: "Title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });

  // #10
  test("Update an issue with no fields to update", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: id,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "no update field(s) sent");
        done();
      })
  });

  // #11
  test("Update an issue with an invalid _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: "invalid_id",
        issue_title: "Title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not update");
        done();
      });
  });

  // #12
  test("Delete an issue", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({
        _id: id,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted");
        done();
      });
  });

  // #13
  test("Delete an issue with an invalid _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({
        _id: "invalid_id",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not delete");
        done();
      });
  });

  // #14
  test("Delete an issue with no _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
