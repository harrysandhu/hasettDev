import {Pool, Client} from 'pg';

let connections = {
    firestar : 'host=firestar.postgres.database.azure.com port=5432 dbname=hasettDev user=firestar_user@firestar password=@./%_1ab@psql1 sslmode=require'
}

export const firepool = new Pool({
    user: 'firestar_user@firestar',
    host: 'firestar.postgres.database.azure.com',
    database: 'hasettDev',
    password: '@./%_1ab@psql1',
    port: 5432,
    ssl: true
})

x('fewsa', 'g');

async function x(username:string, uId?:string){
 if(uId){
    const client = await firepool.connect();
   


        try{
            await client.query('BEGIN')
            const queryText = 'SELECT * FROM _user WHERE username = $1 AND userId <> $2';
            const res = await client.query(queryText, [username, uId])
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

