const express = require('express');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get(
    '/',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Forum', 'consultation'),
    async (req, res) => {
      const userId = req.user?.userId ?? req.user?.id;

      let canEliminate = false;

      if (userId) {
        try {
          canEliminate = await authUseCase.checkPermission(
            userId,
            'Forum',
            'eliminate'
          );
        } catch {
          canEliminate = false;
        }
      }

      return res.render('forum/forum', {
        activePage: 'forum',
        tutorialModule: 'forum',
        canEliminate,
      });
    }
  );

  router.get(
    '/post',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Forum', 'writing'),
    (req, res) => {
      return res.render('forum/postPublication', {
        activePage: 'forum',
        tutorialModule: 'postPublication',
      });
    }
  );

  return router;
};
