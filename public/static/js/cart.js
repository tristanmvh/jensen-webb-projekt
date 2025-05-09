//hämta produkt id:n och kvantitet om shoppingvagnen existerar
function getCart() {
    cart = localStorage.getItem("cart");
    if(cart) {
        return JSON.parse(cart);
    }
    return false; //shoppingvagnen existerar inte
}

//lägg till i shoppingvagnen
function addToCart(id, quantity) {
    var cart = [];
    //kolla om shoppingvagnen ("cart") existerar ännu
    if (getCart()) {
        cart = getCart();

        //om en produkt redan är i varukorgen, uppdatera antalet
        for(var i = 0; i<cart.length; i++) {
            if(cart[i].id === id) {
                cart[i].quantity += quantity;
                localStorage.setItem("cart", JSON.stringify(cart));
                return true;
            }
        }
    }
    cart.push({ id, quantity });
    localStorage.setItem("cart", JSON.stringify(cart));
}

function emptyCart() {
    if(getCart()) {
        localStorage.removeItem("cart");
    }
}
