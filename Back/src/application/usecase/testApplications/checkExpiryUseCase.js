class checkExpiryUseCase {

  constructor (testApplicationRepository, testResultsRepository) {
    this.appRepo     = testApplicationRepository;
    this.resultsRepo = testResultsRepository;
  }

  // Resolves expiry threshold in months based on user protocol.
  #resolveExpiryMonths (protocol) {
    if (protocol === 'Research') return 6;
    if (protocol === 'Clinical') return 3;
    return 6;
  }

  // Calculates months elapsed between a given date and today.
  #monthsElapsed (date) {
    if (!date) return 0;
    const now     = new Date();
    const past    = new Date(date);
    return (now.getFullYear() - past.getFullYear()) * 12
      + (now.getMonth() - past.getMonth());
  }

  async execute ({ id_user }) {

    // 1. Fetch user protocol to determine expiry threshold
    const userRecord = await this.appRepo.fetchUserProtocol({ id_user });

    if (!userRecord) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    const expiryMonths = this.#resolveExpiryMonths(userRecord.protocol);

    // 2. Fetch only active applications — skip completed (3) and already expired (5)
    const activeApps = await this.appRepo.fetchActiveApplicationsByUser({ id_user });

    const expired   = [];
    const completed = [];

    for (const app of activeApps) {

      // 3. Fetch all tests for this application
      const tests = await this.resultsRepo.fetchTestsWithDateByApplication({
        id_application: app.id_application,
      });

      // 4. Check if all tests are graded
      const allCalificada = tests.length > 0 && tests.every(t => t.status === 3);

      if (allCalificada) {
        // All graded — mark application as completed, skip expiry
        await this.appRepo.updateApplicationStatus({
          id_application: app.id_application,
          status: 3,
        });
        completed.push(app.id_application);
        continue;
      }

      // 5. Check if any incomplete test has been pending too long.
      // A test is expired if:
      // - status !== 3 (not graded)
      // - AND date_applied is set AND months elapsed >= threshold
      // - OR date_applied is null but created_at of application >= threshold
      const hasExpiredTest = tests.some(t => {
        if (t.status === 3) return false;

        // Use date_applied if available, otherwise fall back to application created_at
        const referenceDate = t.date_applied ?? app.created_at;
        return this.#monthsElapsed(referenceDate) >= expiryMonths;
      });

      if (hasExpiredTest) {
        // Expire the application and all its incomplete tests
        await this.appRepo.updateApplicationStatus({
          id_application: app.id_application,
          status: 5,
        });

        await this.resultsRepo.expireIncompleteTests({
          id_application: app.id_application,
        });

        expired.push(app.id_application);
      }
    }

    return { expired, completed };
  }
}

module.exports = checkExpiryUseCase;
