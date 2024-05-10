document.addEventListener('DOMContentLoaded', function() {
    // Generate timestamp and hash values
    var ts = Math.floor(Date.now() / 1000);
    var privateKey = '5d3e82e10de9d7883de36483ecd1f2beefb66dd0';
    var publicKey = 'f2e74210c52bf5a76d2f06a6cabdd5e2';
    var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
    console.log(hash);

    // Make API request
    var apiUrl = `https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            var comics = data.data.results;
            // Store the data in local storage
            localStorage.setItem('comics', JSON.stringify(comics));

            // Display all comic cards
            displayAllComics(comics);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Event listener for search input
    document.querySelector('#searchInput').addEventListener('input', function() {
        var searchTerm = this.value.toLowerCase(); 
        var resultContainer = document.getElementById('resultContainer');
        resultContainer.innerHTML = '';

        // Retrieve data from local storage
        var comics = JSON.parse(localStorage.getItem('comics'));

        if (comics) {
            // Filter comics based on search term
            var filteredComics = comics.filter(comic => comic.title.toLowerCase().includes(searchTerm));

            // Display filtered comic details
            filteredComics.forEach(comic => {
                var comicDiv = createComicCardElement(comic);
                resultContainer.appendChild(comicDiv);
            });
        }
    });
});

function displayAllComics(comics) {
    var resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';

    comics.forEach(comic => {
        var comicDiv = createComicCardElement(comic);
        resultContainer.appendChild(comicDiv);
    });
}

function createComicCardElement(comic) {
    var comicDiv = document.createElement('div');
    comicDiv.classList.add('card');
    
    var isFavorited = JSON.parse(localStorage.getItem('favorites'))?.includes(comic.id);
    // Construct the card content
    comicDiv.innerHTML = `
                            <div class="card-image">
                                <figure class="image is-5by4" style="width: 100%;">
                                    <img src="${comic.thumbnail.path + '.' + comic.thumbnail.extension}" alt="${comic.title}">
                                </figure>
                            </div>
                            <div class="control">
                            <span class="icon" id="favoriteButton-${comic.id}">
    <i class="fas fa-heart heart-icon ${localStorage.getItem('favorites')?.includes(comic.id) ? 'favorited' : 'not-favorited'}"></i>
</span>
                        </div>
                            <div class="card-content">
                                <div class="media">
                                    <div class="media-left">
                                    </div>
                                    <div class="media-content">
                                        <p class="title is-4">${comic.title}</p>
                                        <p class="subtitle is-6">${comic.series.name ? comic.series.name : 'N/A'}</p>
                                    </div>
                                </div>
                                <div class="content">
                                    ${comic.description ? comic.description : 'Description is not available'}
                                    <br />
                                    <time datetime="2016-1-1">${comic.modified}</time>
                                    <br />
                                    <a href="details.html?comicId=${comic.id}">Details</a>
                                </div>
                            </div>
                    
    `;
    // Add event listener to the favorite button
    comicDiv.querySelector(`#favoriteButton-${comic.id}`).addEventListener('click', function() {
        // Toggle the favorited state
        isFavorited = !isFavorited;

        // Update the heart icon
        var heartIcon = comicDiv.querySelector('.fa-heart');
        heartIcon.classList.toggle('hidden');
        heartIcon.classList.toggle('hidden-favorited');

        // Update the favorites in local storage
        var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (isFavorited) {
            favorites.push(comic.id);
            heartIcon.classList.remove('not-favorited');
            heartIcon.classList.add('favorited');
        } else {
            favorites = favorites.filter(id => id !== comic.id);
            heartIcon.classList.remove('favorited');
        heartIcon.classList.add('not-favorited');
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    });
    return comicDiv;
}
