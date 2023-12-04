let products = [];

window.addEventListener('DOMContentLoaded', (event) => {
    fetchProducts();
});
async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products?limit=100');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        products = data.products;
        displayPaginatedProducts(products);
        populateCategoryFilter(data.products);
    } catch (error) {
        console.error('Error fetching data:', error);
        displayErrorMessage(error.message);
    }
}
function displayProducts(productsToDisplay) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 
    productsToDisplay.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add("prod-text");
        const rating = product.rating;
        let starsHtml =`<div class="stars-container">`;
        Array(Math.round(rating)).fill().forEach((_, i) => {
            starsHtml+=`<p>⭐</p>`;
        });
        starsHtml+=`</div>`;
        console.log(starsHtml);
        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <div class="image"> 
                <img src="${product.thumbnail}" alt="${product.title}">
            </div> 
            <p>Price: <span class="prod-value">$${product.price}</span></p>
            <p>Discount: <span class="prod-value">${product.discountPercentage}%</span></p>
            <p>Category: <span class="prod-value">${product.category}</span></p>
            <div class='rating-star'>Rating: ${starsHtml}</div>
            <p>Stock: <span class="prod-value">${product.stock}<span></p>
        `;
        productElement.addEventListener('click', () => {
            window.location.href = `public/details.html?id=${product.id}`;
        });
        productList.appendChild(productElement);
    });
    updatePaginationControls();
}

function populateCategoryFilter(products) {
    const categories = new Set(products.map(product => product.category));
    const categoryFilter = document.getElementById('category-filter');

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function filterProducts(searchQuery, selectedCategory) {
    return products.filter(product =>
        (product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         product.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedCategory === 'all' || product.category === selectedCategory)
    );
}

document.getElementById('search-box').addEventListener('input', (event) => {
    const searchQuery = event.target.value;
    const selectedCategory = document.getElementById('category-filter').value;
    const filteredProducts = filterProducts(searchQuery, selectedCategory);
    displayPaginatedProducts(filteredProducts);
});

document.getElementById('category-filter').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    const searchQuery = document.getElementById('search-box').value;
    const filteredProducts = filterProducts(searchQuery, selectedCategory);
    displayPaginatedProducts(filteredProducts);
});


let currentPage = 1;
const productsPerPage = 10;

function displayPaginatedProducts(productsToDisplay) {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = productsToDisplay.slice(startIndex, endIndex);
    displayProducts(paginatedProducts);
}

const nextButton = document.getElementById('next-page');
const prevButton = document.getElementById('prev-page');

prevButton.addEventListener('click', () => changePage(currentPage - 1));
nextButton.addEventListener('click', () => changePage(currentPage + 1));

function updatePaginationControls() {
    const totalPages = Math.ceil(products.length / productsPerPage);
 

    if (currentPage > 1) {
        prevButton.style.display = 'block';
        
    }else{
        prevButton.style.display = 'none';
    }

    if (currentPage < totalPages) {
        nextButton.style.display = 'block';
       
    }else {
        nextButton.style.display = 'none';
    }
}

function changePage(newPage) {
    currentPage = newPage;
    displayPaginatedProducts(products);
}

function displayErrorMessage(message) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = `<div class="error-message">Error: ${message}</div>`;
}

updatePaginationControls();
