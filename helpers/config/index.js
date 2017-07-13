class Config {
    constructor(scope, cb) {
        this.modules;
        this.core = scope;

        this.core.on("bind", (scope) => this.onBind(scope));

        setTimeout(() => {
            const config = {
                storage: {
                    address: "localhost",
                    port: 27017
                },
                queue: {
                    address: "localhost",
                    port: 5672
                },
                apiTenant1:{
                    address: "0.0.0.0",
                    port: 3000
                }
            };

            Object.keys(config).forEach((item) => {
                this.core.emit("config-" + item, config[item]);
            })

            this.core.emit("ready", this);
        }, 2000)

        cb();
    }

    onBind(scope) {
        this.modules = scope;
    }
}

//export
module.exports = Config;