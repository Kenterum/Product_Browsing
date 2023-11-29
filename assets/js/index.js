let products = [];

window.addEventListener('DOMContentLoaded', (event) => {
    fetchProducts();
});

async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products');
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