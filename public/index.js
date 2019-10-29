function fetchAllData(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function(e) {
    if (xhr.readyState === 4) {
      callback(JSON.parse(xhr.responseText));
    } else {
      return xhr.statusText;
    }
  };
  xhr.onerror = function(e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);
}
// var itemsArray = localStorage.getItem("items")
// ? JSON.parse(localStorage.getItem("items"))
// : [];
var start = 0;
function createDomForStories(itemData,start) {
  var count = 0;
  // var itemData = JSON.parse(localStorage.getItem("items"));
  var newContainer = document.createElement("div");

  itemData.splice(start, 20).forEach(item => {
    count += 1;
    newContainer.className = "news-container";
    var clonedTemplateElement = document.querySelector("template");
    var node = document.importNode(clonedTemplateElement.content, true);
    newContainer.appendChild(node);
    document.querySelector(".container").appendChild(newContainer);
    var newDiv = document.querySelector(".storyDiv");
    newDiv.classList.toggle("storyDiv");
    newDiv.className = "newDiv";
    newDiv.querySelector(".storyTitle").textContent = `${count}. ${item.title}`;
    newDiv.querySelector(".storyAuthor").textContent = `by ${item.by}`;
    newDiv.querySelector(".storyPoints").textContent = `${item.score} points`;
  });
}

function getNewStories() {
  var newStories = [];
  var newsLink = document.querySelector(".container").querySelector(".news");
  newsLink.addEventListener("click", () => {
    fetchAllData(
      "https://hacker-news.firebaseio.com/v0/newstories.json",
      newStoriesId => {
        newStoriesId.forEach(element => {
          fetchAllData(
            `https://hacker-news.firebaseio.com/v0/item/${element}.json`,
            itemData => {
              newStories.push(itemData);
              localStorage.setItem("stories", JSON.stringify(newStories));
            }
          );
        });
        var itemData = JSON.parse(localStorage.getItem("stories"));
        document.querySelector(".news-container").remove();
        createDomForStories(itemData);
      }
    );
  });
}

function loadmore() {
  start += 20;
  var itemData = JSON.parse(localStorage.getItem("items"));
  console.log(start)
  createDomForStories(itemData,start);
}

function getAlldata(urlStories) {
  var itemsArray = [];
  fetchAllData(urlStories, storiesId => {
    storiesId.forEach(element => {
      fetchAllData(
        `https://hacker-news.firebaseio.com/v0/item/${element}.json`,
        itemData => {
          itemsArray.push(itemData);
          localStorage.setItem("items", JSON.stringify(itemsArray));
        }
      );
    });
    var itemData = JSON.parse(localStorage.getItem("items"));
    createDomForStories(itemData, 0);
    getNewStories();
    document.querySelector(".load-container").addEventListener("click", ()=>loadmore())
  });
}

getAlldata("https://hacker-news.firebaseio.com/v0/topstories.json");
