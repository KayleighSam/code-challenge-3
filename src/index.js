//adding an Event listener 
document.addEventListener("DOMContentLoaded", () => {
    //declaring variables which are assigned to the elements with their id
    const filmsList = document.getElementById('films');
    const filmRuntime = document.getElementById('runtime');
    const filmTime = document.getElementById('showtime');
    const filmTitle = document.getElementById('title');
    const filmPoster = document.getElementById('poster');
    const filmAvailableTickets = document.getElementById('ticket-num');
    const filmInformation = document.getElementById('film-info');
    const buyTicketBtn = document.getElementById('buy-ticket');
    let currentFilm = null;
  
    // show details of the first movie
    function filmDisplay() {
      fetch('http://localhost:3000/films/1')
        .then(response => response.json())
        .then(film => {
          displayMovieDetails(film);
        
        });
    }
  


    // Fetch and display all films 
    function displayFilmList() {
      fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(films => {
          films.forEach(film => {
            const li = document.createElement('li');
            li.textContent = film.title;
            li.classList.add('film', 'item');
            
            if (film.capacity - film.tickets_sold === 0) {
              li.classList.add('sold-out');
            }
  
            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', (e) => {
              e.stopPropagation(); 
              deleteMovie(film.id, li);
            });
  
            li.appendChild(deleteBtn);
            li.addEventListener('click', () => displayMovieDetails(film));
            filmsList.appendChild(li);
          });
        });
    }
  

    // Display sthe film that is selected
    function displayMovieDetails(film) {
        
      currentFilm = film;
      filmTitle.textContent = film.title;
      filmPoster.src = film.poster;
      filmRuntime.textContent = `Runtime: ${film.runtime} minutes`;
      filmTime.textContent = `SHOW TIME: ${film.showtime}`;
      filmInformation.textContent = film.description;
      const availableTickets = film.capacity - film.tickets_sold;
      filmAvailableTickets.textContent = `Available Tickets: ${availableTickets}`;
      buyTicketBtn.disabled = availableTickets === 0;
      buyTicketBtn.textContent = availableTickets === 0 ? "Sold Out" : "Buy Ticket";
    }


  
    // buying tickets operations
    buyTicketBtn.addEventListener('click', (event) => {
        //this prevents the page from reloading
        event.preventDefault();
      if (currentFilm && currentFilm.tickets_sold < currentFilm.capacity) {
        currentFilm.tickets_sold++;
  
        const availableTickets = currentFilm.capacity - currentFilm.tickets_sold;
        filmAvailableTickets.textContent = `Available Tickets: ${availableTickets}`;
        buyTicketBtn.disabled = availableTickets === 0;
        buyTicketBtn.textContent = availableTickets === 0 ? "Sold Out" : "Buy Ticket";
  
        // Update tickets on the db.json database
        fetch(`http://localhost:3000/films/${currentFilm.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tickets_sold: currentFilm.tickets_sold })
        });
      }
    });
  


    // delete films opearations
    function deleteMovie(filmId, li) {
      fetch(`http://localhost:3000/films/${filmId}`, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            li.remove();
          }
        });
    }

    filmDisplay();
    displayFilmList();
  });
  