const express = require('express');
const ProfileRepository = require('../../../infrastructure/repositories/profileRepository');
const GetProfileUseCase = require('../../../application/usecase/users/getProfileUseCase');
const ProfileController = require('../../controller/users/profile.controller');
const router = express.Router();
const db = require('../../../infrastructure/database/database');

const profileRepository = new ProfileRepository(db);
const getProfileUseCase = new GetProfileUseCase(profileRepository);
const profileController = new ProfileController(getProfileUseCase);

router.get('/:userId', (req, res) => profileController.getProfile(req, res));

module.exports = router;
