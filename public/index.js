async function getAllTopStories() {
  let storiesResponse = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  return await storiesResponse.json();
}

async function getAlldata() {
  let storiesId = await getAllTopStories();
  let itemData = [];
  storiesId.forEach(async element => {
    let item = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${element}.json?print=pretty`
    );
    itemData.push(await item.json());
  });

  console.log(itemData);
}



getAlldata();