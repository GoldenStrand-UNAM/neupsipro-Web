const userClinicalSummaryDTO = require('../../dto/userClinicalSummaryDTO');

/* Use case to fetch the folio + name of the active "usuarios" patients */
class GetUsersClinicalListUseCase {
  constructor (userClinicalRepository) {
    this.userClinicalRepository = userClinicalRepository;
  }

  async execute ({ search = '', page = 1, limit = 10 }) {
    const [users, total] = await Promise.all([
      // Run queries in parallel
      this.userClinicalRepository.fetchActivePatients ({ search, page, limit }),
      this.userClinicalRepository.countActivePatients ({ search }),
    ]);

    return {
      // Map raw data to DTO for the output contract
      users: users.map (u => new userClinicalSummaryDTO(u)),

      // Pagination metadata
      total,
      page: Number (page),
      limit: Number (limit),

      // Calculate total pages
      totalPages: Math.ceil (total / limit),
    };
  }
}
module.exports = GetUsersClinicalListUseCase;
