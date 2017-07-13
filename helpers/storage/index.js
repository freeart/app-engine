class Storage {
    constructor(scope, cb) {
        this.modules;
        this.storageData = {};
        this.ready = false;
        this.core = scope;

        this.core.on("bind", (scope) => this.onBind(scope));

        this.core.on("config-queue", (config) => {
            this.config = config;
            this.core.emit("ready", this);
        });

        cb();
    }

    get(key) {
        return this.storageData[key];
    }

    set(key, value) {
        if (this.ready) {
            this.storageData[key] = value;
        }
    }

    onBind(scope) {
        this.modules = scope;
        this.ready = true;
    }

    cleanup(cb) {
        this.ready = false;
        console.log("cleaning on exit")
        setTimeout(cb, 1000);
    }
}

//export
module.exports = Storage;