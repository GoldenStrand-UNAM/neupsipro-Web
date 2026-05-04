class TestSessions {
    constructor (data) {
        this.idSession = data.id_session;
        this.idUser = data.id_user;
        this.sessionName = data.session_name;
        this.status = this.getStatus(data.status);
        this.createdAt = data.created_at;
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
                return "Completada";
            case 6: 
                return "Por Comenzar";
            case 7: 
                return "Calificado";
            case 8: 
                return "Entregado";
            case 9:
                return "Caducada";
        }
    }
}
module.exports = TestSessions;