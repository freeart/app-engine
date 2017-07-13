class Queue {
    constructor(scope, cb) {
        this.modules;
        this.core = scope;
        this.config;

        this.core.on("bind", (scope) => this.onBind(scope));

        this.core.on("config-queue", (config)=>{
            this.config = config;
            this.core.emit("ready", this);
        });

        cb();
    }

    listen(cb){
        setInterval(()=>{
            cb(null, {id: Math.random()})
        }, 1000)
    }

    send(body){

    }

    onBind(scope) {
        this.modules = scope;
    }
}

//export
module.exports = Queue;