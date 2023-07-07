const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexión a la base de datos MongoDB
const url = "mongodb://localhost:27017";
const dbName = "mi_base_de_datos";

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }

  const db = client.db(dbName);
  const collection = db.collection("users");

  // Ruta para el inicio de sesión
  app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Verificar si el usuario existe en la base de datos
    collection.findOne(
      { username: username, password: password },
      (err, user) => {
        if (err) {
          console.error("Error al buscar usuario:", err);
          res.json({ success: false });
          return;
        }

        if (user) {
          res.json({ success: true });
        } else {
          res.json({ success: false });
        }
      }
    );
  });

  // Iniciar el servidor
  app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
  });
});
