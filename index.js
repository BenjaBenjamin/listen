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
  fetch("https://eksamenhalvt-0223.restdb.io/rest/brugere", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=uft-8",
      "x-apikey": "5de81a1d4658275ac9dc22e2",
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

  copy.querySelector("h1").textContent = liste.name;
  copy.querySelector("h2").textContent = liste.email;

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
  fetch(`https://eksamenhalvt-0223.restdb.io/rest/brugere/${id}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=uft-8",
      "x-apikey": "5de81a1d4658275ac9dc22e2",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(bruger => {
      formEdit.elements.name.value = bruger.name;
      formEdit.elements.email.value = bruger.email;
      console.log(bruger.name);
    });
}

function post() {
  const data = {
    name: form.elements.name.value,
    email: form.elements.email.value
  };

  addUserToTheDOM(data);

  const postData = JSON.stringify(data);
  fetch("https://eksamenhalvt-0223.restdb.io/rest/brugere", {
    method: "post",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-apikey": "5de81a1d4658275ac9dc22e2",
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
    name: formEdit.elements.name.value,
    email: formEdit.elements.email.value
  };

  let postData = JSON.stringify(data);
  const listeId = formEdit.elements.id.value;

  fetch("https://eksamenhalvt-0223.restdb.io/rest/brugere" + listeId, {
    method: "put",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-apikey": "5de81a1d4658275ac9dc22e2",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(updatedListe => {
      const parentElement = document.querySelector(
        `.liste[data-listeid="${updatedListe._id}"]`
      );

      parentElement.querySelector("h1").textContent = updatedListe.name;
      parentElement.querySelector("h2").textContent = updatedListe.email;
    });
}

function deleteListe(id) {
  fetch("https://eksamenhalvt-0223.restdb.io/rest/brugere/" + id, {
    method: "delete",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-apikey": "5de81a1d4658275ac9dc22e2",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {
      // document.querySelector(`.snack[data-snackid="${id}"]`).remove();
    });
}
