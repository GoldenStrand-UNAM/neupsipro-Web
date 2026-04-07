class consultLogbookUseCase {
    constructor (logbookRepository) {
        this.logbookRepository = logbookRepository;
    }


    async execute ({ id_user }) {

    const logbookEntities = await this.logbookRepository.fetchOne({ id_user });

    return logbookEntities.map(e => ({
        photo: e.photo,
        reference_number: e.reference_number,
        name: e.name,
        age: e.age,
        registration_date: e.registration_date,
        phase: e.phase,

        assigned_clinic: e.assigned_clinic,
        modality: e.modality,
        attendance: e.attendance,

        initial_interview: e.initial_interview,
        banfe: e.banfe,
        wais: e.wais,
        rey: e.rey,
        questionnaires: e.questionnaires,
        dr: e.dr,
    }));
}
}
    
module.exports = consultLogbookUseCase;