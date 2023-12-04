async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const product = await response.json();
        displayProductDetails(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

function displayProductDetails(product) {
    document.getElementById('product-title').textContent = product.title;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').textContent = `Price: $${product.price}`;
    document.getElementById('product-rating').textContent = `Rating: ${'⭐'.repeat(Math.round(product.rating))}`;

    const imagesContainer = document.getElementById('product-images');
    product.images.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = product.title;
        imagesContainer.appendChild(img);
    });
}

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
fetchProductDetails(productId);
