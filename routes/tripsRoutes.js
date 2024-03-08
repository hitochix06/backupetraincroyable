var express = require("express");

var router = express.Router();

//import des models
const Trip = require("../models/trips");
const User = require("../models/users");

//POST search by departure arrival and date
router.post("/search", async (req, res) => {
  const { departure, arrival, date } = req.body;

  try {
    const trips = await Trip.find({ departure, arrival, date });
    res.json(trips); // trips contient maintenant le tableau d'objets des trajets correspondant aux valeurs entrées dans l'input
  } catch (error) {
    console.error(error);
    res.status(500).send("Aucuns trajets correspondant.");
  }
});

//POST ajouter un trajet au panier (dans le front on fecth cette route au cta de book et on stocke l'id dans le localstorage)
router.post("/add-to-cart", (req, res) => {
  const { tripId } = req.body;

  // Vérifiez si l'ID du trajet est fourni
  if (!tripId) {
    return res.status(400).json({ error: "ID du trajet manquant" });
  }

  try {
    // Répondre avec un message de succès
    res.json({ message: "Trajet ajouté au panier avec succès" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'ajout du trajet au panier" });
  }
});

//Afficher le panier
//Envoie au front les objets assocés aux ids présent dans mon useState qui contient les id du local storage
router.post("/get-cart-items", async (req, res) => {
  const { tripIds } = req.body;

  try {
    const trips = await Trip.find({ _id: { $in: tripIds } });
    res.json(trips);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des trajets du panier" });
  }
});

// Route pour ajouter des trajets aux réservations de l'utilisateur
router.post("/add-to-reservations", async (req, res) => {
  try {
    if (!req.body.token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const data = await User.updateOne(
      { token: req.body.token },
      { $push: { trips: { $each: req.body.trips } } }
    );
    // Vérifier si le token est présent
    res.json({ data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'ajout des trajets aux réservations" });
  }
});

// Route pour obtenir les réservations d'un utilisateur
router.get("/user-reservations", async (req, res) => {
  try {
    // Récupérez le token depuis les paramètres de requête ou les en-têtes
    const token = req.headers.token || req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    // Trouvez l'utilisateur par le token et récupérez directement les réservations
    const user = await User.findOne({ token }).populate("trips");

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({ reservations: user.trips });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de la récupération des réservations de l'utilisateur",
    });
  }
});

module.exports = router;
