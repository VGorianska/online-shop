'use strict';

const products = {};
const cartContentInfo = document.getElementById('cartContentInfo');
const cartItemsQuantity = document.getElementById('itemsNum');

// get buttons from html
const clearAllBtn = document.getElementById('clearAllBtn');
clearAllBtn.addEventListener('click', () => {
  cleanCart();
  renderCart();
});
const payBtn = document.getElementById('payBtn');
const totalCartPrice = document.getElementById('totalCartPrice');




//////////////////////////// LocalStorage /////////////////////////
const getCart = () => {
  const cart = localStorage.getItem("cart") || "{}";
  return JSON.parse(cart);
}

///// Save Product /////
const saveProduct = (id, numItems) => {
  const cart = getCart();

  // proofs if this Item is already exist
  if (cart[id]) {
    cart[id].quantity += numItems
  } else {
    cart[id] = {
      quantity: numItems
    };
  }
  // add new key 
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart()
}

///// Remove Product /////
const removeProduct = (id) => {
  const cart = getCart();

  // delete key id (var value) from localStorage cart
  delete cart[id];


  //save new value to localStorage cart.
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart()
};


///////// Clean Cart //////////
const cleanCart = () => {
  localStorage.setItem("cart", "{}");
  renderCart()
}



/**
 * counts number of cart Items
 */
const getCartItemsNum = (cart) => {
  const values = Object.values(cart);
  return values.reduce((result, el) => {
    return result + el.quantity;
  }, 0);


}


/**
 * counts total cart cost
 */



const renderCart = () => {
  // clean cart ul 
  ulCardList.innerHTML = '';

  // get cart contents from localStorage
  const cart = getCart();
  cartItemsQuantity.innerText = getCartItemsNum(cart);

  // disable 'clear/buy' buttons if cart is empty //
  // understand if cart is empty
  if (getCartItemsNum(cart) == 0) {

    // if empty -> disable buy/clear buttons
    clearAllBtn.disabled = true;
    payBtn.disabled = true;
  } else {
    clearAllBtn.removeAttribute('disabled');
    payBtn.removeAttribute('disabled');
  }

  let total = 0;

  // for method instead object => array
  // forEach product
  for (let id in cart) {

    //  get cart - product info
    const cartItemInfo = cart[id];

    // get product info
    const productInfo = products[id];

    const cartItem = document.createElement('li');
    cartItem.classList.add('cartItem');

    const leftDivInCartItem = document.createElement('div');
    leftDivInCartItem.classList.add('imgName');



    // icone for remove item from cart and local storage 
    const closeIcone = document.createElement('i');
    closeIcone.classList.add('fa-solid', 'fa-xmark');
    closeIcone.addEventListener('click', () => {
      removeProduct(productInfo.id);
      renderCart();
    });



    const rightDivInCartItem = document.createElement('div');
    rightDivInCartItem.classList.add('priceQuantity');

    const divImg = document.createElement('div');
    divImg.classList.add('cartImgItem');

    const imgS = document.createElement('img');
    imgS.src = productInfo.img[0];
    imgS.alt = productInfo.title;

    const nameSpan = document.createElement('span');
    nameSpan.innerText = productInfo.title;

    const quantityOfItem = document.createElement('input');
    quantityOfItem.setAttribute('type', 'number')
    quantityOfItem.setAttribute('id', 'quantity');
    quantityOfItem.setAttribute('name', 'quantity');
    quantityOfItem.setAttribute('min', '1');
    quantityOfItem.setAttribute('max', '5');
    quantityOfItem.setAttribute('value', cartItemInfo.quantity);
    quantityOfItem.addEventListener('input', () => {
      cartItemInfo.quantity = +quantityOfItem.value;

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart()
    })

    const priceOfEachItem = document.createElement('div');

    const itemTotal = productInfo.price * cart[id].quantity;

    total += itemTotal;
    priceOfEachItem.innerHTML = itemTotal + ' ' + '&euro;';

    ulCardList.append(cartItem);
    cartItem.append(leftDivInCartItem, rightDivInCartItem);
    leftDivInCartItem.append(closeIcone, divImg, nameSpan);
    rightDivInCartItem.append(quantityOfItem, priceOfEachItem);
    divImg.append(imgS);
  }


  // on any cart-change call renderCart()

  totalCartPrice.innerHTML = total + ' ' + '&euro;';
}



/////////////////////////////////// Fetch //////////////////////////////////
const fetchPromise = fetch("katalog.json", {
  mode: 'no-cors'
})
const ulCardList = document.querySelector('#cardList');


fetchPromise
  .then((downloadedResult) => {
    return downloadedResult.json();
  })
  .then((katalogItems) => {
    katalogItems.forEach(element => {
      products[element.id] = element;
      const image = document.createElement('img');
      image.src = element.img[0];
      image.alt = element.title;
      const image2 = document.createElement('img');
      image2.src = element.img[1];
      image2.alt = element.title;

      const divSlider = document.createElement('div');
      divSlider.classList.add('slider');
      divSlider.setAttribute("id", `#div${element.id}`)

      const divSlide = document.createElement('div');
      divSlide.classList.add('slide');

      const divSlide2 = document.createElement('div');
      divSlide2.classList.add('slide');

      const iconLeft = document.createElement('i');
      iconLeft.classList.add('fa-solid', 'fa-arrow-left');


      const iconRight = document.createElement('i');
      iconRight.classList.add('fa-solid', 'fa-arrow-right');

      // Select all slides
      const slides = [divSlide, divSlide2]

      // current slide counter
      let curSlide = 0;
      // maximum number of slides


      // add event listener and navigation functionality                            -->
      iconRight.addEventListener('click', () => {
        // check if current slide is the last and reset current slide
        if (curSlide === 1) {
          curSlide = 0;
        } else {
          curSlide++;
        }

        //   move slide by -100%
        slides.forEach((slide, indx) => {
          slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
        });
      });


      // add event listener and navigation functionality                             <--
      iconLeft.addEventListener('click', () => {
        // check if current slide is the first and reset current slide to last
        if (curSlide === 0) {
          curSlide = 1;
        } else {
          curSlide--;
        }

        //   move slide by 100%
        slides.forEach((slide, indx) => {
          slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
        });
      });

      const btnAddToCart = document.createElement('button');
      btnAddToCart.classList.add('btn');
      btnAddToCart.addEventListener('click', () => {
        saveProduct(element.id, 1);
        renderCart();
      });

      btnAddToCart.innerText = "ADD TO CART";

      const caption = document.createElement('figcaption');
      caption.innerHTML = element.price + '&euro;';

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('contentBox');


      const productContainer = document.createElement('figure');
      productContainer.classList.add('contentImgBox');

      const details = document.createElement('div');
      details.classList.add('details');
      details.innerHTML = element.details;

      productContainer.append(caption);
      productContainer.append(divSlider);
      divSlider.append(divSlide2, divSlide);

      divSlide.append(image);
      divSlide2.append(image2);
      caption.append(btnAddToCart);
      const mainContainer = document.querySelector('#content');
      mainContainer.append(contentDiv);
      contentDiv.append(productContainer);
      contentDiv.append(details);
      contentDiv.append(iconRight, iconLeft);
    });
  })
  .then(renderCart);

////////////////////////  ///////////////////////////