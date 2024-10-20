document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
    setupFilterAndSort(); // Set up event listeners for filter and sort
    setupSearch(); // Set up the search functionality
});

const reviewTextarea = document.querySelector('textarea[name="review"]');
    const reviewCountDisplay = document.getElementById('review-count');

    reviewTextarea.addEventListener('input', () => {
        const currentLength = reviewTextarea.value.length;
        reviewCountDisplay.textContent = `${currentLength}/500 characters`;
    });

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = form.title.value;
    const review = form.review.value;
    const author = form.author.value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value || 'No rating';
    const date = new Date().toISOString();

    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    if (form.dataset.editIndex) { // Check if we're editing
        const editIndex = form.dataset.editIndex;
        reviews[editIndex] = { title, review, author, rating, date }; // Update the review
        delete form.dataset.editIndex; // Clear the edit index
        alert('Review updated successfully!');
    } else {
        const newReview = { title, review, author, rating, date };
        reviews.push(newReview);
        alert('Review submitted successfully!');
    }

    localStorage.setItem('reviews', JSON.stringify(reviews));
    form.reset();
    loadReviews();
});

function loadReviews(filteredRating = 'all', sortOrder = 'newest', searchTerm = '') {
    const reviewContainer = document.getElementById('review-container');
    reviewContainer.innerHTML = '';

    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

    // Filter reviews by rating
    if (filteredRating !== 'all') {
        reviews = reviews.filter(review => review.rating === filteredRating);
    }
    
    // Filter reviews by search term
    if (searchTerm) {
        reviews = reviews.filter(review =>
            review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.review.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Sort reviews based on the selected order
    reviews.sort((a, b) => {
        switch (sortOrder) {
            case 'newest':
                return new Date(b.date) - new Date(a.date);
            case 'oldest':
                return new Date(a.date) - new Date(b.date);
            case 'highest':
                return b.rating.length - a.rating.length;
            case 'lowest':
                return a.rating.length - b.rating.length;
            default:
                return 0;
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            
            // Confirmation dialog
            const confirmDelete = confirm('Are you sure you want to delete this review?');
            if (confirmDelete) {
                let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
                reviews.splice(index, 1); // Remove the review at the specified index
                localStorage.setItem('reviews', JSON.stringify(reviews)); // Update localStorage
                alert('Review deleted successfully!');
                loadReviews(); // Reload reviews
            }
        }
    });
    

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const index = e.target.dataset.index;
            let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
            const reviewToEdit = reviews[index];
    
            // Populate the form fields with existing review data
            form.title.value = reviewToEdit.title;
            form.review.value = reviewToEdit.review;
            form.author.value = reviewToEdit.author;
    
            // Set the selected rating
            const ratingInputs = document.querySelectorAll('input[name="rating"]');
            ratingInputs.forEach(input => {
                input.checked = input.value === reviewToEdit.rating;
            });
    
            // Update the form submission to handle editing
            form.removeEventListener('submit', handleSubmit); // Remove old submit listener
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Update the review
                reviews[index] = {
                    title: form.title.value,
                    review: form.review.value,
                    author: form.author.value,
                    rating: document.querySelector('input[name="rating"]:checked')?.value || 'No rating',
                    date: reviewToEdit.date // Keep the original date
                };
    
                localStorage.setItem('reviews', JSON.stringify(reviews));
                alert('Review updated successfully!');
                form.reset();
                loadReviews(); // Reload reviews
            });
        }
    }); 

    reviews.forEach((review, index) => {
        const reviewCard = document.createElement('div');
        reviewCard.classList.add('review-card');
        reviewCard.innerHTML = `
            <h3 class="review-title">${review.title}</h3>
            <p class="review-text">${review.review}</p>
            <div class="review-rating">${'⭐️'.repeat(review.rating.length)}</div>
            <p class="review-author">- ${review.author}</p>
            <p class="review-date">${new Date(review.date).toLocaleDateString()}</p>
            <button class="edit-btn" data-index="${index}">Edit</button> <!-- Add this line -->
            <button class="delete-btn" data-index="${index}">Delete</button> <!-- Existing delete button -->
        `;
        reviewContainer.appendChild(reviewCard);
    });
    // Attach event listeners for edit and delete buttons
    attachEditAndDeleteListeners();
}

function attachEditAndDeleteListeners() {
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            const reviews = JSON.parse(localStorage.getItem('reviews'));
            const reviewToEdit = reviews[index];

            // Populate the form with review data
            form.title.value = reviewToEdit.title;
            form.review.value = reviewToEdit.review;
            form.author.value = reviewToEdit.author;
            document.querySelector(`input[name="rating"][value="${reviewToEdit.rating}"]`).checked = true;

            // Remove the review from local storage before re-adding it
            reviews.splice(index, 1);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            loadReviews(); // Reload the reviews without the edited one
        });
    });

    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            const reviews = JSON.parse(localStorage.getItem('reviews'));

            // Confirmation before deleting
            if (confirm('Are you sure you want to delete this review?')) {
                reviews.splice(index, 1);
                localStorage.setItem('reviews', JSON.stringify(reviews));
                loadReviews(); // Reload the reviews after deletion
            }
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search-reviews');
    
    searchInput.addEventListener('input', () => {
        const filterRating = document.getElementById('filter-rating').value;
        const sortReviews = document.getElementById('sort-reviews').value;
        loadReviews(filterRating, sortReviews, searchInput.value);
    });
}

function setupFilterAndSort() {
    const filterRating = document.getElementById('filter-rating');
    const sortReviews = document.getElementById('sort-reviews');    

    filterRating.addEventListener('change', () => {
        loadReviews(filterRating.value, sortReviews.value);
    });

    sortReviews.addEventListener('change', () => {
        loadReviews(filterRating.value, sortReviews.value);
    });
}
