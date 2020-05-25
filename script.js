window.onload = function () {
  let conteiner = this.document.querySelector('.conteiner');

  let promisePeople = getAllEntities("https://swapi.dev/api/people?format=json", 9, 81);
  let promiseVehicles = getAllEntities("https://swapi.dev/api/vehicles/?format=json", 4, 34);
  let promisePlanet = getAllEntities("https://swapi.dev/api/planets/?format=json", 6, 53);
  let promiseFilms = getAllEntities("https://swapi.dev/api/films/?&format=json", 1, 5);

  Promise.all([promisePeople, promiseFilms, promisePlanet, promiseVehicles])
    .then(resolve => {
      let col1 = document.querySelector('.col-1');
      let col2 = document.querySelector('.col-2');
      let people = resolve[0].sort(function (a, b) {
        let nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB)
          return -1;
        if (nameA > nameB)
          return 1;
        return 0;
      });
      let films = resolve[1];
      let planets = resolve[2];
      let vehicles = resolve[3];
      modifyHero(people, planets, vehicles, films);
      displayElement(col1, col2, people);
    })

  conteiner.addEventListener('click', function (e) {
    let target = e.target;
    if (target.classList.contains('data-name')) {
      target.nextElementSibling.classList.toggle('visible');
    }
  })
}

function getEntity(url) {
  let p = fetch(url, {mode: "cors"})
    .then(file => file.json())
    .then(info => info.results)
    .catch(err => {
      console.log(err);
    })
  return p;
}

function getAllEntities(url, pageNum, n) {
  let array = [];
  let temp = '';
  let promise = new Promise(resolve => {
    for (let i = 1; i < pageNum + 1; i++) {
      temp = strModify(url, i);
      let urlFetch = new URL(temp); 
      getEntity(urlFetch)
        .then(info => {
          array = array.concat(info);
          if (array.length >= n) {
            resolve(array);
          }
        })
        .catch(reason => {console.log(reason)})
    }
  })
  return (promise);
}

function strModify(str, num) {
  let arrStr = str.split('?');
  arrStr.splice(1, -1, `?page=${num}&`);
  let temp = arrStr.join('');
  return temp;
}

function modifyHero(heroes, planets, vehicles, films) {
  heroes.forEach(hero => {
    /*Search Planet*/
    let planet = planets.find(pl => {
      if (pl.url == hero.homeworld) {
        return true;
      }
    });
    hero.homeworld = planet;
    /*Search Vehicles*/
    hero.vehicles.forEach((vel, index, arr) => {
      let vehicle = vehicles.find(v => {
        if (vel == v.url) {
          return true;
        }
      });
      arr[index] = vehicle;
    });
    /*Films*/
    hero.films.forEach((vel, index, arr) => {
      let film = films.find(f => {
        if (vel == f.url) {
          return true;
        }
      });
      arr[index] = film;
    });
  });
}

function displayElement(col1, col2, heroes) {
  let i = 0;
  let conteiner;
  heroes.forEach(item => {
    let element = creatElement();
    addName(item, element);
    if (i % 2) {
      conteiner = col1
    } else {
      conteiner = col2;
    }
    i++;
    conteiner.insertAdjacentElement('beforeend', element);
    addTable(item, element);
  });
}

function creatElement() {
  let element = document.createElement('div');
  element.classList.add('data-element');
  element.insertAdjacentHTML('afterbegin', '<div class="data-name"></div>');
  element.insertAdjacentHTML('beforeend', '<table class="data-table"></table>');
  return element;
}

function addName(hero, element) {
  let dataName = element.querySelector('.data-name');
  dataName.innerHTML = hero.name;
}

function addTable(hero, element) {
  let table = element.querySelector('.data-table');
  table.insertAdjacentHTML("beforeend", `<tr><th>Name</th><td>${hero.name}</td></tr>`);
  table.insertAdjacentHTML("beforeend", `<tr><th>Gender</th><td>${hero.gender}</td></tr>`);
  table.insertAdjacentHTML("beforeend", `<tr><th>Birthday</th><td>${hero["birth_year"]}</td></tr>`);
  table.insertAdjacentHTML("beforeend", `<tr><th>Home planet</th><td>${hero.homeworld.name}</td></tr>`);
  let vehiclesDisplay = strToReturnFromArr(hero.vehicles, 'name');
  table.insertAdjacentHTML("beforeend", `<tr><th>Vehicles</th><td class='right'>${vehiclesDisplay}</td></tr>`);
  let filmsDisplay = strToReturnFromArr(hero.films, 'title');
  table.insertAdjacentHTML("beforeend", `<tr><th>Films</th><td class='right'>${filmsDisplay}</td></tr>`);
}

function strToReturnFromArr(arr, key) {
  let str = '';
  if (arr.length != 0) {
    for (let i = 0; i < arr.length; i++) {
      str += `${arr[i][key]}`
      if (i != arr.length - 1) {
        str += '<br>';
      }
    }
  } else {
    str = 'None';
  }
  return str;
}