class PermissionsMiddleware {
    constructor (authorizationUseCase) {
        this.authUseCase = authorizationUseCase;
    }
    //middleware to verify privileges
    requirePermission = (moduleName, action) => async (req, res, next) => {
        try {
            const { userId } = req.user;            
            const isAllowed = await this.authUseCase.checkPermission(userId, moduleName, action);

            if (!isAllowed) {
                return res.status(403).json({ error: 'No tienes permisos para realizar esta acción en este módulo.' });
            }

            next();
            
        } catch (error) {
            return res.status(500).json({ error: 'Error verificando permisos' , cause: error});
        }
    };
}



module.exports = PermissionsMiddleware;