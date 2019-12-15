const form = document.querySelector("form#addForm");
const formEdit = document.querySelector("form#editForm");
form.setAttribute("novalidate", true);

form.elements.name.addEventListener("focus", e => {
  form.elements.name.classList.remove("notValid");
});
form.elements.name.addEventListener("blur", e => {
  if (form.elements.name.checkValidity()) {
    form.elements.name.classList.remove("notValid");
  } else form.elements.name.classList.add("notValid");
});

form.addEventListener("submit", evt => {
  post();
  evt.preventDefault();
});

formEdit.addEventListener("submit", evt => {
  evt.preventDefault();
  put();
});

document.querySelector(".rediger").addEventListener("click", showform);
document.querySelector(".færdig").addEventListener("click", closeform);

function showform() {
  console.log(showform);
  document.querySelector("#editForm").classList.remove("remove");
}

function closeform() {
  console.log(showform);
  document.querySelector("#editForm").classList.add("remove");
}

function get() {
  fetch("https://eksamen-f310.restdb.io/rest/brugere", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=uft-8",
      "x-apikey": "5de4cc954658275ac9dc2176",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(brugere => {
      brugere.forEach(addUserToTheDOM);
    });
}

get();

function addUserToTheDOM(liste) {
  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);

  copy.querySelector("article.liste").dataset.listeid = liste._id;

  copy.querySelector("h1").textContent = liste.cpr;
  copy.querySelector("h2").textContent = liste.name;
  copy.querySelector("h3").textContent = liste.lastname;
  copy.querySelector("h4").textContent = liste.username;
  copy.querySelector("h5").textContent = liste.mobile;
  copy.querySelector("h6").textContent = liste.address;
  copy.querySelector("h7").textContent = liste.gender;
  copy.querySelector("h8").textContent = liste.estimated;

  copy.querySelector("button.btnDelete").addEventListener("click", e => {
    const target = e.target.parentElement;
    target.classList.add("remove");
    deleteListe(liste._id);
  });

  copy.querySelector("button.btnEdit").addEventListener("click", e => {
    fetchAndPopulate(liste._id);
  });

  document.querySelector("#app").prepend(copy);
}

function fetchAndPopulate(id) {
  fetch(`https://eksamen-f310.restdb.io/rest/brugere/${id}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=uft-8",
      "x-apikey": "5de4cc954658275ac9dc2176",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(bruger => {
      formEdit.elements.cpr.value = bruger.cpr;
      formEdit.elements.name.value = bruger.name;
      formEdit.elements.lastname.value = bruger.lastname;
      formEdit.elements.username.value = bruger.username;
      formEdit.elements.mobile.value = bruger.mobile;
      formEdit.elements.address.value = bruger.address;
      formEdit.elements.gender.value = bruger.gender;
      formEdit.elements.estimated.value = bruger.estimated;
      formEdit.elements.id.value = bruger._id;

      console.log(bruger.name);
    });
}

function post() {
  const data = {
    cpr: form.elements.cpr.value,
    name: form.elements.name.value,
    lastname: form.elements.lastname.value,
    username: form.elements.username.value,
    mobile: form.elements.mobile.value,
    address: form.elements.address.value,
    gender: form.elements.gender.value,
    estimated: form.elements.estimated.value
  };

  addUserToTheDOM(data);

  const postData = JSON.stringify(data);
  fetch("https://eksamen-f310.restdb.io/rest/brugere", {
    method: "post",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-apikey": "5de4cc954658275ac9dc2176",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
    });
}

function put() {
  const data = {
    cpr: formEdit.elements.cpr.value,
    name: formEdit.elements.name.value,
    lastname: formEdit.elements.lastname.value,
    username: formEdit.elements.username.value,
    mobile: formEdit.elements.mobile.value,
    address: formEdit.elements.address.value,
    gender: formEdit.elements.gender.value,
    estimated: formEdit.elements.estimated.value
  };

  let postData = JSON.stringify(data);
  const listeId = formEdit.elements.id.value;

  fetch("https://eksamen-f310.restdb.io/rest/brugere/" + listeId, {
    method: "put",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-apikey": "5de4cc954658275ac9dc2176",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(updatedListe => {
      const parentElement = document.querySelector(
        `.liste[data-listeid="${updatedListe._id}"]`
      );

      console.log(updatedListe.cpr);

      parentElement.querySelector("h1").textContent = updatedListe.cpr;
      parentElement.querySelector("h2").textContent = updatedListe.name;
      parentElement.querySelector("h3").textContent = updatedListe.lastname;
      parentElement.querySelector("h4").textContent = updatedListe.username;
      parentElement.querySelector("h5").textContent = updatedListe.mobile;
      parentElement.querySelector("h6").textContent = updatedListe.address;
      parentElement.querySelector("h7").textContent = updatedListe.gender;
      parentElement.querySelector("h8").textContent = updatedListe.estimated;
    });
}

function deleteListe(id) {
  fetch("https://eksamen-f310.restdb.io/rest/brugere/" + id, {
    method: "delete",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-apikey": "5de4cc954658275ac9dc2176",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {
      // document.querySelector(`.snack[data-snackid="${id}"]`).remove();
    });
}
