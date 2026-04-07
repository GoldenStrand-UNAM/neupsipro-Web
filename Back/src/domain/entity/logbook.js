class Logbook {
    constructor (data) {
        this.photo = data.profile_photo;
        this.reference_number = data.reference_number;

        this.name = `${data.first_name} ${data.lastname_p} ${data.lastname_m}`;

        this.birthdate = data.birthday;
        this.age = this.calculateAge(data.birthday);

        this.registration_date = data.registration_date;
        this.phase = data.fase;

        this.assigned_clinic = data.assigned_clinic;
        this.modality = data.modality;
        this.attendance = data.attendance;

        this.initial_interview = data.initial_interview;
        this.banfe = data.banfe;
        this.wais = data.wais;
        this.rey = data.rey;
        this.questionnaires = data.questionnaires;
        this.dr = data.dr;
    }

    calculateAge (birthdate) {
        if (!birthdate) return null;

        const today = new Date();
        const birth = new Date(birthdate);

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age = age - 1;
        }

        return age;
    }
}

module.exports = Logbook;