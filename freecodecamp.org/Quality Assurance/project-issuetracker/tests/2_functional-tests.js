const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let projectId = 'sample-project-id'; // Change this to a valid project ID

  // 1. Create an issue with every field
  test('Create an issue with every field', function (done) {
    chai
      .request(server)
      .post(`/api/issues/${projectId}`)
      .send({
        title: 'Sample Issue',
        description: 'This is a sample issue',
        createdBy: 'John Doe',
        assignedTo: 'Jane Smith',
        status: 'Open',
        priority: 'High',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'title');
        assert.property(res.body, 'description');
        assert.property(res.body, 'createdBy');
        assert.property(res.body, 'assignedTo');
        assert.property(res.body, 'status');
        assert.property(res.body, 'priority');
        done();
      });
  });

  // 2. Create an issue with only required fields
  test('Create an issue with only required fields', function (done) {
    chai
      .request(server)
      .post(`/api/issues/${projectId}`)
      .send({
        title: 'Sample Issue',
        description: 'This is a sample issue',
        createdBy: 'John Doe',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'title');
        assert.property(res.body, 'description');
        assert.property(res.body, 'createdBy');
        done();
      });
  });

  // 3. Create an issue with missing required fields
  test('Create an issue with missing required fields', function (done) {
    chai
      .request(server)
      .post(`/api/issues/${projectId}`)
      .send({
        // Missing the "title" field
      })
      .end(function (err, res) {
        assert.equal(res.status, 200); // Assuming the server handles validation errors gracefully
        assert.property(res.body, 'error');
        done();
      });
  });

  // 4. View issues on a project
  test('View issues on a project', function (done) {
    chai
      .request(server)
      .get(`/api/issues/${projectId}`)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  // 5. View issues on a project with one filter
  test('View issues on a project with one filter', function (done) {
    // Assuming there's at least one issue in the projectIssues[projectId] array
    let sampleFilter = { status: 'Open' };

    chai
      .request(server)
      .get(`/api/issues/${projectId}`)
      .query(sampleFilter)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  // 6. View issues on a project with multiple filters
  test('View issues on a project with multiple filters', function (done) {
    // Assuming there's at least one issue in the projectIssues[projectId] array
    let sampleFilters = { status: 'Open', priority: 'High' };

    chai
      .request(server)
      .get(`/api/issues/${projectId}`)
      .query(sampleFilters)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  // 7. Update one field on an issue
  test('Update one field on an issue', function (done) {
    // Assuming there's at least one issue in the projectIssues[projectId] array
    let sampleIssueId = 'sample-issue-id'; // Change this to a valid issue ID
    let updatedData = { status: 'Closed' };

    chai
      .request(server)
      .put(`/api/issues/${projectId}`)
      .send({ id: sampleIssueId, ...updatedData })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'status');
        assert.equal(res.body.status, updatedData.status);
        done();
      });
  });

  // 8. Update multiple fields on an issue
  test('Update multiple fields on an issue', function (done) {
    // Assuming there's at least one issue in the projectIssues[projectId] array
    let sampleIssueId = 'sample-issue-id'; // Change this to a valid issue ID
    let updatedData = { status: 'In Progress', priority: 'Medium' };

    chai
      .request(server)
      .put(`/api/issues/${projectId}`)
      .send({ id: sampleIssueId, ...updatedData })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'status');
        assert.property(res.body, 'priority');
        assert.equal(res.body.status, updatedData.status);
        assert.equal(res.body.priority, updatedData.priority);
        done();
      });
  });

  // 9. Update an issue with missing _id
  test('Update an issue with missing _id', function (done) {
    chai
      .request(server)
      .put(`/api/issues/${projectId}`)
      .send({ status: 'Closed' })
      .end(function (err, res) {
        assert.equal(res.status, 200); // Assuming the server handles validation errors gracefully
        assert.property(res.body, 'error');
        done();
      });
  });

  // 10. Update an issue with no fields to update
  test('Update an issue with no fields to update', function (done) {
    // Assuming there's at least one issue in the projectIssues[projectId] array
    let sampleIssueId = 'sample-issue-id'; // Change this to a valid issue ID

    chai
      .request(server)
      .put(`/api/issues/${projectId}`)
      .send({ id: sampleIssueId })
      .end(function (err, res) {
        assert.equal(res.status, 200); // Assuming the server handles validation errors gracefully
        assert.property(res.body, 'error');
        done();
      });
  });

  // 11. Update an issue with an invalid _id
  test('Update an issue with an invalid _id', function (done) {
    let invalidIssueId = 'invalid-issue-id'; // Change this to an invalid issue ID
    let updatedData = { status: 'Closed' };

    chai
      .request(server)
      .put(`/api/issues/${projectId}`)
      .send({ id: invalidIssueId, ...updatedData })
      .end(function (err, res) {
        assert.equal(res.status, 404);
        assert.property(res.body, 'error');
        done();
      });
  });

  // 12. Delete an issue
  test('Delete an issue', function (done) {
    // Assuming there's at least one issue in the projectIssues[projectId] array
    let sampleIssueId = 'sample-issue-id'; // Change this to a valid issue ID

    chai
      .request(server)
      .delete(`/api/issues/${projectId}`)
      .send({ id: sampleIssueId })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'success');
        done();
      });
  });

  // 13. Delete an issue with an invalid _id
  test('Delete an issue with an invalid _id', function (done) {
    let invalidIssueId = 'invalid-issue-id'; // Change this to an invalid issue ID

    chai
      .request(server)
      .delete(`/api/issues/${projectId}`)
      .send({ id: invalidIssueId })
      .end(function (err, res) {
        assert.equal(res.status, 404);
        assert.property(res.body, 'error');
        done();
      });
  });

  // 14. Delete an issue with missing _id
  test('Delete an issue with missing _id', function (done) {
    chai
      .request(server)
      .delete(`/api/issues/${projectId}`)
      .end(function (err, res) {
        assert.equal(res.status, 200); // Assuming the server handles validation errors gracefully
        assert.property(res.body, 'error');
        done();
      });
  });
});
