document.addEventListener('DOMContentLoaded', loadReviews); // Load reviews on page load

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    const title = form.title.value;
    const review = form.review.value;
    const author = form.author.value;

    const newReview = { title, review, author, rating: '⭐️⭐️⭐️⭐️⭐️' };

    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    alert('Review submitted successfully!');
    form.reset();
    loadReviews(); // Reload the reviews to display the new one
});

function loadReviews() {
    const reviewContainer = document.getElementById('review-container');
    reviewContainer.innerHTML = ''; // Clear previous reviews

    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.forEach((review) => {
        const reviewCard = document.createElement('div');
        reviewCard.classList.add('review-card');
        reviewCard.innerHTML = `
            <h3 class="review-title">${review.title}</h3>
            <p class="review-text">${review.review}</p>
            <div class="review-rating">${review.rating}</div>
            <p class="review-author">- ${review.author}</p>
        `;
        reviewContainer.appendChild(reviewCard);
    });
}
