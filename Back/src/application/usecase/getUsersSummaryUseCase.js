class GetUsersSummaryUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }

    async execute() {
        const usuarios = await this.usersRepository.fetchAll();
        return usuarios.map((u) => ({
            id_user: u.id_user,
            full_name: u.fullName,
            neuro_status: u.neuro_status,
            initial_interview: u.initial_interview,
        }));
    }
}

module.exports = GetUsersSummaryUseCase;