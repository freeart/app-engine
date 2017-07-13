class Module2 {
    constructor(scope, cb) {
        this.modules;
        this.core = scope;

        this.core.on("bind", (scope) => this.onBind(scope));

        setTimeout(() => {
            this.core.emit("ready", this);
        }, 100)

        cb();
    }

    start() {
        setTimeout(() => {
            let body = {data: Math.random()};
            this.modules.queue.send(body);
            console.log(body)
            this.start()
        }, 500)
    }

    onBind(scope) {
        this.modules = scope;

        this.start();
    }
}

//export
module.exports = Module2;