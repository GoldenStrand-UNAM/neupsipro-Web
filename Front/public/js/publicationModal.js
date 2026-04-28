document.addEventListener('DOMContentLoaded', () => {
    const publications = document.querySelectorAll('[id^="p-"]');
    const publicationModal = document.getElementById('publicationContent');
    const publicationBox = document.getElementById('publicationBox')
    const closeIcon = document.getElementById('closeIconModal');

    const closeModal = () => {
        publicationBox.classList.add('hidden');
        publicationModal.innerHTML = `<p class="text-left font-['Roboto'] text-2xl sm:text-3xl text-black font-semibold leading-tight break-all">Cargando Publicación</p>`
    };
    closeIcon.addEventListener('click', closeModal);
    
    publications.forEach (publication => {
        publication.addEventListener('click', async (e) =>{
            const idModified = e.currentTarget.id;
            const id = idModified.replace('p-', '');
            publicationBox.classList.remove('hidden');
            try{
                console.log("SE VA A MANDAR ALGO 1")
                const publication = await fetch(`publication/${id}`)
                console.log(publication)
                console.log("SE VA A MANDAR ALGO 3")
                if (!publication.ok) throw new Error('Error al buscar publicación');
                const result = await publication.json();
                console.log("SE VA A MANDAR ALGO 3")
                console.log(result)
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