/**
 * Created by seebi on 09.12.15.
 */

var dbURI    = 'mongodb://localhost/probr-core-test'
    , Chai = require('chai')
    , expect   = Chai.expect
    , mongoose = require('mongoose')
    , response = require('express').response
    , async = require('async')
    , Session = require('../session/session.model')
    , controller = require('./session.controller.js')
    ;

// Helper function to make the following tests shorter
// queries with the given parameters and runs expectFunction(results)
function getResponse(cb) {
    // Default parameters for when query not given
    query = {
        startTimestamp: new Date("2015-01-01 08:00:00").valueOf().toString(),
        endTimestamp:   new Date("2015-01-01 18:00:00").valueOf().toString()
    };

    // Construct request object
    var req = { query: query };

    // Take a request response object and replace json function to check what is passed in
    // This assumes that the request handler we test only calls .json() and no other function like
    // .send() directly...
    var res = response;
    res.json = function (results) {
        cb(null, results);
    };

    // Call the function
    controller.reduce(req,res);

}

// Inserts a single session with start end and mac
function insertSingleSession(mac, start, end) {
    return function(cb) {
        new Session( {
            startTimestamp: new Date("2015-01-01 " + start),
            endTimestamp:   new Date("2015-01-01 " + end),
            mac_address: mac
        } ).save(function(err, res) {
            cb(err);
        });
    };
}

describe("/api/session/reduce endpoint", function() {
    // Connect to DB
    before(function(done) {
        mongoose.connect(dbURI, function(err) {
            if(err) return done(err);
            done();
        })
    });

    after(function(done) {
        mongoose.disconnect();
        done();
    });

    afterEach(function(done) {
        Session.remove({}, function(err, removed) {
            if (err) return done(err);
            done();
        });
    });

    it("should be a function", function(done) {
        expect(controller.reduce).to.be.a.function;
        done();
    });

    it("should return non empty array", function(done) {
        async.waterfall([
            insertSingleSession("aaa", "13:37", "14:29"),
            getResponse,
            function(results, cb) {
                expect(results).to.be.not.empty;
                done();
            }
        ]);
    });

    it("should return {_id: Date, value: Number} objects", function(done) {
        async.waterfall(([
            insertSingleSession("aaa", "13:37", "14:29"),
            getResponse,
            function(results, cb) {
                results.forEach(function (res) {
                    expect(res).to.have.property('_id').that.is.a('Date');
                    expect(res).to.have.property('value').that.is.a('Number');
                });
                done();
            }
        ]));
    });

    it("should return dates that are rounded down to 5 minutes", function(done) {
        async.waterfall(([
            insertSingleSession("aaa", "13:37", "14:29"),
            getResponse,
            function(results, cb) {
                results.forEach(function (res) {
                    expect(res).to.have.property('_id').that.is.a('Date');
                    expect(res._id.valueOf() % (1000 * 60 * 5)).to.be.equal(0);
                });
                done();
            }
        ]));
    });

    it("should report empty buckets in the middle", function(done) {
        async.waterfall(([
            insertSingleSession("aaa", "13:37", "14:29"),
            insertSingleSession("aaa", "14:43", "14:51"),
            getResponse,
            function(results, cb) {
                results.forEach(function (res) {
                    expect(results).to.include({_id: new Date("2015-01-01 14:30:00"), value: 0});
                    expect(results).to.include({_id: new Date("2015-01-01 14:35:00"), value: 0});
                });
                done();
            }
        ]));
    });

    it("should report empty buckets to the left and right of the requested range", function(done) {
        async.waterfall(([
            insertSingleSession("aaa", "13:37", "14:29"),
            getResponse,
            function(results, cb) {
                results.forEach(function (res) {
                    expect(results).to.include({_id: new Date("2015-01-01 10:15:00"), value: 0});
                    expect(results).to.include({_id: new Date("2015-01-01 16:45:00"), value: 0});
                });
                done();
            }
        ]));
    });

    it("should report edge buckets correctly", function(done) {
        async.waterfall(([
            insertSingleSession("aaa", "13:37", "14:29"),
            getResponse,
            function(results, cb) {
                results.forEach(function (res) {
                    expect(results).to.include({_id: new Date("2015-01-01 08:00:00")});
                    expect(results).to.include({_id: new Date("2015-01-01 17:55:00")});
                });
                done();
            }
        ]));
    });

    describe("single sessions", function() {
        it("should correctly report a session that completely covers a bucket", function(done) {
            async.waterfall(([
                insertSingleSession("aaa", "13:33", "13:41"),
                getResponse,
                function(results, cb) {
                    expect(results).to.include({_id: new Date("2015-01-01 13:35:00"), value: 1});
                    done();
                }
            ]));
        });

        it("should correctly report a session that starts inside bucket", function(done) {
            async.waterfall(([
                insertSingleSession("aaa", "13:33", "13:41"),
                insertSingleSession("aaa", "14:12", "14:51"),
                getResponse,
                function(results, cb) {
                    expect(results).to.include({_id: new Date("2015-01-01 13:30:00"), value: 1});
                    expect(results).to.include({_id: new Date("2015-01-01 14:10:00"), value: 1});
                    done();
                }
            ]));
        });

        it("should correctly report a session that ends inside bucket", function(done) {
            async.waterfall(([
                insertSingleSession("aaa", "13:33", "13:41"),
                insertSingleSession("aaa", "14:12", "14:51"),
                getResponse,
                function(results, cb) {
                    expect(results).to.include({_id: new Date("2015-01-01 13:35:00"), value: 1});
                    expect(results).to.include({_id: new Date("2015-01-01 14:50:00"), value: 1});
                    done();
                }
            ]));
        });
    });

    describe("overlapping sessions", function() {
        it("should correctly report two sessions that both overlap on an entire bucket", function(done) {
            async.waterfall(([
                insertSingleSession("aaa", "13:27", "13:43"),
                insertSingleSession("bbb", "13:32", "13:47"),
                getResponse,
                function(results, cb) {
                    expect(results).to.include({_id: new Date("2015-01-01 13:35:00"), value: 2});
                    done();
                }
            ]));
        });

        it("should correctly report two sessions where one starts in the bucket and the other covers it", function(done) {
            async.waterfall(([
                insertSingleSession("aaa", "13:27", "13:43"),
                insertSingleSession("bbb", "13:32", "13:47"),
                getResponse,
                function(results, cb) {
                    expect(results).to.include({_id: new Date("2015-01-01 13:30:00"), value: 2});
                    done();
                }
            ]));
        });

        it("should correctly report two sessions where one ends in the bucket and the other covers it", function(done) {
            async.waterfall(([
                insertSingleSession("aaa", "13:27", "13:43"),
                insertSingleSession("bbb", "13:32", "13:47"),
                getResponse,
                function(results, cb) {
                    expect(results).to.include({_id: new Date("2015-01-01 13:40:00"), value: 2});
                    done();
                }
            ]));
        });

    });

    describe("multiple sessions in one bucket", function() {
        it("should only generate one value if two sessions in one bucket belong to the same mac", function(done) {
            async.waterfall(([
                insertSingleSession("aaa", "13:36", "13:37"),
                insertSingleSession("aaa", "13:38", "13:39"),
                getResponse,
                function(results, cb) {
                    expect(results).to.include({_id: new Date("2015-01-01 13:35:00"), value: 1});
                    done();
                }
            ]));
        });

        it("should generate two values if two sessions in one bucket belong to different macs", function(done) {
            async.waterfall(([
                insertSingleSession("aaa", "13:36", "13:37"),
                insertSingleSession("bbb", "13:38", "13:39"),
                getResponse,
                function(results, cb) {
                    expect(results).to.include({_id: new Date("2015-01-01 13:35:00"), value: 2});
                    done();
                }
            ]));
        });
    });

});
