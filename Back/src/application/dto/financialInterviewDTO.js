class FinancialInterviewDTO {
  static fromEntity (entity) {
    return {
      current_step: entity.current_step || 2,
      current_section: entity.current_section,
      data: entity.data,
    };
  }
}

module.exports = FinancialInterviewDTO;
