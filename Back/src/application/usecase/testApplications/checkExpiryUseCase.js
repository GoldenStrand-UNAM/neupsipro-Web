class checkExpiryUseCase {

  constructor (testApplicationRepository, testResultsRepository) {
    this.appRepo    = testApplicationRepository;
    this.resultsRepo = testResultsRepository;
  }

  // Resolves expiry threshold in months based on user protocol.
  #resolveExpiryMonths (protocol) {
    if (protocol === 'Research') return 6;
    if (protocol === 'Clinical') return 3;
    return 6; // default to most permissive if unknown
  }

  // Calculates months elapsed between two dates.
  #monthsElapsed (createdAt) {
    const now     = new Date();
    const created = new Date(createdAt);
    return (now.getFullYear() - created.getFullYear()) * 12
      + (now.getMonth() - created.getMonth());
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

    // 3. Evaluate each active application
    for (const app of activeApps) {

      // 3a. Check if all tests in this application are graded
      const statuses     = await this.resultsRepo.fetchTestStatusByApplication({
        id_application: app.id_application,
      });

      const allCalificada = statuses.length > 0 &&
        statuses.every(s => s === 3);

      if (allCalificada) {
        // All tests graded — mark application as completed, skip expiry check
        await this.appRepo.updateApplicationStatus({
          id_application: app.id_application,
          status:         3,
        });
        completed.push(app.id_application);
        continue;
      }

      // 3b. Not all graded — check if expiry threshold has been crossed
      const months = this.#monthsElapsed(app.created_at);

      if (months >= expiryMonths) {
        // Expire the application and all its incomplete tests
        await this.appRepo.updateApplicationStatus({
          id_application: app.id_application,
          status:         5,
        });

        await this.resultsRepo.expireIncompleteTests({
          id_application: app.id_application,
        });

        expired.push(app.id_application);
      }
    }

    // 4. Return summary — front uses this to show banners
    return { expired, completed };
  }
}

module.exports = checkExpiryUseCase;