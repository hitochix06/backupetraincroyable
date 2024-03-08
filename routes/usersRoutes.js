const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const User = require("../models/users");
const bcrypt = require("bcrypt");

//INSCRIPTION
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, age, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà dans la base de données pour pas créer de beug et ajouter plusieurs fois le même ou avoir une erreur random
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "Cet utilisateur existe déjà." });
    }

    // Génération du token unique pour l'user de 32 caractères
    const token = uid2(32);

    // Hacher le mdp
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = {
      firstName,
      lastName,
      age,
      email,
      password: hashedPassword,
      token,
      trips: [],
    };

    // Ajout dans la bdd
    const user = await User.create(newUser);

    res.json({ userId: user._id, token: user.token }); //on envoie au front le token relié à l'user
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'inscription." });
  }
});

//CONNECTION
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      // Compare les mdp
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (passwordsMatch) {
        // Connexion réussie => On envoie le token
        res.json({ token: user.token, lastName: user.lastName, age: user.age });
      } else {
        res.status(401).json({ error: "Email ou mot de passe incorrect" });
      }
    } else {
      res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

module.exports = router;
