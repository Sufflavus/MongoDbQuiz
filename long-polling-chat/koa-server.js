var koa = require("koa");
var app = koa();
var fs = require("fs");
var serve = require('koa-static');
var parse = require('co-body');
var chat = require("./chat");

app.use(function*(next){
    switch (this.url){
        case "/":
            app.use(serve(__dirname + '/index.html'));
            break;

        case "/subscribe":
            chat.subscribe(this.request, this.response);
            break;

        case "/publish":
            var body = yield parse(this, { limit: '10kb' });
            chat.publish(body.message);
            this.body = "ok";
            break;

        default:
            this.throw(404, "Not found");
    }
});

app.on('error', function(err){
    this.throw(err);
});

app.listen(3030);