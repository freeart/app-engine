class Module1 {
    constructor(scope, cb) {
        this.modules;
        this.core = scope;

        this.core.on("bind", (scope) => this.onBind(scope));

        setTimeout(() => {
            this.core.emit("ready", this);
        }, 2000);

        cb();
    }

    start() {
        this.modules.queue.listen((err, job) => {
            if (err) {
                return this.modules.logger.log(err)
            }
            this.modules.storage.set("id", job.id)
            this.modules.logger.log(job)
        })
    }

    onBind(scope) {
        this.modules = scope;
        this.ready = true;

        this.start();
    }
}

//export
module.exports = Module1;