class FinancialInterview {
    constructor ({ current_section, data }) {
        this.current_section = current_section;

        switch (current_section) {
            case 1:
                this.data = this.mapFinancialSituation(data);
                break;

            case 2:
                this.data = this.mapEscGovernment(data);
                break;

            case 3:
                this.data = this.mapAmai(data);
                break;

            case 4:
                this.data = this.mapResults(data);
                break;

            default:
                throw new Error("Invalid section");
        }
    }

    // =============================== Funtions ===============================


    // --------- Financial Situation Functions ---------

    // Salary after + schoolarship = Total Salary
    calculateTotalSalary (data) {
        const salaryAfter = Number(data.salary_after_sickness) || 0;
        const scholarship = Number(data.scholarship) || 0;

        return salaryAfter + scholarship;
    }

    // Build Salary section especification
    buildSalary (base) {
        return {
            has_financing_schoolarship: Number(base.has_financing_schoolarship) || 0,
            financial_type: Number(base.financial_type) || 0,
            salary_before_sickness: Number(base.salary_before_sickness) || 0,
            salary_after_sickness: Number(base.salary_after_sickness) || 0,
            total: this.calculateTotalSalary(base) || 0,
        };
    }

    // Build All income structure
    buildIncome (base, contributors, totalContributors) {
        return {
            salary: this.buildSalary(base),
            contributors: {
                list: contributors,
                total: totalContributors,
            },
            total_income: Number(base.total_income) || 0,
        };
    }

    // Build All expense structure
    buildExpenses (base) {
        return {
            expense_breakdown: {
                food_expenses: Number(base.food_expenses) || 0,
                rent_expenses: Number(base.rent_expenses) || 0,
                services_expenses: Number(base.services_expenses) || 0,
                gas_expenses: Number(base.gas_expenses) || 0,
                education_expenses: Number(base.education_expenses) || 0,
                wardrobe_expenses: Number(base.wardrobe_expenses) || 0,
                medical_expenses: Number(base.medical_expenses) || 0,
                transport_expenses: Number(base.transport_expenses) || 0,
                creditcard_expenses: Number(base.creditcard_expenses) || 0,
                phone_expenses: Number(base.phone_expenses) || 0,
                others_expenses: Number(base.others_expenses) || 0,
                total_expenses: Number(base.total_expenses) || 0,
            },
            economic_situation: base.economic_situation ?? null,
            num_economic_dependents: Number(base.num_economic_dependents) || 0,
        };
    }

    // ================================= Map =================================

    // Financial Situation
    mapFinancialSituation (data) {
        const base = data.base || {};
        const contributors = data.contributors[0] || [];

        const formattedContributors = contributors.map(c => ({
            name: c.contributor ?? null,
            relation: c.relation ?? null,
            income: Number(c.income) || 0,
        }));

        const totalContributors = formattedContributors
            .reduce((sum, c) => sum + c.income, 0);

        return {
            income: this.buildIncome(base, formattedContributors, totalContributors),
            expenses: this.buildExpenses(base),
        };
    }

    // ESC Goverment
    mapEscGovernment (data) {
        return {
            min_income: Number(data.min_income) || 0,
            ocupation: data.ocupation ?? null,
            family_expenses: Number(data.family_expenses) || 0,

            housing: {
                real_right: Number(data.real_right) || 0,
                housing_type: Number(data.housing_type) || 0,
                public_services: Number(data.public_services) || 0,
                inhome_services: Number(data.inhome_services) || 0,
                construction_material: Number(data.construction_material) || 0,
                num_bedrooms: Number(data.num_bedrooms) || 0,
                persons_per_bedroom: Number(data.persons_per_bedroom) || 0,
            },

            family_conditions: {
                treatment_time: Number(data.treatment_time) || 0,
                other_problems: Number(data.other_problems) || 0,
                family_health: Number(data.family_health) || 0,
            },

            socioeconomic_level: data.socioeconomic_level ?? null,
            total: Number(data.total) || 0,
        };
    }

    // AMAI Questionary
    mapAmai (data) {
        return {
            last_studies: data.last_studies ?? null,
            num_bathrooms: Number(data.num_bathrooms) || 0,
            num_car: Number(data.num_car) || 0,
            has_internet: Number(data.has_internet) || 0,
            has_worked: Number(data.has_worked) || 0,
            has_bedroom: Number(data.has_bedroom) || 0,

            socioeconomic_level: data.socioeconomic_level?? null,
            total: Number(data.total) || 0,
        };
    }

    // Results
    mapResults (data) {
        return {
            total_income: Number(data.total_income) || 0,
            total_expenses: Number(data.total_expenses) || 0,

            government: {
                level: data.socio_level_gov ?? null,
                score: Number(data.total_gov) || 0,
            },

            amai: {
                level: data.socio_level_amai,
                score: Number(data.total_amai) || 0,
            },
        };
    }
}

module.exports = FinancialInterview;