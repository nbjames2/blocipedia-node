const express = require("express");
const router = express.Router();
const validation = require("./validation");
const collaboratorController = require("../controllers/collaboratorController");

router.post("/wikis/:id/collaborator/add", validation.validateCollaborator, collaboratorController.add);
router.post("/wikis/:id/collaborator/remove", collaboratorController.remove);

module.exports = router;