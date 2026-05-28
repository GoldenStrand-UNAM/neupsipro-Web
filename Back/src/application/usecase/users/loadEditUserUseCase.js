
const { getPresignedUrl } = require('../../../infrastructure/external/s3.config');

function formatDate (raw) {
  if (!raw) return null;
  if (typeof raw === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(raw)) return raw;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  const dd   = String(d.getDate()).padStart(2, '0');
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

class loadEditUserUseCase {
  constructor (userRepository) {
    this.userRepository = userRepository;
  }

  async execute ({ id_user }) {
    const user = await this.userRepository.fetchUserForEdit({ id_user });
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.status = 404;
      throw err;
    }

    const photoUrl = user.profile_photo
      ? await getPresignedUrl(user.profile_photo)
      : null;

    return {
      idUser          : user.id_user,
      userName        : user.user_name,
      firstName       : user.first_name,
      lastnameP       : user.lastname_p,
      lastnameM       : user.lastname_m,
      email           : user.email,
      phone           : user.phone || null,
      birthdate       : formatDate(user.birthdate),
      sex             : user.gender,
      photo           : photoUrl,
      referenceNumber : user.reference_number,
      modality        : user.modality,
      neuroEntryDate  : formatDate(user.neuro_entry_date),
      pairs           : user.group_intervention,
      amputationDate  : formatDate(user.amputation_date),
      basePathology   : user.base_patology,
      amputationLevel : user.amputation_level,
      laterality      : user.laterality,
      prosthetist     : user.prosthetist,
      phase           : user.neuro_status,
      idClinicUser    : user.id_clinic_user,
    };
  }
}

module.exports = loadEditUserUseCase;