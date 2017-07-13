const async = require("async"),
    yargs = require('yargs'),
    moment = require('moment'),
    EventEmitter = require('events');

require('colors');

function* entries(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}

class Loader extends EventEmitter {
    constructor() {
        super();

        this.modules = {};
        this.argv = yargs.argv;

        this.counter = null;

        this.on("loading", (module)=>{
            console.log(module, "PENDING".yellow);
        });

        this.on("ready", (module) => {
            console.log(module.constructor.name, "OK".green);
            this.__registerModule(module);
        });

        this.on("bind", () => {
            console.log(`Service "${this.argv.p || this.argv.profile}" IS ONLINE`.green);
        });

        this.__createApp();

        this.__registerSignals();
    }

    __registerModule(module) {
        if (!this.counter.has(module.constructor.name)){
            console.error("check your module", module.constructor.name);
            process.exit(1)
        }
        this.counter.delete(module.constructor.name);
        if (this.counter.size === 0) {
            process.nextTick(() => {
                this.removeAllListeners("ready");
                this.emit('bind', this.modules);
            })
        }
    }

    __createApp() {
        let profile = require(`${this.argv.p || this.argv.profile}`);

        let requires = {};
        for (let [moduleName, moduleFile] of entries(profile)) {
            requires[moduleName] = require(moduleFile);
        }

        this.counter = new Set(Object.keys(requires).map(n => requires[n].name));

        let d = require('domain').create();
        d.on('error', (err) => {
            console.error(`[${process.pid}]`.red, moment().utc().format("YYYY-MM-DD HH:mm:ss"), 'domain', {
                message: err.message,
                stack: err.stack
            });
            process.exit(1);
        });
        d.run(() => {
            async.eachOf(requires, (moduleClass, moduleName, cb) => {
                this.modules[moduleName] = new moduleClass(this, cb);
                this.emit('loading', moduleClass.name);
            }, () => {
                this.emit('loaded');
            })
        });
    }

    __registerSignals() {
        process.once('cleanup', () => {
            async.eachOfSeries(this.modules, (moduleName, moduleInstance, cb) => {
                if (typeof(moduleInstance.cleanup) == 'function') {
                    moduleInstance.cleanup(cb);
                } else {
                   cb();
                }
            }, () => {
                process.exit(0);
            });
        });

        process.once('SIGTERM', () => {
            process.emit('cleanup');
        })

        process.once('exit', () => {
            process.emit('cleanup');
        });

        process.once('SIGINT', () => {
            process.emit('cleanup');
        });
    }
}

let loader = new Loader();