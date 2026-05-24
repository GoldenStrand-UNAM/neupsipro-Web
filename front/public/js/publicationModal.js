/* eslint-disable no-undef */
/* eslint-disable max-lines-per-function */
document.addEventListener('DOMContentLoaded', () => {

  const publications = document.querySelectorAll('[id^="p-"]');
  const publicationModal = document.getElementById('publicationContent');
  const publicationBox = document.getElementById('publicationBox');
  const closeIcon = document.getElementById('closeIconModal');

  const deleteModal = document.getElementById('deletePostModal');
  const cancelDeleteBtn = document.getElementById('cancelDeletePost');
  const confirmDeleteBtn = document.getElementById('confirmDeletePost');

  let currentPostId = null;

  const closeModal = () => {
    publicationBox.classList.add('hidden');
    publicationModal.innerHTML = '<p class="text-left font-[\'Roboto\'] text-2xl sm:text-3xl text-black font-semibold leading-tight break-all"> Publicación no encontrada! </p>';
    currentPostId = null;

  };

  const modalHTML = (dto) => {
    const publication = dto.publication[0];
    const date = formatDate(publication.date);

    // This was changed from ejs to js by AI
    return `
    <div class="flex items-center sm:flex-row gap-4 p-6">
    ${publication.pp
    ? `<img class="w-15 h-15 rounded-full object-cover border-2 border-gray-100" src="${publication.pp}">`
    : `<div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
                ${publication.firstName ? publication.firstName.charAt(0).toUpperCase() : '?'}
               </div>`
}
        <div>
            <p class="font-['Roboto'] text-base sm:text-xl text-black font-medium leading-tight">${publication.firstName}</p>
        </div>
        <div>
            <p class="font-['Roboto'] text-xs sm:text-sm text-gray-500 wrap-break-word">${date}</p>
        </div>
    </div>

    <div class="flex sm:flex-row gap-2 px-6 py-4 sm:py-2 justify-between">
        ${publication.title
    ? `<p class="text-left font-['Roboto'] text-2xl sm:text-3xl text-black font-semibold leading-tight break-all">${publication.title}</p>
    <button id="btnOpenDeletePost"
            class="p-1 hover:text-red-500 cursor-pointer"
            title="Eliminar publicación">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
    </button>    
    `
    : ''
}
    </div>

    <div class="flex sm:flex-row gap-2 px-6 py-4 min-w-0">
        ${publication.content
    ? `<p class="wrap-break-word min-w-0 w-full overflow-hidden text-left font-['Roboto'] text-base sm:text-xl text-black font-regular leading-tight">${publication.content}</p>`
    : ''
}
    </div>

    <div class="flex sm:flex-row gap-2 px-6 py-4">
        ${publication.image
    ? `<div class="w-full max-w-sm mx-auto mt-8 rounded-[10px] overflow-hidden" style="aspect-ratio: 1/1;">
                <img class="w-full h-full object-cover" src="${publication.image}" alt="Imagen del post" loading="lazy">
               </div>`
    : ''
}
    </div>
    <!-- Buttons -->
    <div class="flex sm:flex-row gap-2 px-6 py-4"> 
    <button class="p-1 hover:text-red-500 cursor-pointer" onclick="window.location.href = '/construction'">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
    </button>  
    <p class="font-['Roboto'] text-lg sm:text-2xl text-gray-500 whitespace-nowrap pt-2 px-2">${dto.likes}</p>
    <button class="p-1 hover:text-gray-500 cursor-pointer" onclick="window.location.href = '/construction'">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
    </button>  
        <p class="font-['Roboto'] text-lg sm:text-2xl text-gray-500 whitespace-nowrap pt-2 px-2">${dto.comments}</p>
    </div>
    <!-- Hidden button forfuture functionality -->
    <div class="hidden input-div py-8 px-6">
        <input id="comment" type="text" name="comment" placeholder="Escribe un comentario..." class="input-base" maxlength="200">
        <small id="usernameMessage" hidden>Alcanzaste el límite de caracteres permitido</small>
    </div>

    ${dto.interactionList && dto.interactionList.length > 0
    ? dto.interactionList.map(interaction => `
            <div class="flex items-center sm:flex-row gap-4 px-6 py-2">
                ${interaction.pp
    ? `<img class="w-15 h-15 rounded-full object-cover border-2 border-gray-100" src="${interaction.pp}">`
    : `<div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
                        ${interaction.firstName ? interaction.firstName.charAt(0).toUpperCase() : '?'}
                       </div>`
}
                <div>
                    <p class="font-['Roboto'] text-base sm:text-xl text-black font-medium leading-tight">${interaction.firstName}</p>
                </div>
            </div>
            <div class=" flex sm:flex-row gap-2 px-7 py-2">
                ${interaction.content
    ? `<p class= "break-words w-full text-left font-['Roboto'] text-base sm:text-xl text-black font-regular leading-tight">${interaction.content}</p>`
    : ''
}
            </div>
        `).join('')
    : ''
}
    `;
  };
  closeIcon.addEventListener('click', closeModal);

  document.addEventListener('click', (e) => {
    if (e.target.closest('#btnOpenDeletePost')) {
      deleteModal.classList.remove('hidden');
    }
  });

  cancelDeleteBtn?.addEventListener('click', () => {
    deleteModal.classList.add('hidden');
  });

  confirmDeleteBtn?.addEventListener('click', async () => {
    if (!currentPostId) return;

    const original = confirmDeleteBtn.innerHTML;

    try {
      confirmDeleteBtn.disabled = true;
      confirmDeleteBtn.innerHTML = '<span class="whitespace-nowrap">Eliminando...</span>';

      const res = await fetch(`/publication/${currentPostId}`, {
        method: 'DELETE',
        headers: { 'x-csrf-token': _csrfToken },
        credentials: 'include',
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Error al eliminar');
      }

      // Close both modals
      deleteModal.classList.add('hidden');
      closeModal();

      sessionStorage.setItem('pendingToast', JSON.stringify({
        message: 'Publicación eliminada con éxito',
        type: 'success',
      }));

      window.location.href = '/forum';
      currentPostId = null;

    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.innerHTML = original;
    }
  });

  publications.forEach (publication => {
    publication.addEventListener('click', async (e) =>{
      const idModified = e.currentTarget.id;
      const id = idModified.replace('p-', '');
      currentPostId = id;
      publicationBox.classList.remove('hidden');
      try {
        const publication = await fetch(`/publication/${id}`);
        if (!publication.ok) throw new Error('Error al buscar publicación');
        publicationModal.innerHTML =
          `<p class="text-left font-['Roboto'] text-2xl sm:text-3xl text-black font-semibold leading-tight break-all"> Publicación no encontrada!</p>
          `;
        const result = await publication.json();
        if (result.success) {
          publicationModal.innerHTML = modalHTML(result.dto);
        }
      }
      catch (error) {
        console.error('Error:', error);
      }
    });
  });

});
