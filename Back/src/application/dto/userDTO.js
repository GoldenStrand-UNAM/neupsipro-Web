class UserDTO {
    constructor ({
        photo,
        reference_number,
        name,
        age,
        registration_date,
        phase,
        assigned_clinic,
        modality,
        attendance,
        initial_interview,
        banfe,
        wais,
        rey,
        questionnaires,
        dr,
    }) {
        this.photo = photo;
        this.reference_number = reference_number;
        this.name = name;
        this.age = age;
        this.registration_date = registration_date;
        this.phase = phase;

        this.assigned_clinic = assigned_clinic;
        this.modality = modality;
        this.attendance = attendance;

        this.initial_interview = initial_interview;
        this.banfe = banfe;
        this.wais = wais;
        this.rey = rey;
        this.questionnaires = questionnaires;
        this.dr = dr;
    }

    static fromEntity (entity) {
        return new UserDTO({
            photo: entity.photo,
            reference_number: entity.reference_number,
            name: entity.name,
            age: entity.age,
            registration_date: entity.registration_date,
            phase: entity.phase,

            assigned_clinic: entity.assigned_clinic,
            modality: entity.modality,
            attendance: entity.attendance,

            initial_interview: entity.initial_interview,
            banfe: entity.banfe,
            wais: entity.wais,
            rey: entity.rey,
            questionnaires: entity.questionnaires,
            dr: entity.dr,
        });
    }
}

module.exports = UserDTO;