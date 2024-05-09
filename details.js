document.addEventListener('DOMContentLoaded', function() {
    const comicDetailsContainer = document.getElementById('comicDetailsContainer');
    
    // Retrieve comics data from local storage
    const comicsData = JSON.parse(localStorage.getItem('comics')) || [];
    console.log(comicsData);
    // Get the comic ID from the URL parameter
    const comicId = new URLSearchParams(window.location.search).get('comicId');
    // Find the selected comic by ID
    const selectedComic = comicsData.find(comic => comic.id === parseInt(comicId));
    console.log(selectedComic);
    
    // Display the comic details
    if (selectedComic) {
        comicDetailsContainer.innerHTML = `
            <div >
                <div class="card-content">
                <p class="title">${selectedComic.title}</p>
                <p class="subtitle">${selectedComic.description}</p>
                <p>Price: ${(selectedComic.prices[0].price * 84).toFixed(2)} ₹</p>
                <p>Publisher: ${selectedComic.series.name}</p>
                <p>Characters: ${selectedComic.characters.available}</p>
                <p>Collections: ${selectedComic.collections.length}</p>
                <p>Creators: ${selectedComic.creators.available}</p>
                <p>Images: ${selectedComic.images.length}</p>
                <p>Modified: ${selectedComic.modified}</p>
                <p>Page Count: ${selectedComic.pageCount}</p>
                <p>Resource URI:<a> ${selectedComic.resourceURI}</a></p>
                <p>Series: ${selectedComic.series.name}</p>
                <p>Stories: ${selectedComic.stories.available}</p>
                <p>Text Objects: ${selectedComic.textObjects.length}</p>
                <p>Variants: ${selectedComic.variants.length}</p>
                </div>
            </div>
        `;
    }
});