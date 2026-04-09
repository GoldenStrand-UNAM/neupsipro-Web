class Logbook {
    constructor (data) {
        this.photo = data.profile_photo;
        this.reference_number = data.reference_number;

        this.name = `${data.first_name} ${data.lastname_p} ${data.lastname_m}`;

        this.age = this.calculateAge(data.birthdate);

        this.registration_date = data.registration_date;
        this.phase = data.fase;

        this.assigned_clinic = data.assigned_clinic;
        this.modality = data.modality;
        this.attendance = data.attendance;

        this.initial_interview = this.getStatus(data.initial_interview);
        this.banfe = this.getStatus(data.banfe);
        this.wais = this.getStatus(data.wais);
        this.rey = this.getStatus(data.rey);
        this.questionnaires = this.getStatus(data.questionnaires);
        this.dr = this.getStatus(data.dr);
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

    getStatus (status) {
        if (!status) return null;

        switch(status) {
            case 1:
                return "En proceso de Aplicación";
            case 2: 
                return "En proceso de Calificar";
            case 3: 
                return "Elaborado";
            case 4: 
                return "Avanzado";
            case 5: 
                return "Impreso";
            case 6: 
                return "Por Comezar";
            case 7: 
                return "Calificado";
            case 8: 
                return "Entregado";
        }
    }
}

module.exports = Logbook;