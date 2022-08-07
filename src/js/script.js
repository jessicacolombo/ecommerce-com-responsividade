const windowDisplay = document.querySelector('.containerListaProdutos ul');
const buttonAll = document.querySelector('#button-all');
const buttonHortifruti = document.querySelector('#button-hortifruti');
const buttonBakery = document.querySelector('#button-bakery');
const buttonDairy = document.querySelector('#button-dairy');
const priceOfProducts = document.querySelector('.priceContainer span');
const searchButton = document.querySelector('.containerBuscaPorNome button');
const searchBar = document.querySelector('.containerBuscaPorNome input');
const vitrine = document.querySelector('.containerVitrine');
const vitrineCarrinho = document.querySelector('#vitrine-carrinho');
const priceOfAll = document.querySelector('#info-valor');
const quantity = document.querySelector('#info-qtd');
const sectionPrice = document.querySelector('.info-valor');
const sectionQuantity = document.querySelector('.info-qtd')
const imgCarrinho = document.querySelector('#container-carrinho img');

function createCard(element) {
    let tagLi = document.createElement('li');

    let tagImg = document.createElement('img');
    tagImg.src = `${element.img}`;

    let tagTitle = document.createElement('h3');
    tagTitle.innerText = `${element.nome}`;

    let tagCategory = document.createElement('span');
    tagCategory.innerText = `${element.secao}`;

    let listOfNutrients = document.createElement('ol');

    listNutrients(element, listOfNutrients);

    let div = document.createElement('div');

    let tagPrice = document.createElement('p');
    tagPrice.innerText = `R$${element.preco}`;

    let buttonBuy = document.createElement('button');
    buttonBuy.id = element.id
    buttonBuy.innerText = 'Comprar'

    div.append(tagPrice, buttonBuy)

    tagLi.append(tagImg, tagTitle, tagCategory, listOfNutrients, div);

    return tagLi;
}

function listNutrients(elem, where) {
    let arrayOfNutrients = elem.componentes;

    arrayOfNutrients.forEach((element) => {
        let nutrient = document.createElement('li');
        nutrient.innerText = `${element}`;
        where.appendChild(nutrient)
    });
}

function messageForWhenNoProductIsFound() {
    let message = document.createElement('h2');
    message.innerText = 'Não encontramos resultados para sua pesquisa 🙁'
    message.style.marginTop = "20px"

    return message;
}

function insertCardInnerHTML(array, where) {
    where.innerHTML = '';
    if (array.length >= 1) {
        array.forEach(element => {
            where.appendChild(createCard(element));
        });

    } else {
        where.appendChild(messageForWhenNoProductIsFound());
    }
}

insertCardInnerHTML(produtos, windowDisplay);

let cart = [];

function createCardCarrinho(element) {
    let tagLi = document.createElement('li');

    let div = document.createElement('div');
    div.classList.add('div-principal');

    let tagImg = document.createElement('img');
    tagImg.src = `${element.img}`;

    div.append(tagImg)

    let divtext = document.createElement('div');

    let tagTitle = document.createElement('h3');
    tagTitle.innerText = `${element.nome}`;

    let tagCategory = document.createElement('span');
    tagCategory.innerText = `${element.secao}`;

    let tagPrice = document.createElement('p');
    tagPrice.innerText = `R$${element.preco}`;

    divtext.append(tagTitle, tagCategory, tagPrice);

    div.append(divtext);

    let button = document.createElement('button');
    button.classList.add('material-symbols-outlined')
    button.innerText = 'delete'
    button.id = `${element.id}`;

    tagLi.append(div, button)

    return tagLi;
}

function insertCardCarrinho(array, where) {
    where.innerHTML = ''
    return array.forEach(element => {
        where.appendChild(createCardCarrinho(element));
    });

}

function emptyCart(array) {
    if (array.length > 0) {
        imgCarrinho.setAttribute("hidden", "hidden");
        sectionPrice.style.display = 'flex';
        sectionQuantity.style.display = 'flex';
    } else if (array.length === 0) {
        imgCarrinho.removeAttribute("hidden");
        sectionPrice.style.display = 'none';
        sectionQuantity.style.display = 'none';
    }
}

function filterArrayForProducts(array, section) {
    return array.filter((elem) => {
        if (elem.secao === section) {
            return elem;
        }
    });
}

function sumOfThePrices(array) {
    let sum = 0;
    array.forEach(({ preco }) => {
        sum += +preco;
    })

    return `R$${sum},00`;
}

function quantityOfProducts(array) {
    return array.length;
}

function searchInTheArray(input, array) {
    input = input.toLowerCase();

    return array.filter((elem) => {
        let nome = elem.nome.toLowerCase();
        let secao = elem.secao.toLowerCase();
        let categoria = elem.categoria.toLowerCase();
        return nome.includes(input) || secao.includes(input) || categoria.includes(input);
    });
}

buttonAll.addEventListener('click', () => {
    insertCardInnerHTML(produtos, windowDisplay);
})

buttonHortifruti.addEventListener('click', () => {
    insertCardInnerHTML(filterArrayForProducts(produtos, 'Hortifruti'), windowDisplay);
})

buttonBakery.addEventListener('click', () => {
    insertCardInnerHTML(filterArrayForProducts(produtos, 'Panificadora'), windowDisplay);
})

buttonDairy.addEventListener('click', () => {
    insertCardInnerHTML(filterArrayForProducts(produtos, 'Laticinio'), windowDisplay);
});

searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    let inputSearchValue = searchBar.value.trim();
    insertCardInnerHTML(searchInTheArray(inputSearchValue, produtos), windowDisplay);

    if (inputSearchValue == '') {
        insertCardInnerHTML(produtos, windowDisplay);
    }

    searchBar.value = ''
});

searchBar.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
        searchButton.click();
    }
});

let timeout = null;

searchBar.addEventListener('keyup', (event) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        event.preventDefault();
        let inputSearchValue = searchBar.value.trim();

        if(inputSearchValue != '') {
            insertCardInnerHTML(searchInTheArray(inputSearchValue, produtos), windowDisplay);
        }
    }, 2000)
})

vitrine.addEventListener('click', (event) => {
    let buttonAddToCart = event.target;

    if (buttonAddToCart.tagName === 'BUTTON') {
        let product = produtos.find((elem) => {
            if (elem.id == buttonAddToCart.id) {
                return elem
            }
        });

        cart.push(product);

        insertCardCarrinho(cart, vitrineCarrinho)

        priceOfAll.innerText = sumOfThePrices(cart);

        quantity.innerText = quantityOfProducts(cart);

        emptyCart(cart);
    }
});

vitrineCarrinho.addEventListener('click', (event) => {
    let buttonRemoveFromCart = event.target;

    if (buttonRemoveFromCart.tagName == 'BUTTON') {
        let product = cart.find((elem) => {
            if (elem.id == buttonRemoveFromCart.id) {
                return elem;
            }
        });

        cart.splice(cart.indexOf(product), 1);

        insertCardCarrinho(cart, vitrineCarrinho)

        priceOfAll.innerText = sumOfThePrices(cart);

        quantity.innerText = quantityOfProducts(cart);

        emptyCart(cart);

    }
});