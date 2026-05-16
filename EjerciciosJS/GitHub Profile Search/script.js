// script.js

const api = "https://api.github.com/users/";
const main = document.getElementById("main");
const inputForm = document.getElementById("userInput");
const inputBox = document.getElementById("inputBox");

const userGetFunction = async (name) => {
    try {
        const response = await fetch(api + name);
        if (response.status === 404) {
            errorFunction("No profile with this username");
            return;
        }
        const data = await response.json();
        userCard(data);
        repoGetFunction(name);
    } catch (err) {
        errorFunction("Problem fetching user");
    }
};

const repoGetFunction = async (name) => {
    try {
        const response = await fetch(api + name + "/repos?sort=created");
        const data = await response.json();
        repoCardFunction(data);
    } catch (err) {
        errorFunction("Problem fetching repos");
    }
};

const userCard = (user) => {
    const id = user.name || user.login;
    const info = user.bio ? "<p>" + user.bio + "</p>" : "";
    const cardElement =
        "<div class=\"card\">" +
        "<div><img src=\"" + user.avatar_url + "\" alt=\"" + user.login + "\" class=\"avatar\"></div>" +
        "<div class=\"user-info\">" +
        "<h2>" + id + "</h2>" + info +
        "<ul>" +
        "<li>" + user.followers + " <strong>Followers</strong></li>" +
        "<li>" + user.following + " <strong>Following</strong></li>" +
        "<li>" + user.public_repos + " <strong>Repos</strong></li>" +
        "</ul>" +
        "<div id=\"repos\"></div>" +
        "</div></div>";
    main.innerHTML = cardElement;
};

const errorFunction = (error) => {
    main.innerHTML = "<div class=\"card\"><h1>" + error + "</h1></div>";
};

const repoCardFunction = (repos) => {
    const reposElement = document.getElementById("repos");
    for (let i = 0; i < 5 && i < repos.length; i++) {
        const repo = repos[i];
        const repoEl = document.createElement("a");
        repoEl.classList.add("repo");
        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.innerText = repo.name;
        reposElement.appendChild(repoEl);
    }
};

inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = inputBox.value.trim();
    if (user) {
        userGetFunction(user);
        inputBox.value = "";
    }
});
