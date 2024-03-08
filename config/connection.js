const mongoose = require("mongoose");

// dotenv.config();

const connectionString = process.env.URI;

mongoose
  .connect(connectionString, {
    connectTimeoutMS: 2000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
