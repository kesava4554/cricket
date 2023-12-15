const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3009, () => {
      console.log("Server is running at http://localhost:3003/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const convertDbObjectToResponseObject = (DbObject)=>{
    return{
        playerId:DbObject.player_Id,
        playerName:DbObject.player_name,
        jerseyNumber:DbObject.jersey_number,
        role:DbObject.role,
    };
};
app.get("/players/", async (request,response)={
  const getCricketQuery = `
    SELECT
      *
    FROM
      cricket_team;`;
  const cricketArray = await db.all(getCricketQuery);
  response.send(cricketArray.map((eachPlayer)=>convertDbObjectToResponseObject(eachPlayer)));
});

app.post("/players/", async (request,response)={
    const details = request.body;
    const {playerName,jerseyNumber,role} = details;
  const api2 = `
    INSERT INTO
    cricket_team(playerName,jerseyNumber,role)
    VALUES
    (
        '${playerName}',
        ${jerseyNumber},
        '${role}');`;
  const db3 = await db.run(api2);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const api3 = `
    SELECT
      *
    FROM
      cricket_team
    WHERE
      player_Id = ${playerId};`;
  const db2 = await db.get(api3);
  response.send(convertDbObjectToResponseObject(db2));
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const details = request.body;
  const {playerName,jerseyNumber,role} = details;
  const api4 = `
    UPDATE
        cricket_team
    SET
        player_name = '${playerName}',
        jersey_number = '${jerseyNumber}',
        role='${role};
    WHERE
        player_Id = ${playerId};`;
  await db.run(api4);
  response.send("Player Detaild Updated")
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const api5 = `
    DELETE FROM
      cricket_team
    WHERE
      player_Id = ${playerId};`;
  await db.run(api5);
  response.send("Player Removed");
});
module.exports=app;