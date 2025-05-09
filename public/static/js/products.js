//hämta alla produkter
export async function getAllProducts() {

    const products = await fetch("json/products.json").then(data => {
        return data.json();
    });
    return products;
}

//hämta en produkt
export async function getProduct(id) {
    const products = await getAllProducts();

    for (var i = 0; i < products.length; i++) {
        if (products[i].id == id) return products[i];
    }
}
//hämta produkter i en kategori
export async function getCategory(category) {
    var wantedProducts = [];
    const products = await getAllProducts();

    products.forEach(product => {
        if (product.category.toLowerCase() === category.toLowerCase()) wantedProducts.push(product)
    });

    if (wantedProducts.length > 0) {
        return wantedProducts;
    } else {
        return false;
    }
}

//hämta alla kategoriers namn
export async function getCategoryNames() {
    var categories = [];
    const products = await getAllProducts();

    products.forEach(product => {
        //kolla så att kategorin inte redan har lagts till i arrayen.
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    });
    if (categories.length > 0) {
        return categories;
    }
    else {
        return false;
    }
}

export async function searchProducts(search) {
    const products = await getAllProducts();
    const productsFound = [];

    products.forEach(product => {
        if(product.name.toLowerCase().includes(search.toLowerCase())) {
            console.log(product)
            productsFound.push(product);
        }
    });

    if(productsFound.length == 0) {
        return false;
    }

    return productsFound;
}