<div id="editUserModal" class="fixed inset-0 z-50 flex items-center justify-center hidden">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    <div class="relative bg-white rounded-2xl p-8 max-w-3xl w-full mx-4 shadow-2xl max-h-[90vh] flex flex-col">

        <!-- Header -->
        <div class="flex items-center justify-between mb-6 flex-shrink-0">
            <h2 class="text-xl font-semibold text-gray-900">Modificar usuario</h2>
            <button id="closeEditUserModal" class="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer" aria-label="Cerrar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Loading state -->
        <div id="editUserLoading" class="text-center py-12 text-gray-500">
            <p>Cargando datos del usuario...</p>
        </div>

        <!-- Load error state -->
        <div id="editUserLoadError" class="hidden text-center py-12 text-red-500">
            <p>No se pudieron cargar los datos del usuario.</p>
        </div>

        <!-- Form (hidden until data loads) -->
        <div id="editUserFormWrapper" class="hidden flex-1 overflow-y-auto pr-2 space-y-6">

            <!-- Section 1: Datos personales -->
            <section>
                <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 border-b border-gray-200 pb-2">Datos personales</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editProfilePhoto">Foto de perfil (URL)</label>
                        <input id="editProfilePhoto" type="text" maxlength="255" class="search-input_field w-full" placeholder="Dejar vacío para mantener la actual">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editUserName">Nombre de usuario *</label>
                        <input id="editUserName" type="text" maxlength="30" class="search-input_field w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editEmail">Correo</label>
                        <input id="editEmail" type="email" maxlength="158" class="search-input_field w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editFirstName">Nombre(s) *</label>
                        <input id="editFirstName" type="text" maxlength="30" class="search-input_field w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editLastnameP">Apellido paterno *</label>
                        <input id="editLastnameP" type="text" maxlength="30" class="search-input_field w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editLastnameM">Apellido materno</label>
                        <input id="editLastnameM" type="text" maxlength="30" class="search-input_field w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editBirthdate">Fecha de nacimiento *</label>
                        <input id="editBirthdate" type="date" class="search-input_field w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editSex">Sexo *</label>
                        <select id="editSex" class="search-input_field w-full">
                            <option value="">Selecciona...</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Sin especificar">Sin especificar</option>
                        </select>
                    </div>
                </div>
            </section>

            <!-- Section 2: Datos clínicos generales -->
            <section>
                <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 border-b border-gray-200 pb-2">Datos clínicos generales</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editReferenceNumber">Folio *</label>
                        <input id="editReferenceNumber" type="text" maxlength="10" class="search-input_field w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editPhase">Fase *</label>
                        <select id="editPhase" class="search-input_field w-full">
                            <option value="">Selecciona...</option>
                            <option value="Preprotésico">Preprotésico</option>
                            <option value="Protésico">Protésico</option>
                            <option value="Postprotésico">Postprotésico</option>
                            <option value="Adaptación al ejercicio">Adaptación al ejercicio</option>
                            <option value="Alta">Alta</option>
                            <option value="Baja de neuropsicología">Baja de neuropsicología</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editModality">Modalidad *</label>
                        <select id="editModality" class="search-input_field w-full">
                            <option value="">Selecciona...</option>
                            <option value="Rotaria">Rotaria</option>
                            <option value="Presencial">Presencial</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editPairs">Pares *</label>
                        <select id="editPairs" class="search-input_field w-full">
                            <option value="">Selecciona...</option>
                            <option value="Sí asiste">Sí asiste</option>
                            <option value="No asiste">No asiste</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editAssigned">Clínico asignado *</label>
                        <select id="editAssigned" class="search-input_field w-full">
                            <option value="">Cargando clínicos...</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editNeuroEntryDate">Ingreso a neuropsicología</label>
                        <input id="editNeuroEntryDate" type="date" class="search-input_field w-full">
                    </div>
                </div>
            </section>

            <!-- Section 3: Datos de amputación -->
            <section>
                <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 border-b border-gray-200 pb-2">Datos de amputación</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editBasePathology">Etiología *</label>
                        <input id="editBasePathology" type="text" maxlength="160" class="search-input_field w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editAmputationDate">Fecha de amputación *</label>
                        <input id="editAmputationDate" type="date" class="search-input_field w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editLaterality">Lateralidad *</label>
                        <select id="editLaterality" class="search-input_field w-full">
                            <option value="">Selecciona...</option>
                            <option value="Zurda">Zurda</option>
                            <option value="Diestra">Diestra</option>
                            <option value="Ambidiestra">Ambidiestra</option>
                        </select>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editAmputationLevel">Nivel de amputación *</label>
                        <input id="editAmputationLevel" type="text" maxlength="165" class="search-input_field w-full">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1" for="editProsthetist">Protesista *</label>
                        <input id="editProsthetist" type="text" maxlength="20" class="search-input_field w-full">
                    </div>
                </div>
            </section>

            <p id="editUserError" class="text-sm text-red-500 hidden"></p>
        </div>

        <!-- Footer -->
        <div class="flex gap-3 justify-end mt-6 flex-shrink-0 border-t border-gray-200 pt-4">
            <button class="btn-cancel" id="cancelEditUser">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span class="whitespace-nowrap">Cancelar</span>
            </button>
            <button class="btn-save" id="confirmEditUser" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-width="1.5" d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3zM15 4v5H6V4m6 14a3 3 0 1 1 0-6a3 3 0 0 1 6 0z"/>
                </svg>
                <span class="whitespace-nowrap">Guardar cambios</span>
            </button>
        </div>
    </div>
</div>

<script>
(function () {
    const modal           = document.getElementById('editUserModal');
    const btnOpen         = document.getElementById('btnEditUser');
    const btnClose        = document.getElementById('closeEditUserModal');
    const btnCancel       = document.getElementById('cancelEditUser');
    const btnConfirm      = document.getElementById('confirmEditUser');
    const loadingBox      = document.getElementById('editUserLoading');
    const loadErrorBox    = document.getElementById('editUserLoadError');
    const formWrapper     = document.getElementById('editUserFormWrapper');
    const errorBox        = document.getElementById('editUserError');

    const user   = window.__USER_DATA__ || {};
    const idUser = user.idUser;

    let clinicsLoaded = false;
    let dataLoaded    = false;

    const F = {
        profilePhoto    : document.getElementById('editProfilePhoto'),
        userName        : document.getElementById('editUserName'),
        email           : document.getElementById('editEmail'),
        firstName       : document.getElementById('editFirstName'),
        lastnameP       : document.getElementById('editLastnameP'),
        lastnameM       : document.getElementById('editLastnameM'),
        birthdate       : document.getElementById('editBirthdate'),
        sex             : document.getElementById('editSex'),
        referenceNumber : document.getElementById('editReferenceNumber'),
        phase           : document.getElementById('editPhase'),
        modality        : document.getElementById('editModality'),
        pairs           : document.getElementById('editPairs'),
        assigned        : document.getElementById('editAssigned'),
        neuroEntryDate  : document.getElementById('editNeuroEntryDate'),
        basePathology   : document.getElementById('editBasePathology'),
        amputationDate  : document.getElementById('editAmputationDate'),
        amputationLevel : document.getElementById('editAmputationLevel'),
        laterality      : document.getElementById('editLaterality'),
        prosthetist     : document.getElementById('editProsthetist'),
    };

    function showError (msg) {
        errorBox.textContent = msg;
        errorBox.classList.remove('hidden');
        formWrapper.scrollTo({ top: formWrapper.scrollHeight, behavior: 'smooth' });
    }
    function hideError () {
        errorBox.classList.add('hidden');
        errorBox.textContent = '';
    }

    // dd/mm/yyyy or any string → yyyy-mm-dd  (for <input type="date">)
    function toIsoDate (raw) {
        if (!raw) return '';
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
            const [d, m, y] = raw.split('/');
            return `${y}-${m}-${d}`;
        }
        const d = new Date(raw);
        if (isNaN(d.getTime())) return '';
        const yyyy = d.getFullYear();
        const mm   = String(d.getMonth() + 1).padStart(2, '0');
        const dd   = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    async function loadClinics () {
        if (clinicsLoaded) return;
        try {
            const res = await fetch('/api/clinics/list', { credentials: 'include' });
            if (!res.ok) throw new Error('No se pudieron cargar los clínicos');
            const clinics = await res.json();
            F.assigned.innerHTML = '<option value="">Selecciona un clínico</option>' +
                clinics.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.full_name)}</option>`).join('');
            clinicsLoaded = true;
        } catch (err) {
            F.assigned.innerHTML = '<option value="">Error al cargar</option>';
            console.error(err);
        }
    }

    async function loadEditData () {
        try {
            const res = await fetch(`/users/${idUser}/edit-data`, { credentials: 'include' });
            if (!res.ok) throw new Error('Error al cargar datos');
            const data = await res.json();
            populate(data.user || data);
            dataLoaded = true;
            loadingBox.classList.add('hidden');
            formWrapper.classList.remove('hidden');
            btnConfirm.disabled = false;
        } catch (err) {
            loadingBox.classList.add('hidden');
            loadErrorBox.classList.remove('hidden');
            console.error(err);
        }
    }

    function populate (d) {
        F.profilePhoto.value    = '';                              // dejar vacío para no sobreescribir si no se cambia
        F.userName.value        = d.user_name        || '';
        F.email.value           = d.email            || '';
        F.firstName.value       = d.first_name       || '';
        F.lastnameP.value       = d.lastname_p       || '';
        F.lastnameM.value       = d.lastname_m       || '';
        F.birthdate.value       = toIsoDate(d.birthdate);
        F.sex.value             = d.gender           || '';
        F.referenceNumber.value = d.reference_number || '';
        F.phase.value           = d.neuro_status     || '';
        F.modality.value        = d.modality         || '';
        F.pairs.value           = d.group_intervention || '';
        F.assigned.value        = d.id_clinic_user   || '';        // se aplica después de loadClinics
        F.neuroEntryDate.value  = toIsoDate(d.neuro_entry_date);
        F.basePathology.value   = d.base_patology    || '';
        F.amputationDate.value  = toIsoDate(d.amputation_date);
        F.amputationLevel.value = d.amputation_level || '';
        F.laterality.value      = d.laterality       || '';
        F.prosthetist.value     = d.prosthetist      || '';

        // Re-aplicar el clínico una vez que se carguen las opciones
        const assignedId = d.id_clinic_user;
        const trySetAssigned = () => {
            if (clinicsLoaded && assignedId) F.assigned.value = assignedId;
        };
        const interval = setInterval(() => {
            if (clinicsLoaded) { trySetAssigned(); clearInterval(interval); }
        }, 100);
        setTimeout(() => clearInterval(interval), 5000);
    }

    function openModal () {
        modal.classList.remove('hidden');
        hideError();
        loadingBox.classList.remove('hidden');
        loadErrorBox.classList.add('hidden');
        formWrapper.classList.add('hidden');
        btnConfirm.disabled = true;

        if (!dataLoaded) {
            loadClinics();
            loadEditData();
        } else {
            loadingBox.classList.add('hidden');
            formWrapper.classList.remove('hidden');
            btnConfirm.disabled = false;
        }
    }
    const closeModal = () => {
        modal.classList.add('hidden');
        hideError();
    };

    btnOpen?.addEventListener('click', openModal);
    btnClose?.addEventListener('click', closeModal);
    btnCancel?.addEventListener('click', closeModal);

    function validateClient () {
        const required = [
            ['userName',        'nombre de usuario'],
            ['firstName',       'nombre'],
            ['lastnameP',       'apellido paterno'],
            ['birthdate',       'fecha de nacimiento'],
            ['sex',             'sexo'],
            ['referenceNumber', 'folio'],
            ['phase',           'fase'],
            ['modality',        'modalidad'],
            ['pairs',           'pares'],
            ['assigned',        'clínico asignado'],
            ['basePathology',   'etiología'],
            ['amputationDate',  'fecha de amputación'],
            ['amputationLevel', 'nivel de amputación'],
            ['laterality',      'lateralidad'],
            ['prosthetist',     'protesista'],
        ];
        for (const [key, label] of required) {
            if (!F[key].value.trim()) {
                return `Falta capturar: ${label}`;
            }
        }
        return null;
    }

    btnConfirm?.addEventListener('click', async () => {
        hideError();

        const validationError = validateClient();
        if (validationError) return showError(validationError);

        const payload = {
            user_name        : F.userName.value.trim(),
            email            : F.email.value.trim() || null,
            first_name       : F.firstName.value.trim(),
            lastname_p       : F.lastnameP.value.trim(),
            lastname_m       : F.lastnameM.value.trim() || null,
            birthdate        : F.birthdate.value,
            gender           : F.sex.value,
            profile_photo    : F.profilePhoto.value.trim() || null,
            reference_number : F.referenceNumber.value.trim(),
            neuro_status     : F.phase.value,
            modality         : F.modality.value,
            group_intervention: F.pairs.value,
            id_clinic_user   : F.assigned.value,
            neuro_entry_date : F.neuroEntryDate.value || null,
            base_patology    : F.basePathology.value.trim(),
            amputation_date  : F.amputationDate.value,
            amputation_level : F.amputationLevel.value.trim(),
            laterality       : F.laterality.value,
            prosthetist      : F.prosthetist.value.trim(),
        };

        const originalHTML = btnConfirm.innerHTML;
        try {
            btnConfirm.disabled = true;
            btnConfirm.innerHTML = '<span>Guardando...</span>';

            const res = await fetch(`/users/${idUser}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': _csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al actualizar el usuario');

            showToast('Usuario actualizado con éxito', 'success');
            setTimeout(() => window.location.reload(), 1200);
        } catch (err) {
            showError(err.message);
            btnConfirm.disabled = false;
            btnConfirm.innerHTML = originalHTML;
        }
    });
})();
</script>
