const ExceptionsDTO = require('../../dto/exceptionsDTO');
const PrivilegeDTO = require('../../dto/privilegesDTO');

class AuthorizationUseCase {
    constructor (authRepository) {
        this.authRepository = authRepository;
    }

    async checkPermission (userId, moduleName, requestedAction) {

        //mapping permissions from privileges into modules for verification
        //TODO: add rest of permissions, such as 'Emotion'
        const moduleToEntity = {
            'gaming': 'Game',
            'forum': 'Publication',
            'routine': 'Activity',
            'calendar': 'Appointment',
            'occasion': 'Occassion',
            'user-management': 'User',
            'initial-interview': 'Initial interview',
            'logbook': 'Logbook',
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
                if (requestedAction === 'consultation') return exception.consultation === 1;
                if (requestedAction === 'writting') return exception.writting === 1;
                if (requestedAction === 'edit') return exception.edit === 1;
                if (requestedAction === 'eliminate') return exception.eliminate === 1;
            }
        }


        const dbEntityNeeded = moduleToEntity[moduleName.toLowerCase()];
        //If exceptions is null, check for privileges per role
        const hasRolePrivilege = rolePrivileges.some(p => 
            p.permited_action === requestedAction && p.permissions === dbEntityNeeded);
                return hasRolePrivilege;
            }
}

module.exports = AuthorizationUseCase;
