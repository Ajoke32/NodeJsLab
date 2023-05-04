const server = require('../src/app');
const chai = require('chai');
const expect = chai.expect;

const chaiHttp = require('chai-http');
const mocLogger = require('mocha-logger');
const User = require("../src/models/user");
require("dotenv").config({path: './.env'});

chai.use(chaiHttp);


const validUsers = [
    {firstName: "User1", email: "email.user1@gmail.com", password: "StrongPassword"},
    {firstName: "User2", email: "email.user2@gmail.com", password: "VeryStrongPassword"}
]
const addTasks = [
    {title: "task1", description: "from user1", completed: false},
    {title: "task2", description: "from user1", completed: false},
];
let userToken = null;
let taskId = null;
after(function (done) {
    this.timeout(8000);
    User.deleteMany({}).then(() => {
        done();
    }).catch(err => {
        done(err);
    }).then(() => {
        server.close(() => {
            console.log("tests completed, server stopped")
        });
    });
});


describe('User', function () {
    this.timeout(8000);
    describe('#post, invalid user', function () {
        it("should return status 401", function (done) {
            const user = {firstName: "Poll", email: "email.alks@gmail.com", password: "password"};
            chai.request(server)
                .post("/users")
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done(err);
                    mocLogger.log(res.body.message);
                });
        });
    });
    describe('#post, valid users', function () {
        validUsers.forEach(user => {
            it("should return status 200 and users", function (done) {
                chai.request(server)
                    .post("/users")
                    .send(user)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        done(err);
                        mocLogger.log(res.body.message ?? "OK");
                        mocLogger.log(JSON.stringify(res.body.user));
                    });
            });
        });
    });

    describe('#post, user1 auth+tasks', function () {
        it("should return status 200 and success", function (done) {
            const user = {email: "email.user1@gmail.com", password: "StrongPassword"};
            userAuthTest(user, done);
        });

        addTasks.forEach(task => {
            it("should return status 200 and tasks", function (done) {
                taskAddTest(task, done);
            })
        });
    });

    describe('#get, user1 tasks', function () {
        it("should return 200 status and tasks length", function (done) {
            getUserTasksTest(done);
        });

        it("should return 200 and task", function (done) {
            getTaskByIdTest(taskId, done, 200);
        });

    });
    describe('#post, user1 logout', function () {
        it("should return status 200 and logout success", function (done) {
            userLogoutTest(done);
        });
    });

    describe("#post, user2 auth+tasks", function () {
        it("should return status 200", function (done) {
            const user = {email: "email.user2@gmail.com", password: "VeryStrongPassword"};
            userAuthTest(user, done);
        });

        it("should return status 200", function (done) {
            taskAddTest({title: "task3", description: "from user 3", completed: false}, done);
        });
    })

    describe("#get, user2 tasks", function () {
        it("should return status 200", function (done) {
            getUserTasksTest(done);
        });

        it("should return status 404", function (done) {
            getTaskByIdTest(taskId, done, 404);
        });
    })

    describe("#post, user2 logout", function () {
        it("should return status 200", function (done) {
            userLogoutTest(done);
        });
    });


    describe("#get, user2 tasks", function () {
        it("should return status 403", function (done) {
            getTaskByIdTest(taskId, done, 403);
        });
    });
});

function taskAddTest(task, done) {
    chai.request(server)
        .post("/tasks/add")
        .set('Authorization', `Bearer ${userToken}`)
        .send(task)
        .end((err, res) => {
            expect(res).to.have.status(200);
            done(err);
            if (taskId === null) {
                taskId = res.body.task._id;
            }
            mocLogger.log(JSON.stringify(res.body.task));
        })
}

function userAuthTest(user, done) {
    chai.request(server)
        .post("/users/login")
        .send(user)
        .end((err, res) => {
            expect(res).to.have.status(200);
            userToken = res.body.token;
            done(err);
            mocLogger.log(res.body.message);
        });
}

function getUserTasksTest(done) {
    chai.request(server)
        .get("/tasks")
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
            expect(res).to.have.status(200);
            done(err);
            mocLogger.log(res.body.tasks.length + " length");
        });
}

function userLogoutTest(done) {
    chai.request(server)
        .post('/users/logout')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
            expect(res).to.have.status(200)
            done(err);
            mocLogger.log(res.body.message);
        });
}

function getTaskByIdTest(id, done, status) {
    chai.request(server)
        .get(`/task/${id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
            expect(res).to.have.status(status);
            done(err);
            mocLogger.log(JSON.stringify(res.body.task, ['title', 'completed']) ?? res.body.message)
        });
}

