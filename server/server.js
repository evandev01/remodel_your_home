const express = require('express')
const sql = require('mssql')
require('dotenv').config()

const app = express()

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: process.env.PRODUCTION == true ? false : true, // change to true for local dev / self-signed certs
  },
}

sql.connect(sqlConfig, (err) => {
  if (err) {
    console.log('Failed to connect to database:', err)
  } else {
    console.log('Connected to database')
  }
})

app.use('/test-leads', (req, res) => {
  const request = new sql.Request()
  request.query(
    "select * from RBA_WebLeads where insert_date >= '2023-03-30' and is_test=1",
    (err, result) => {
      if (err) {
        console.log('Failed to execute query:', err)
        res.send(err)
      } else {
        console.log('Query results:', result)
        res.status(200).json(result)
      }
    }
  )
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
