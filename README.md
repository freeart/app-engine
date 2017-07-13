# app-engine

```bash
npm install  
```
*index.js* is a profile loader  
*apiTenant1, module1, module2* are active modules  
*helpers/\*\** are passive modules  

*helpers/config* is a module which receive configuration and sends it via events  
*helpers/logger* is a simple logger example  
*helpers/queue* is a dummy  
*helpers/storage* is a dummy  

to start **all modules** together as classic monolite, modules can exchange messages via events or direct calls  
```bash
node ./index.js --profile ./profile.monolite.json   
```
to start **just api** in a single instance  
```bash
node ./index.js --profile ./profile.scalable-apiTenant1.json
```
to start **just module1** in a single instance, in cluster mode modules should exchange messages via queue or api  
```bash
node ./index.js --profile ./profile.scalable-module1.json
```

[pm2](http://pm2.keymetrics.io/docs/usage/quick-start/) to make **cluster** on a single machine
