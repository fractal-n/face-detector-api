import Clarifai from "clarifai";

export function handleImage(req, res, db) {
  const { id } = req.body;
  db("users")
    .where({ id: id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      if (entries.length) {
        res.json(entries[0]);
      } else {
        res.status(400).json("not found");
      }
    })
    .catch((err) => res.status(400).json("error updating entries"));
}

const clarifai = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY,
});

export function handleClarifaiApiCall(req, res) {
  const { input } = req.body;
  clarifai.models
    .predict(Clarifai.DEMOGRAPHICS_MODEL, input)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => res.status(400).json("unable to work with API"));
}
