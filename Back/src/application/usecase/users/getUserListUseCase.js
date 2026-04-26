const UserSummaryDTO = require('../../dto/userSummaryDTO');

/* Use case to fetch the folio + name of the active "usuarios" patients */
class GetUsersListUseCase {
    constructor (userRepository) {
        this.userRepository = userRepository;
    }

    async execute ({ search = "", page = 1, limit = 10 }) {
        const [users, total] = await Promise.all([
            // Run queries in parallel
            this.userRepository.fetchActivePatients ({ search, page, limit }),
            this.userRepository.countActivePatients ({ search }),
        ]);

        return {
            // Map raw data to DTO for the output contract
            users:      users.map (u => new UserSummaryDTO(u)),

            // Pagination metadata
            total,
            page: Number (page),
            limit: Number (limit),

            // Calculate total pages
            totalPages: Math.ceil (total / limit),
        };
    }
}
module.exports = GetUsersListUseCase;