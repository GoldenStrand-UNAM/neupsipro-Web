class ClinicalInterviewDTO {
 
  static fromEntity (entity) {
    if (!entity) return null;
 
    return {
      current_step: entity.current_step,
      current_section: entity.current_section,
      refNumber: entity.refNumber,
      data: {
        section: entity.data?.section || {},
        completedSteps: entity.data?.completedSteps || [],
        completedSubSteps: entity.data?.completedSubSteps || [],
        status: entity.data?.status || 'to_start',
      },
    };
  }
}
 
module.exports = ClinicalInterviewDTO;
 