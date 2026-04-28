document.addEventListener('DOMContentLoaded', () => {
    const publications = document.querySelectorAll('[id^="p-"]');
    const publicationModal = document.getElementById('publicationModal');
    const closeIcon = document.getElementById('closeIconModal');

    const closeModal = () => {
        publicationModal.classList.add('hidden');
    };
    closeIcon.addEventListener('click', closeModal);
    
    publications.forEach (publication => {
        publication.addEventListener('click', async (e) =>{
            const idModified = e.currentTarget.id;
            const id = idModified.replace('p-', '');
            publicationModal.classList.remove('hidden');
            try{
                const publication = await fetch(`publication/${id}`)
                if (!publication.ok) throw new Error('Error al buscar publicación');
                const result = await publication.json();
                if (result.success) {
                    publicationModal.innerHTML = result.html;
                }
            }
            catch (error) {
                console.error('Error:', error);
            }
        })
    });



});