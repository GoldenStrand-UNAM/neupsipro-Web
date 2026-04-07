const UserSummaryDTO = require("../dto/userSummaryDTO");

class GetUsersSummaryUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ search = "", page = 1, limit = 10 }) {
        const [users, total] = await Promise.all([
            this.userRepository.fetchActivePatients({ search, page, limit }),
            this.userRepository.countActivePatients({ search })
        ]);

        return {
            users:      users.map(u => new UserSummaryDTO(u)),
            total,
            page:       Number(page),
            limit:      Number(limit),
            totalPages: Math.ceil(total / limit)
        };
    }
}
module.exports = GetUsersSummaryUseCase;