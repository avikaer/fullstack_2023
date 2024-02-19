var p={};const a=require("express"),u=require("morgan"),d=require("path"),o=a(),g=require("cors");u.token("postData",n=>{const{name:e,number:s,...r}=n.body;return JSON.stringify({name:e,number:s,...r})});o.use(a.json());o.use(u(":method :url :status :response-time ms - :postData"));o.use(g());o.get("/api/persons",(n,e)=>{e.json(persons)});o.post("/api/persons",(n,e,s)=>{const{name:r,number:t}=n.body;if(!r||!t)return e.status(400).json({error:"name or number missing"});new Person({name:r,number:t}).save().then(i=>{e.json(i)}).catch(i=>s(i))});const m=require("mongoose");process.argv.length<3&&(console.log("Give password as an argument"),process.exit(1));const l=process.argv[2],h=`mongodb+srv://palmarier:${encodeURIComponent(l)}@cluster0.qz86wh1.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`;m.connect(h,{useNewUrlParser:!0,useUnifiedTopology:!0}).then(()=>{console.log("Connected to MongoDB")}).catch(n=>{console.error("Error connecting to MongoDB:",n.message)});const f=new m.Schema({name:String,number:String});f.set("toJSON",{transform:(n,e)=>{e.id=e._id.toString(),delete e._id,delete e.__v}});o.get("/api/persons/:id",(n,e,s)=>{const r=n.params.id;Person.findById(r).then(t=>{t?e.json(t):e.status(404).end()}).catch(t=>s(t))});o.get("/api/persons",(n,e)=>{Person.find({}).then(s=>{e.json(s)})});o.delete("/api/persons/:id",(n,e,s)=>{const r=n.params.id;Person.findByIdAndRemove(r).then(t=>{t?e.status(204).end():e.status(404).json({error:"Person not found"})}).catch(t=>s(t))});o.get("/info",(n,e)=>{const s=`<p>Phonebook has info for ${persons.length} people</p>`,r=new Date().toLocaleString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"});e.send(`${s}<p>${r}</p>`)});o.use(a.static(d.join(__dirname,"dist")));o.get("*",(n,e)=>{e.sendFile(d.join(__dirname,"dist","index.html"))});const c=p.PORT||3001;o.listen(c,()=>{console.log(`Server running on port ${c}`)});
