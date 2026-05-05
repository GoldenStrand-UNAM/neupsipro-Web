const FinancialInterview = require("../../../domain/entity/FinancialInterview");
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

        let rawData;

        // fetch info from current section
        switch (current_section) {
            case 1:
                rawData = await this.financialInterviewRepository.fetchFinancialSituation({ id_user_relation });
                break;
            case 2:
                rawData = await this.financialInterviewRepository.fetchEscGov({ id_user_relation });
                break;
            case 3:
                rawData = await this.financialInterviewRepository.fetchAmaiQ({ id_user_relation });
                rawData = rawData[0];
                break;
            case 4:
                rawData = await this.financialInterviewRepository.fetchResults({ id_user_relation });
                rawData = rawData[0];
                break;
            default:
                throw new Error(`Invalid financial section:  ${current_section}`);
        }

        const entity = new FinancialInterview({
            current_section,
            data: rawData.data,
        });

        return entity;
    }
}

module.exports = FinancialInterviewUseCase;