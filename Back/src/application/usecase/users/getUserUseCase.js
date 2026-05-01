class consultUserUseCase {
    constructor (userRepository) {
        this.userRepository = userRepository;
    }


    async execute ({ id_user }) {

    const userEntities = await this.userRepository.fetchOne({ id_user });

    return userEntities.map(e => ({
        photo: e.photo,
        referenceNumber: e.referenceNumber,
        name: e.name,
        age: e.age,


        registrationDate: e.registrationDate,
        phase: e.phase,

        assignedClinic: e.assignedClinic,
        modality: e.modality,
        attendance: e.attendance,
        amputationDate: e.amputationDate,
        protocol: e.protocol,
        state: e.state,
        groupIntervention: e.groupIntervention,
        amputationEtiology: e.amputationEtiology,
        laterality: e.laterality,
        prosthetist: e.prosthetist,
        neuroEntryDate: e.neuroEntryDate,
        amputationLevel: e.amputationLevel,
        
        initialInterview: e.initialInterview,
        banfe: e.banfe,
        wais: e.wais,
        rey: e.rey,
        questionnaires: e.questionnaires,
        dr: e.dr,
    }));
}
}
    
module.exports = consultUserUseCase;