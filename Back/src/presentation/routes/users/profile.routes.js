const express = require('express');
const router = express.Router();
/**
 * Definition of profile routes.
 * @param {ProfileController} profileController - Instance from th inyected controller.
 */
const profileRoutes = (profileController) => {
    
    router.get('/:userId', (req, res) => profileController.getProfile(req, res));

    return router;
};

module.exports = profileRoutes;
