const async = require('async'),
    moment = require('moment'),
    path = require('path'),
    util = require('util');

class Logger {
    constructor(scope, cb) {
        this.modules;
        this.core = scope;

        this.core.on("bind", (msg) => this.onBind(msg));

        this.core.emit("ready", this);

        cb();
    }

    __alive() {
        this.__send('alive');
    }

    __send(level, payload) {
        let msg = {
            t: moment().utc().unix(),
            ip: this.ip,
            s: path.basename(process.argv[1]) + ' ' + process.argv.slice(2, process.argv.length).join(' '),
            pid: process.pid
        };
        if (payload) {
            msg.d = payload;
        }
        this.modules.queue.send({msg, level});
    }

    __log(payload) {
        let container = util.inspect(payload, {showHidden: false, depth: 5, breakLength: Infinity});
        let containerString = payload.map((arg) => {
            return util.inspect(arg, {showHidden: false, depth: 5, breakLength: Infinity});
        });
        console.log(`[${process.pid}]`.green, moment().utc().format("YYYY-MM-DD HH:mm:ss").gray, containerString.join(" "));
        return container
    }

    log() {
        let payload = Array.from(arguments);
        let container = this.__log(payload);
        this.__send("log", container);
    }

    info() {
        let payload = Array.from(arguments);
        let container = this.__log(payload);
        console.info(`[${process.pid}]`.yellow, moment().utc().format("YYYY-MM-DD HH:mm:ss").gray, container.join(" "));
    }

    error() {
        let payload = Array.from(arguments);
        let container = this.__log(payload);
        this.__log("error", container)
    }

    onBind(scope) {
        this.modules = scope;

        async.forever((next) => {
            this.__alive();

            setTimeout(() => {
                next();
            }, 10000);
        })
    }
}

module.exports = Logger;