import { getProduct, getCategory } from "./products.js";

const pages = {
    "/": "home",
    "/home": "home",
    "/product": "product",
    "/about": "about",
    "/category": "category",
    "/search": "search"
};

//körs när man klickar på länkar.
export function navigate(event) {
    event.preventDefault();
    window.history.pushState({}, "", event.currentTarget.getAttribute("href"));
    view();
}

export async function view() {
    //välj sida. om sidan inte finns så väljs 404 Not Found sidan
    var pageId = pages[window.location.pathname.toLowerCase()];
    var page = document.getElementById(pageId) || document.getElementById("not-found");
    //ta bort .active från föregående sida så att den göms
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    //lägg till active på den nya sidan
    page.classList.add("active");


    //Om användaren försöker se en produkt, en kategori, eller ett sökresultat så måste vi kolla på GET parametrarna
    //för att veta vad användaren  vill se.
    const id = new URLSearchParams(document.location.search).get("id");


    if (pageId === "product") {
        if(id) {
            viewProduct(id);
        } else {
            notFound();
        }
    }

    if (pageId === "category") {
        if(id) {
            viewCategory(id);
        } else {
            notFound();
        }
    }
}


async function viewProduct(id) {
    const product = await getProduct(id);

    //kolla om produkten hittades av getProduct
    if (product) {



        document.querySelector(".product-location-category-name").innerHTML = product.category;
        document.querySelector(".product-location-category-name").href = "/category?id=" + product.category.toLowerCase();
        document.querySelector(".product-location-product-name").innerHTML = product.name;

        document.querySelector(".product-name").innerHTML = product.name;
        document.querySelector(".product-brand").innerHTML = product.brand;

        document.querySelector(".product-image").src = "./images/" + product.image;

        document.querySelector(".product-price").innerHTML = product.price + " SEK";


        //skapa inputs för att 
        const qtyInput = document.createElement("input");
        qtyInput.setAttribute("type", "number");
        qtyInput.setAttribute("id", "qty");
        qtyInput.classList.add("product-input");
        qtyInput.value = "1";
        qtyInput.min = "1";
        qtyInput.placeholder = "st";


        const buyButton = document.createElement("input");
        buyButton.setAttribute("type", "button");
        buyButton.setAttribute("id", "buy");
        buyButton.classList.add("product-input");
        buyButton.value = "Lägg till i varukorg";
        buyButton.addEventListener("click", () => {
            addToCart(product.id, parseInt(qtyInput.value));
        });


        const inputContainer = document.querySelector(".product-input-container");
        inputContainer.innerHTML = "" //ta bort tidigare inputs

        inputContainer.appendChild(qtyInput);
        inputContainer.appendChild(buyButton);


    } else {
        notFound();
    }
}

//visa produkter i en kategori
async function viewCategory(id) {
    const category = await getCategory(id);

    //visa produkter i kategori om kategorin existerar
    if (category) {

        document.querySelector(".category-category-name").innerHTML = category[0].category

        category.forEach(async product => {
            const productContainer = document.getElementById("category-products");
            productContainer.innerHTML = ""; //säkerställ att .content är tom
            const productPreview = await createProductPreviewElement(product);
            productContainer.append(productPreview);
        });
        //Lägg till eventListener:n på de nya länkarna
        genericLinksInit();
    } else {
        notFound();
    }
}

export async function createProductPreviewElement(product) {
    const productURI = `/product?id=${product.id}`
    //huvudelement
    const productElement = document.createElement("div");
    productElement.classList.add("product-preview");

    //produktbild länk
    const imageLink = document.createElement("a");
    imageLink.classList.add("generic-link");
    imageLink.href = productURI;

    //produktbild
    const image = document.createElement("img");
    image.classList.add("product-preview-image")
    image.src = `./images/${product.image}`;
    image.width = image.height = 230;

    //produktnamn
    const name = document.createElement("span");
    name.classList.add("product-preview-name");

    //produktlänk
    const link = document.createElement("a");
    link.classList.add("product-link", "generic-link");
    link.href = productURI;
    link.innerHTML = product.name;

    const price = document.createElement("span");
    price.classList.add("product-preview-price")
    price.innerHTML = `${product.price} SEK`;

    //append
    productElement.appendChild(imageLink);
    imageLink.appendChild(image);
    productElement.appendChild(name);
    name.appendChild(link);
    productElement.appendChild(price)

    return productElement;
}

function notFound() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById("not-found").classList.add("active");
}

export function genericLinksInit() {
    //gör så att funktionen navigate körs varje gång en länk i klassen generic-link klickas på
    document.querySelectorAll(".generic-link").forEach((element) => {
        element.addEventListener("click", navigate);
    });
}


//uppdatera shoppingvagnens html. 
// Hämtar "cart" i localStorage som är en array med json objekt.
// Därefter loopas arrayen genom, och för varje iteration hämtas 
// produkten med funktionen getProduct() då JSON objekten 
// enbart innehåller id:n och kvantitet.
// Sedan skapas HTML element med hjälp av datan från getProduct()
// Och slutligen i sista iteration så visas totalsumman för kunden 
export function refreshCart() {
    const cartElement = document.querySelector(".cart-items");
    cartElement.innerHTML = "";
    const cart = getCart();
    if (getCart()) {
        var cartSum = 0;
        cart.forEach(async (data, i) => {
            const product = await getProduct(data.id);
            cartSum += product.price * parseInt(data.quantity); //beräkna totalsumma

            const itemRow = document.createElement("div");
            itemRow.classList.add("cart-item-row");

            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `${product.name} (${data.quantity})`

            const itemPrice = document.createElement("div");
            itemPrice.classList.add("cart-item-price");
            itemPrice.innerHTML = `${product.price} SEK`



            itemRow.appendChild(itemElement);
            itemRow.appendChild(itemPrice)
            cartElement.appendChild(itemRow);

            if (i + 1 === cart.length) {
                document.querySelector(".cart-total").innerHTML = `Totalt: ${cartSum} SEK`;
                document.querySelector(".empty-cart-button").style.display = "inline-block";
            }
        });


    } else {
        document.querySelector(".cart-items").innerHTML = "Kundvagnen är tom!";
        document.querySelector(".cart-total").innerHTML = "";
        document.querySelector(".empty-cart-button").style.display = "none";
    }
}