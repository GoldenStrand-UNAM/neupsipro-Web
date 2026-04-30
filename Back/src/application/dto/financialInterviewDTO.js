class FinancialInterviewDTO {
    static fromEntity (entity) {
        return {
            current_section: entity.current_section,
            data: entity.data,
        };
    }
}

module.exports = FinancialInterviewDTO;