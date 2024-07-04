//functions to run mssql queries
//open a connection, run the query, close the connection
//also allows for more customisation, ie using objects for inputs

const sql = require("mssql")
const dbConfig = require("../dbConfig")

//execute a query and return the result
async function query(queryString, params){
    //queryString is the query to run
    //params is a dictionary for the parameters, key: sql param, value: value to pass

    //connect to database
    const connection = await sql.connect(dbConfig); 
    const request = connection.request();

    //deal with parameters
    //iterate through params and apply the input
    if (params){
        for (const [key, value] of Object.entries(params)) {
            request.input(key, value)
        }
    }
    const result = await request.query(queryString); //execute query and store result

    connection.close(); //close connection
    return result
}

//query but we can choose what columns to exclude
async function exceptQuery(columnExclude, queryString, params){
    //first we load the data into a temp table
    let sql = `
    SELECT * INTO #TempTable
    FROM (${queryString}) AS a
    `
    //then drop the columns to exclude from said temp table
    columnExclude.forEach(e => {
        sql += `
            ALTER TABLE #TempTable
            DROP COLUMN ${e}
            `
    });
    // Get results
    sql += "SELECT * FROM #TempTable"
    //run the query
    const result = await this.query(sql,params)
    //Delete the temp tample
    await this.query("IF OBJECT_ID('#TempTable', 'U') IS NOT NULL DROP TABLE #TempTable")
    return result
}


module.exports = {query, exceptQuery}