const shoppingMenu = document.querySelector('.shopping-menu');
const shoppingCart = document.querySelector('.shopping-cart');

let totalCost = 0;
let shoppingCartItems = {};

const updateTotal = () => {
  const shoppingCartTotal = document.querySelector('.shopping-cart__total');
  shoppingCartTotal.innerText = `Total: $${totalCost}`
}


const clearShoppingCart = () => {
  shoppingCart.innerHTML = "";
  const shoppingCartTitle = document.createElement('p');
  shoppingCartTitle.classList.add('shopping-cart__title');
  shoppingCartTitle.innerText = 'Shopping Cart:';
  shoppingCart.appendChild(shoppingCartTitle);
}

const resetTotal = () => {
  totalCost = 0;
  updateTotal();
}

// Get all items for shop
axios.get('https://pokeapi.co/api/v2/item-category/27/').then(response => {
  const itemsArray = response.data.items; 

  itemsArray.forEach(item => {
    axios.get(item.url).then(response => {
      console.log(response.data);
      let pokeItem = {};
      pokeItem.englishName = response.data.name.toUpperCase().replace('-', ' ');
      pokeItem.japaneseName = response.data.names[0].name;
      pokeItem.cost = response.data.cost;
      pokeItem.img = response.data.sprites.default;
      // pokeItem.description = response.data.effect_entries[0].short_effect;
      pokeItem.description = response.data.flavor_text_entries[1].text;

      const itemListElement = document.createElement('li')
      itemListElement.classList.add('shopping-menu__item-container')

      shoppingMenu.appendChild(itemListElement);

      const itemButton = document.createElement('button');
      itemButton.classList.add('shopping-menu__add-button');

      itemButton.addEventListener('click', () => {
        clearShoppingCart();

        totalCost = 0;

        if (shoppingCartItems.hasOwnProperty(pokeItem.englishName)) {
          shoppingCartItems[pokeItem.englishName].count++;
        } else {
          shoppingCartItems[pokeItem.englishName] = {count: 1, img: pokeItem.img, cost: pokeItem.cost, name: pokeItem.englishName};
        }

        for (const item in shoppingCartItems) {
          totalCost += shoppingCartItems[item].cost * shoppingCartItems[item].count;

          const shoppingCartItemContainer = document.createElement('section');
          shoppingCartItemContainer.classList.add('shopping-cart__item-container');
  
          shoppingCart.appendChild(shoppingCartItemContainer);

          const shoppingCartItemImage = document.createElement('img');
          shoppingCartItemImage.classList.add('shopping-cart__item-image');
          shoppingCartItemImage.src = shoppingCartItems[item].img;
          shoppingCartItemImage.alt = shoppingCartItems[item].name;
  
          shoppingCartItemContainer.appendChild(shoppingCartItemImage);

          const shoppingCartItemCount = document.createElement('p');
          shoppingCartItemCount.classList.add('shopping-cart__item-count')
          shoppingCartItemCount.innerText = 'x' + shoppingCartItems[item].count;

          shoppingCartItemContainer.appendChild(shoppingCartItemCount);

          const shoppingCartDeleteItemButton = document.createElement('button');
          shoppingCartDeleteItemButton.classList.add('shopping-cart__delete-item-button');
          shoppingCartDeleteItemButton.innerText = 'X';

          shoppingCartDeleteItemButton.addEventListener('click', () => {
            delete shoppingCartItems[item];
            totalCost = 0;
            for (const item in shoppingCartItems) {
              totalCost += shoppingCartItems[item].cost * shoppingCartItems[item].count;
            }
            shoppingCartItemContainer.remove();
            updateTotal();
          })

          shoppingCartItemContainer.appendChild(shoppingCartDeleteItemButton);
        }

        updateTotal();
      })

      itemListElement.appendChild(itemButton);

      const itemImageContainer = document.createElement('div');
      itemImageContainer.classList.add('shopping-menu__image-container');

      itemButton.appendChild(itemImageContainer);

      const itemImagePointer = document.createElement('div');
      itemImagePointer.classList.add('shopping-menu__item-pointer');
      itemImagePointer.innerHTML = '&#9654;';

      itemImageContainer.appendChild(itemImagePointer);

      const itemImage = document.createElement('img');
      itemImage.classList.add('shopping-menu__item-image');
      itemImage.src = pokeItem.img;
      itemImage.alt = pokeItem.englishName;

      itemImageContainer.appendChild(itemImage);
      
      const itemJapaneseName = document.createElement('p');
      itemJapaneseName.innerText = pokeItem.japaneseName;
      itemJapaneseName.classList.add('shopping-menu__item-name');
      itemJapaneseName.classList.add('shopping-menu__item-name--japanese');

      itemListElement.appendChild(itemJapaneseName);

      const itemEnglishName = document.createElement('p');
      itemEnglishName.innerText = pokeItem.englishName;
      itemEnglishName.classList.add('shopping-menu__item-name');

      itemListElement.appendChild(itemEnglishName);

      const itemDescription = document.createElement('p');
      itemDescription.classList.add('shopping-menu__item-description')
      itemDescription.innerText = pokeItem.description;
      
      itemListElement.appendChild(itemDescription);

      const itemPrice = document.createElement('p');
      itemPrice.innerText = `$${pokeItem.cost}`;
      itemPrice.classList.add('shopping-menu__item-price')

      itemListElement.appendChild(itemPrice);
    })
  })
})

const buyButton = document.querySelector('.shopping-cart__buy-button')
buyButton.addEventListener('click', () => {
  if (totalCost == 0) {
    return;
  }
  clearShoppingCart();
  resetTotal();
  shoppingCartItems = {};
  alert('Thank you for your purchase!'); 
})