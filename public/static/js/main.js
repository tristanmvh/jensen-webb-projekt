import { getProduct, getCategoryNames, searchProducts } from "./products.js";
import { view, navigate, genericLinksInit, createProductPreviewElement, refreshCart } from "./view.js";


//ange år i footer
document.getElementById("footer-year").innerHTML = new Date().getFullYear();

const recommendedProducts = document.getElementById("recommended-products");
const aside = document.querySelector("aside");
const searchField = document.querySelector(".search-field");


//Hämta utvalda produkter och skapa element för produkterna. sedan visa dom
const recommendedProductsList = await fetch("json/recommended.json").then(data => { return data.json(); });

recommendedProductsList.forEach(async id => {
    recommendedProducts.innerHTML = "";
    const product = await getProduct(id);
    const productPreview = await createProductPreviewElement(product);
    recommendedProducts.appendChild(productPreview);
});

//Hämta alla kategorier och lägg till dem i aside som länkar
const categories = await getCategoryNames().then(categories => {
    categories.forEach(category => {
        const categoryLink = document.createElement("a");
        categoryLink.classList.add("aside-item", "generic-link");
        categoryLink.href = "/category?id=" + category.toLowerCase();
        categoryLink.innerHTML = category;
        aside.appendChild(categoryLink);
    });
});

window.addEventListener("popstate", view) //kör view när användaren klickar på webbläsarens fram-tillbaka knappar
view();

document.querySelectorAll(".generic-link").forEach((element) => {
    element.addEventListener("click", navigate);
});

//visa shoppingvagnen
document.querySelector(".cart").addEventListener("mouseenter", refreshCart);

//Sökfunktion
searchField.addEventListener("keyup", async () => {
    const search = searchField.value.trim(); //ta bort onödig whitespace
    document.getElementById("search-result").innerHTML = "";
    console.log(search.length);
    if (search.length > 1) {
        const products = await searchProducts(search);


        if (products) {
            products.forEach(async product => {

                var productElement = await createProductPreviewElement(product);
                console.log(productElement);
                document.getElementById("search-result").appendChild(productElement);
            });
        } else {
            document.getElementById("search-result").innerHTML = "<p>Inga produkter hittades</p>";
        }

    }
});

//töm varukorg
document.querySelector(".empty-cart-button").addEventListener("click", async () => {
    refreshCart();
})