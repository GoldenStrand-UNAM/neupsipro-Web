const userClinicalSummaryDTO = require('../../dto/userClinicalSummaryDTO');
const crypt = require('../../../infrastructure/crypt/clinical/getClinicals');

/* Use case to fetch the folio + name of the active "usuarios" patients */
class GetUsersClinicalListUseCase {
  constructor (userClinicalRepository) {
    this.userClinicalRepository = userClinicalRepository;
  }

  async execute ({ search = '', page = 1, limit = 10 }) {
    const [users, total] = await Promise.all([
      // Run queries in parallel
      this.userClinicalRepository.fetchActivePatients ({ page, limit }),
      this.userClinicalRepository.countActivePatients (),
    ]);

    const filteredClinicals = users
      .filter(user => {
        if (!search) return true;

        const searchLower = search.toLowerCase();
        const fullName = user.fullName.toLowerCase();
        const referenceNumber = (user.referenceNumber || '').toLowerCase();
        return (fullName.includes(searchLower) || referenceNumber.includes(searchLower));
      });

    return {
      // Map raw data to DTO for the output contract
      users: filteredClinicals.map (u => new userClinicalSummaryDTO(u)),

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
