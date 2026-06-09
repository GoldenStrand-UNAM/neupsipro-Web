class IdentificationInterviewDTO {
  static fromEntity (entity) {
    return {
      current_step: entity.current_step || 1,
      current_section: entity.current_section,
      data: entity.data,
    };
  }
}

module.exports = IdentificationInterviewDTO;