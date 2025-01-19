const mysql=require('mysql')
const db=mysql.createConnection({
    host: 'bru8ugwlafx2dl6karre-mysql.services.clever-cloud.com',      // Host from InfinityFree
  user: 'uahwk01vguth3cir',               // Your MySQL username
  password: 'wt2ZnhYI4fJ0aq8gRt6J',           // Your MySQL password
  database: 'bru8ugwlafx2dl6karre',    
  port:3306
})
db.connect((err)=>{
    if(err){
        console.log(err)
        return;
    }
    console.log("hello world")
});
