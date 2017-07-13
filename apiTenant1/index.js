const express = require('express')

class ApiTenant1 {
    constructor(scope, cb) {
        this.modules;
        this.core = scope;
        this.config;
        this.app;

        this.core.on("bind", (scope) => this.onBind(scope));

        this.core.on("config-apiTenant1", (config) => {
            this.config = config;

            this.app = express();
            this.app.listen(this.config.port, () => {
                console.log("listening", this.config.port)
                this.core.emit("ready", this);
            })
        });

        cb();
    }

    start() {
        this.app.get('/', (req, res) => {
            res.send({id: this.modules.storage.get("id") || null})
        });

    }

    onBind(scope) {
        this.modules = scope;

        this.start();
    }
}

//export
module.exports = ApiTenant1;