class FinancialInterviewUseCase {
    constructor (financialInterviewRepository) {
        this.financialInterviewRepository = financialInterviewRepository;
    }

    async execute ({ id_user }) {

        // fetch  relation
        const relationResult = await this.financialInterviewRepository.fetchRelation({ id_user });
        const id_user_relation = relationResult[0][0]?.id_user_relation;

        // fetch current section
        const sectionResult = await this.financialInterviewRepository.fetchCurrentSection({ id_user_relation });
        const current_section = sectionResult[0][0]?.current_section;

        let data;

        // fetch info from current section
        switch (current_section) {
            case 1:
                data = await this.financialInterviewRepository.fetchFinancialSituation({ id_user_relation });
                break;

            case 2:
                data = await this.financialInterviewRepository.fetchEscGov({ id_user_relation });
                data = data[0];
                break;

            case 3:
                data = await this.financialInterviewRepository.fetchAmaiQ({ id_user_relation });
                data = data[0];
                break;

            case 4:
                data = await this.financialInterviewRepository.fetchResults({ id_user_relation });
                data = data[0];
                break;

            default:
                throw new Error(`Invalid financial section:  ${current_section}`);
        }

        return {
            data,
        };
    }
}

module.exports = FinancialInterviewUseCase;