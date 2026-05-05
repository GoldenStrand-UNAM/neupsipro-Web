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
            hasFinancingSchoolarship: Number(base.has_financing_schoolarship) || 0,
            financialType: Number(base.financial_type) || 0,
            salaryBeforeSickness: Number(base.salary_before_sickness) || 0,
            salaryAfterSickness: Number(base.salary_after_sickness) || 0,
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
            totalIncome: Number(base.total_income) || 0,
        };
    }

    // Build All expense structure
    buildExpenses (base) {
        return {
            expenseBreakdown: {
                foodExpenses: Number(base.food_expenses) || 0,
                rentExpenses: Number(base.rent_expenses) || 0,
                servicesExpenses: Number(base.services_expenses) || 0,
                gasExpenses: Number(base.gas_expenses) || 0,
                educationExpenses: Number(base.education_expenses) || 0,
                wardrobeExpenses: Number(base.wardrobe_expenses) || 0,
                medicalExpenses: Number(base.medical_expenses) || 0,
                transportExpenses: Number(base.transport_expenses) || 0,
                creditcardExpenses: Number(base.creditcard_expenses) || 0,
                phoneExpenses: Number(base.phone_expenses) || 0,
                othersExpenses: Number(base.others_expenses) || 0,
                totalExpenses: Number(base.total_expenses) || 0,
            },
            economicSituation: base.economic_situation ?? null,
            numEconomicDependents: Number(base.num_economic_dependents) || 0,
        };
    }

    // ================================= Map =================================

    // Financial Situation
    mapFinancialSituation (data) {
        const base = data.base || {};
        const contributors = data.contributors || [];

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
    mapEscGovernment (datas) {
        const data = Array.isArray(datas) ? datas[0] : datas;

        return {
            minIncome: Number(data.min_income) || 0,
            ocupation: data.ocupation ?? null,
            familyExpenses: Number(data.family_expenses) || 0,

            housing: {
                realRight: Number(data.real_right) || 0,
                housingType: Number(data.housing_type) || 0,
                publicServices: Number(data.public_services) || 0,
                inhomeServices: Number(data.inhome_services) || 0,
                constructionMaterial: Number(data.construction_material) || 0,
                numBedrooms: Number(data.num_bedrooms) || 0,
                personsPerBedroom: Number(data.persons_per_bedroom) || 0,
            },

            family_conditions: {
                treatmentTime: Number(data.treatment_time) || 0,
                otherProblems: Number(data.other_problems) || 0,
                familyHealth: Number(data.family_health) || 0,
            },

            socioeconomicLevel: data.socioeconomic_level ?? null,
            total: Number(data.total) || 0,
        };
    }

    // AMAI Questionary
    mapAmai (datas) {
        const data = Array.isArray(datas) ? datas[0] : datas;

        return {
            lastStudies: data.last_studies ?? null,
            numBathrooms: Number(data.num_bathrooms) || 0,
            numCar: Number(data.num_car) || 0,
            hasInternet: Number(data.has_internet) || 0,
            hasWorked: Number(data.has_worked) || 0,
            hasBedroom: Number(data.has_bedroom) || 0,

            socioeconomicLevel: data.socioeconomic_level?? null,
            total: Number(data.total) || 0,
        };
    }

    // Results
    mapResults (datas) {
        const data = Array.isArray(datas) ? datas[0] : datas;

        return {
            totalIncome: Number(data.total_income) || 0,
            totalExpenses: Number(data.total_expenses) || 0,

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