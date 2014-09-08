
var _ = require("underscore");
var request = require("request");
var qs = require("querystring");
var uuid = require("node-uuid");
var should = require("should");
var sinon = require("sinon");
var url = require("url");

var ua = require("../lib/index.js");
var utils = require("../lib/utils.js")
var config = require("../lib/config.js")


describe("ua", function () {



    describe("#screenview", function () {
        var _enqueue;

        beforeEach(function () {
            _enqueue = sinon.stub(ua.Visitor.prototype, "_enqueue", function () {
                if (arguments.length === 3 && typeof arguments[2] === 'function') {
                    arguments[2]();
                }
                return this;
            });
        });

        afterEach(function () {
            _enqueue.restore()
        });


        it("should be available via the #s shortcut", function () {
            var visitor = ua()
            visitor.s.should.equal(visitor.screen)
        });


        it("should accept arguments (screenName)", function () {
            var screenName = "s" + Math.random();

            var visitor = ua("UA-XXXXX-XX", "", {strictCidFormat: false, debug:true});

            var result = visitor.screen(screenName)

            visitor._context = result._context;
            result.should.eql(visitor, "should return a visitor that is identical except for the context");

            result.should.be.instanceof(ua.Visitor);
            result._context.should.eql(_enqueue.args[0][1], "the screen params should be persisted as the context of the visitor clone")

            _enqueue.calledOnce.should.equal(true, "#_enqueue should have been called once");
            _enqueue.args[0][0].should.equal("screenview");
            _enqueue.args[0][1].should.have.keys(["cd"]);
            _enqueue.args[0][1].cd.should.equal(screenName);
        });


        it("should accept arguments (screenName, fn)", function () {
            var screenName = "s" + Math.random();
            var fn = sinon.spy();

            var visitor = ua("UA-XXXXX-XX")

            var result = visitor.screen(screenName, fn)

            visitor._context = result._context;
            result.should.eql(visitor, "should return a visitor that is identical except for the context");

            result.should.be.instanceof(ua.Visitor);
            result._context.should.eql(_enqueue.args[0][1], "the screen params should be persisted as the context of the visitor clone")

            _enqueue.calledOnce.should.equal(true, "#_enqueue should have been called once");
            _enqueue.args[0][0].should.equal("screenview");
            _enqueue.args[0][1].should.have.keys(["cd"]);
            _enqueue.args[0][1].cd.should.equal(screenName);

            fn.calledOnce.should.equal(true, "callback should have been called once");
        });


        it("should accept arguments (params)", function () {
            var params = {
                cd: "s" + Math.random()
            };

            var visitor = ua("UA-XXXXX-XX")

            var result = visitor.screen(params)

            visitor._context = result._context;
            result.should.eql(visitor, "should return a visitor that is identical except for the context");

            result.should.be.instanceof(ua.Visitor);
            result._context.should.eql(_enqueue.args[0][1], "the screenview params should be persisted as the context of the visitor clone")

            _enqueue.calledOnce.should.equal(true, "#_enqueue should have been called once");
            _enqueue.args[0][0].should.equal("screenview");
            _enqueue.args[0][1].should.have.keys(["cd"]);
            _enqueue.args[0][1].cd.should.equal(params.cd);
        });


        it("should accept arguments (params, fn)", function () {
            var params = {
                cd: "s" + Math.random(),
                empty: null // Should be removed
            };
            var json = JSON.stringify(params)
            var fn = sinon.spy()

            ua("UA-XXXXX-XX").screen(params, fn)

            _enqueue.calledOnce.should.equal(true, "#_enqueue should have been called once");
            _enqueue.args[0][0].should.equal("screenview");
            _enqueue.args[0][1].should.have.keys(["cd"]);
            _enqueue.args[0][1].cd.should.equal(params.cd);

            fn.calledOnce.should.equal(true, "callback should have been called once");

            JSON.stringify(params).should.equal(json, "params should not have been modified")
        });


        it("should accept arguments (screenname, appname)", function () {
            var screenName = Math.random().toString();
            var appName = Math.random().toString();

            ua("UA-XXXXX-XX").screen(screenName, appName);

            _enqueue.calledOnce.should.equal(true, "#_enqueue should have been called once");
            _enqueue.args[0][0].should.equal("screenview");
            _enqueue.args[0][1].should.have.keys(["cd", "an"]);
            _enqueue.args[0][1].cd.should.equal(screenName);
            _enqueue.args[0][1].an.should.equal(appName);
        });


        it("should accept arguments (screenname, appname, fn)", function () {
            var screenName = Math.random().toString();
            var appName = Math.random().toString();
            var fn = sinon.spy()

            ua("UA-XXXXX-XX").screen(screenName, appName, fn);

            _enqueue.calledOnce.should.equal(true, "#_enqueue should have been called once");
            _enqueue.args[0][0].should.equal("screenview");
            _enqueue.args[0][1].should.have.keys(["cd", "an"]);
            _enqueue.args[0][1].cd.should.equal(screenName);
            _enqueue.args[0][1].an.should.equal(appName);

            fn.calledOnce.should.equal(true, "callback should have been called once");
        });


        it("should accept arguments (screenname, appname, appversion)", function () {
            var screenName = Math.random().toString();
            var appName = Math.random().toString();
            var appVersion = Math.random().toString();

            ua("UA-XXXXX-XX").screen(screenName, appName, appVersion);

            _enqueue.calledOnce.should.equal(true, "#_enqueue should have been called once");
            _enqueue.args[0][0].should.equal("screenview");
            _enqueue.args[0][1].should.have.keys(["cd", "an", "av"]);
            _enqueue.args[0][1].cd.should.equal(screenName);
            _enqueue.args[0][1].an.should.equal(appName);
            _enqueue.args[0][1].av.should.equal(appVersion);
        });

        it("should accept arguments (screenname, appname, appversion, fn)", function () {
            var screenName = Math.random().toString();
            var appName = Math.random().toString();
            var appVersion = Math.random().toString();
            var fn = sinon.spy()

            ua("UA-XXXXX-XX").screen(screenName, appName, appVersion, fn);

            _enqueue.calledOnce.should.equal(true, "#_enqueue should have been called once");
            _enqueue.args[0][0].should.equal("screenview");
            _enqueue.args[0][1].should.have.keys(["cd", "an", "av"]);
            _enqueue.args[0][1].cd.should.equal(screenName);
            _enqueue.args[0][1].an.should.equal(appName);
            _enqueue.args[0][1].av.should.equal(appVersion);

            fn.calledOnce.should.equal(true, "callback should have been called once");
        });

        it("should allow daisy-chaining and re-using parameters", function () {
            var screenName = Math.random().toString();
            var appVersion = Math.random().toString();

            ua("UA-XXXXX-XX").screen(screenName, null, appVersion).screen()

            _enqueue.calledTwice.should.equal(true, "#_enqueue should have been called twice, once for each pageview");

            _enqueue.args[0][0].should.equal(_enqueue.args[1][0]);
            _enqueue.args[0][1].should.eql(_enqueue.args[1][1]);
        })


        it("should extend and overwrite params when daisy-chaining", function () {
            var screenName = Math.random().toString();
            var screenName2 = Math.random().toString();
            var appVersion = Math.random().toString();
            var appVersion2 = Math.random().toString();
            var foo = Math.random()

            ua("UA-XXXXX-XX")
                .screen(screenName, null, appVersion)
                .screen({
                    cd: screenName2,
                    av: appVersion2,
                    foo: foo
                }).screen(screenName)

            _enqueue.calledThrice.should.equal(true, "#_enqueue should have been called three times, once for each screenview");

            _enqueue.args[0][1].should.have.keys(["cd", "av"]);
            _enqueue.args[0][1].cd.should.equal(screenName);
            _enqueue.args[0][1].av.should.equal(appVersion);

            _enqueue.args[1][1].should.have.keys(["cd", "av", "foo"]);
            _enqueue.args[1][1].cd.should.equal(screenName2);
            _enqueue.args[1][1].av.should.equal(appVersion2);
            _enqueue.args[1][1].foo.should.equal(foo);

            _enqueue.args[2][1].should.have.keys(["cd", "av"]);
            _enqueue.args[2][1].cd.should.equal(screenName);
            _enqueue.args[2][1].av.should.equal(appVersion2);
        })

    });

});










