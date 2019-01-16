const express = require("express");
const router = express.Router();
const validation = require("./validation");

const wikiController = require("../controllers/wikiController");

router.get("/wikis", wikiController.index);
router.get("/wikis/new", wikiController.new);
router.post("/wikis/create", validation.validateWiki, wikiController.create);
router.get("/wikis/:id", wikiController.show);
router.get("/wikis/:id/edit", wikiController.edit);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.post("/wikis/:id/update", validation.validateWiki, wikiController.update);

module.exports = router;

