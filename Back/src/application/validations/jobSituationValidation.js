const Validation = require('./validation');

const validation = new Validation();

// Validates the "Situación laboral" (work situation) section of the initial interview.
function validateJobSituation (data) {
  const hasJob = validation.validateBoolean({
    value: data.has_job,
    label: 'Si actualmente trabaja',
    required: false,
  });

  const workActivity = validation.validate({
    value: data.work_activity,
    requiredLength: 150,
    label: 'El tipo de actividad laboral',
    required: false,
  });

  const stressWork = validation.validate({
    value: data.stress_work,
    requiredLength: 150,
    label: 'El nivel de estrés en el trabajo',
    required: false,
  });

  const employmentStatus = validation.validate({
    value: data.employment_status,
    requiredLength: 150,
    label: 'El estado laboral actual',
    required: false,
  });

  const seniority = validation.validateNumber({
    value: data.seniority,
    label: 'La antigüedad',
    required: false,
  });

  return {
    has_job: hasJob,
    work_activity: workActivity,
    stress_work: stressWork,
    employment_status: employmentStatus,
    seniority,
  };
}

module.exports = validateJobSituation;
