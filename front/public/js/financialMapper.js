/* eslint-disable no-undef */

// Get info divided by section
function renderIncomesData (info) {

  document.getElementById('incomeExtra').value =
    info.income?.salary?.hasFinancingSchoolarship || '';

  document.getElementById('salaryBefore').value =
    info.income?.salary?.salaryBeforeSickness || '';

  document.getElementById('salaryAfter').value =
    info.income?.salary?.salaryAfterSickness || '';

  document.getElementById('totalSectionOne').textContent =
    `$${info.income?.salary?.total || 0}`;

  document.getElementById('totalIncomes').textContent =
    `$${info.income?.totalIncome || 0}`;
}

function renderContributorsData (info) {
  const container = document.getElementById('contributorsContainer');
  const addBtn = document.getElementById('addPersonBtn');
  const template = document.getElementById('personTemplate');

  if (info.income?.contributors?.list?.length) {

    info.income.contributors.list.forEach(person => {

      const clone = template.content.cloneNode(true);

      clone.querySelector('input[type="text"]').value =
        person.name || '';

      clone.querySelector('select').value =
        person.relation || '';

      clone.querySelector('input[type="number"]').value =
        person.income || 0;

      container.insertBefore(clone, addBtn);
    });
  }

  document.getElementById('totalSectionTwo').textContent =
    `$${info.income?.contributors?.total || 0}`;
}

function renderExpensesData (info) {
  const expenses = info.expenses?.expenseBreakdown || {};

  document.getElementById('food').value =
    expenses.foodExpenses || '';

  document.getElementById('rent').value =
    expenses.rentExpenses || '';

  document.getElementById('services').value =
    expenses.servicesExpenses || '';

  document.getElementById('gas').value =
    expenses.gasExpenses || '';

  document.getElementById('school').value =
    expenses.educationExpenses || '';

  document.getElementById('wardrope').value =
    expenses.wardrobeExpenses || '';

  document.getElementById('medic').value =
    expenses.medicalExpenses || '';

  document.getElementById('transport').value =
    expenses.transportExpenses || '';

  document.getElementById('credit').value =
    expenses.creditcardExpenses || '';

  document.getElementById('phone').value =
    expenses.phoneExpenses || '';

  document.getElementById('others').value =
    expenses.othersExpenses || '';

  document.getElementById('totalExpenses').textContent =
    `$${expenses.totalExpenses || 0}`;
}

// Call all functions to get data
function renderFinancialData () {

  const financial = window.financialData;

  if (!financial) return;

  const info = financial.data;

  // Incomes
  renderIncomesData(info);

  // Contributors
  renderContributorsData(info);

  // Expenses
  renderExpensesData(info);

  // Extra

  document.getElementById('economicSituation').value =
    info.expenses?.economicSituation || '';

  document.getElementById('numDependants').value =
    info.expenses?.numEconomicDependents || '';

  window.calculateTotal?.();
  window.calculateExpenses?.();

}

window.renderFinancialData = renderFinancialData;
