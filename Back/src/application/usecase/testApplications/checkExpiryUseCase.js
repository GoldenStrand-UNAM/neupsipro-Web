class checkExpiryUseCase {

  constructor (testApplicationRepository, testResultsRepository) {
    this.appRepo     = testApplicationRepository;
    this.resultsRepo = testResultsRepository;
  }

  #resolveExpiryMonths (protocol) {
    if (protocol === 'Research') return 6;
    if (protocol === 'Clinical') return 3;
    return 6;
  }

  #monthsElapsed (date) {
    if (!date) return 0;
    const now  = new Date();
    const past = new Date(date);
    return (now.getFullYear() - past.getFullYear()) * 12
      + (now.getMonth() - past.getMonth());
  }

  // Returns the new status (2, 3, 5) or null if no update is needed.
  #evaluateApp (app, tests, expiryMonths) {
    if (tests.length > 0 && tests.every(t => t.status === 3)) return 3;

    const hasExpiredTest = tests.some(t => {
      if (t.status === 3) return false;
      const ref = t.date_applied ?? app.created_at;
      return this.#monthsElapsed(ref) >= expiryMonths;
    });
    if (hasExpiredTest) return 5;

    if (tests.some(t => t.status === 3) && app.status !== 2) return 2;

    return null;
  }

  async execute ({ id_user }) {
    const userRecord = await this.appRepo.fetchUserProtocol({ id_user });

    if (!userRecord) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    const expiryMonths = this.#resolveExpiryMonths(userRecord.protocol);
    const activeApps   = await this.appRepo.fetchActiveApplicationsByUser({ id_user });

    // Phase 1 — fetch all test lists in parallel, paired with their app
    const appTestPairs = await Promise.all(activeApps.map(async app => {
      const tests = await this.resultsRepo.fetchTestsWithDateByApplication({ id_application: app.id_application });
      return { app, tests };
    }));

    const expired    = [];
    const completed  = [];
    const inProgress = [];
    const updates    = [];

    for (const { app, tests } of appTestPairs) {
      const newStatus = this.#evaluateApp(app, tests, expiryMonths);

      if (newStatus === 3) {
        completed.push(app.id_application);
        updates.push(this.appRepo.updateApplicationStatus({ id_application: app.id_application, status: 3 }));
      } else if (newStatus === 5) {
        expired.push(app.id_application);
        updates.push(this.appRepo.updateApplicationStatus({ id_application: app.id_application, status: 5 }));
        updates.push(this.resultsRepo.expireIncompleteTests({ id_application: app.id_application }));
      } else if (newStatus === 2) {
        inProgress.push(app.id_application);
        updates.push(this.appRepo.updateApplicationStatus({ id_application: app.id_application, status: 2 }));
      }
    }

    // Phase 2 — run all writes in parallel
    await Promise.all(updates);

    return { expired, completed, inProgress };
  }
}

module.exports = checkExpiryUseCase;
