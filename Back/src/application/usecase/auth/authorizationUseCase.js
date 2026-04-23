const ExceptionsDTO = require('../../dto/exceptionsDTO');
const PrivilegeDTO = require('../../dto/privilegesDTO');

class AuthorizationUseCase {
    constructor (authRepository) {
        this.authRepository = authRepository;
    }

    async checkPermission (userId, moduleName, requestedAction) {
        // Mapping permissions from privileges into modules for verification
        const moduleToEntities = {
            'gaming': ['Game'],
            'forum': ['Publication', 'Interaction'],
            'user management': ['User', 'Initial interview'],
            'routine': ['Activity', 'Emotion'],
            'occasion': ['Ocassion'],
            'logbook': ['Logbook'],
        };

        const [rawRolePrivileges, rawUserExceptions] = await Promise.all([
            this.authRepository.getPrivileges(userId),
            this.authRepository.getExceptions(userId, moduleName),
        ]);

        const userExceptions = (rawUserExceptions || []).map(row => ExceptionsDTO.fromEntity(row));
        const rolePrivileges = (rawRolePrivileges || []).map(row => PrivilegeDTO.fromEntity(row));

        //Check for exceptions per user (ACL)
        if (userExceptions.length > 0) {
            const exception = userExceptions.find(ex => 
                (ex.moduleName || ex.module || "").toLowerCase() === moduleName.toLowerCase());

            if (exception) {
                const aclMap = {
                    'consultation': exception.consultation,
                    'writing': exception.writing,
                    'edit': exception.edit,
                    'eliminate': exception.eliminate,
                };

                if (Object.prototype.hasOwnProperty.call(aclMap, requestedAction)) {
                    return aclMap[requestedAction] === 1;
                }

            }
        }

        const entitiesNeeded = moduleToEntities[moduleName.toLowerCase()] || [moduleName];

        //If exceptions is null, check for privileges per role
        const hasRolePrivilege = rolePrivileges.some(p => 
            p.permited_action === requestedAction && 
            entitiesNeeded.includes(p.permissions));

        return hasRolePrivilege;
    }
}

module.exports = AuthorizationUseCase;