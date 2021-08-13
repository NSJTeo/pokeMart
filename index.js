const shoppingMenu = document.querySelector('.shopping-menu');
const shoppingCart = document.querySelector('.shopping-cart');

const updateTotal = () => {
  let total = 0;
  const shoppingCartTotal = document.querySelector('.shopping-cart__total');
  const shoppingCartPrices = document.querySelectorAll('.shopping-cart__item-price');
  if (!shoppingCartPrices.length) {
    shoppingCartTotal.innerText = `Total: $0`;
  } else {
    shoppingCartPrices.forEach(price => {
      total += +price.innerText;
      shoppingCartTotal.innerText = `Total: $${total}`;
    })
  }
}

// Get all items for shop
axios.get('https://pokeapi.co/api/v2/item-category/27/').then(response => {
  const itemsArray = response.data.items; 

  itemsArray.forEach(item => {
    axios.get(item.url).then(response => {
      let pokeItem = {};
      pokeItem.englishName = response.data.name.toUpperCase().replace('-', ' ');
      pokeItem.japaneseName = response.data.names[0].name;
      pokeItem.cost = response.data.cost;
      pokeItem.img = response.data.sprites.default;
      pokeItem.description = response.data.effect_entries[0].short_effect;

      const itemListElement = document.createElement('li')
      itemListElement.classList.add('shopping-menu__item-container')

      shoppingMenu.appendChild(itemListElement);

      const itemButton = document.createElement('button');
      itemButton.classList.add('shopping-menu__add-button');

      itemButton.addEventListener('click', () => {

        const shoppingCartItemContainer = document.createElement('section');
        shoppingCartItemContainer.classList.add('shopping-cart__item-container');

        shoppingCart.appendChild(shoppingCartItemContainer);

        const shoppingCartItemImage = document.createElement('img');
        shoppingCartItemImage.classList.add('shopping-cart__item-image')
        shoppingCartItemImage.src = pokeItem.img;

        shoppingCartItemContainer.appendChild(shoppingCartItemImage);

        const shoppingCartItemPrice = document.createElement('p');
        shoppingCartItemPrice.classList.add('shopping-cart__item-price')
        shoppingCartItemPrice.innerText = pokeItem.cost;

        shoppingCartItemContainer.appendChild(shoppingCartItemPrice);

        const shoppingCartDeleteItemButton = document.createElement('button');
        shoppingCartDeleteItemButton.classList.add('shopping-cart__delete-item-button');
        shoppingCartDeleteItemButton.innerText = 'X';

        shoppingCartDeleteItemButton.addEventListener('click', () => {
          shoppingCartItemContainer.remove();
          updateTotal();
        })

        shoppingCartItemContainer.appendChild(shoppingCartDeleteItemButton);
        
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
  if (shoppingCart.childElementCount < 2) {
    return;
  }
  shoppingCart.innerHTML = "";
  const shoppingCartTitle = document.createElement('p');
  shoppingCartTitle.classList.add('shopping-cart__title');
  shoppingCartTitle.innerText = 'Shopping Cart:';
  shoppingCart.appendChild(shoppingCartTitle);
  updateTotal();
  alert('Thank you for your purchase!'); 
})