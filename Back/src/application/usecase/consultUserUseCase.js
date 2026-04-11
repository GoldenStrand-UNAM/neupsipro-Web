class consultUserUseCase {
    constructor (userRepository) {
        this.userRepository = userRepository;
    }


    async execute ({ id_user }) {

    const userEntities = await this.userRepository.fetchOne({ id_user });

    return userEntities.map(e => ({
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
    
module.exports = consultUserUseCase;