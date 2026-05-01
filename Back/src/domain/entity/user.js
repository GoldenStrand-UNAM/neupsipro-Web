class User {
    constructor (data) {
        this.photo = data.profile_photo;
        this.referenceNumber = data.reference_number;

        this.name = `${data.first_name} ${data.lastname_p} ${data.lastname_m}`;

        this.age = this.calculateAge(data.birthdate);

        this.registrationDate = data.registration_date;
        this.phase = data.neuro_status;

        this.assignedClinic = data.assigned_clinic;
        this.modality = data.modality;
        this.attendance = data.attendance;
        this.amputationDate = data.amputation_date;
        this.protocol = data.protocol;
        this.state = data.state;
        this.groupIntervention = data.group_intervention;
        this.amputationEtiology = data.amputation_etiology;
        this.laterality = data.laterality;
        this.prosthetist = data.prosthetist;
        this.neuroEntryDate = data.neuro_entry_date;
        this.amputationLevel = data.amputation_level;

        this.initialInterview = this.getStatus(data.initial_interview);
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

        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const daysInPreviousMonth = new Date(
                today.getFullYear(), 
                today.getMonth(), 
                0
            ).getDate();
            
            days += daysInPreviousMonth;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years} años, ${months} meses y ${days} días`;
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

module.exports = User;