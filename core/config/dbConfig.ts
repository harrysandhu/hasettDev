import {Pool, Client} from 'pg';

let connections = {
    firestar : 'host=firestar.postgres.database.azure.com port=5432 dbname=hasettDev user=firestar_user@firestar password=@./%_1ab@psql1 sslmode=require'
}



export const firepool = new Pool({
    user : 'harryxsandhu',
    password : 'gxbxmfy039gdph44',
    host : 'firestore-x-1-do-user-1754324-0.db.ondigitalocean.com',
    port : 25060,
    database : 'firestoredb',
    ssl : true
})


//postgresql://harryxsandhu:gxbxmfy039gdph44@firestore-x-1-do-user-1754324-0.db.ondigitalocean.com:25060/firestoredb?sslmode=require
x('fewsa', 'g');

async function x(username:string, uId?:string){
 if(uId){
    const client = await firepool.connect();
   

        try{
            await client.query('BEGIN')
            const queryText = 'SELECT current_date'
            const res = await client.query(queryText)
            //select so no need to commi t;
            console.log(res.rows)
        }catch(e){
            await client.query('ROLLBACK');
            console.log(e)
        }finally{
            client.release()
        }
    }else console.log("he")
}

