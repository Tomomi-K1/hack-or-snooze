"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  console.debug("storyList", storyList);
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}


/*********function to create Story Markup *****************************/
/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  //if a user is logged in, show favorite/non-favorite star
  const showStar = Boolean(currentUser);
    
  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn? addDeletebtn(): ""}
      ${showStar? addStars(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

//*****ADD Stars***************//
function addStars(story, user){
    
    const isFavorite = user.isFavorite(story);
    const starType = isFavorite ? "fas": "far";
    // console.log("addStars is favorite=", isFavorite, "startype=", starType);
    return`
      
        <i class="${starType} fa-star"></i>
      `;
}

//*****Markup For DeleteBtn***************//
function addDeletebtn(){
 return` 
    
      <i class="fas fa-trash-alt"></i>
    `;
}

/*************end of story markup including star and deleteBtn************************************/


/*************Put Stories on Page functions******************/
/** Gets list of stories from server, generates their HTML, and puts on page. */

//----------Put all stories on Page------------//
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
 
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//----------Put FAVORITES stories on Page------------//
function putFavStoriesOnPage(){
  console.debug('putFavStoriesOnPage');

  $favoritedStories.empty();

  if(currentUser.favorites.length === 0){
     $favoritedStories.append("<h5>No Favorites added!</h5>");
  } else{
    for(let favStory of currentUser.favorites){
    const $story = generateStoryMarkup(favStory);
    $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}  



//----------Put USER'S OWN STORIES on Page------------//
function putUserStoriesOnPage(){
  console.debug('putUserStoriesOnPage');

  $ownStories.empty();

  if(currentUser.ownStories.length === 0){
    $ownStories.append("<h5>No Stories added by user yet!</h5>");
  } else{
    for(let myStory of currentUser.ownStories){
      const $story = generateStoryMarkup(myStory, true);
      $ownStories.append($story);
    }
  }
 $ownStories.show();
}



/****************End of Put Stories on Page functions**********************/


//***************add story by user**************/

async function addStoryAndAddToPage(evt){
  evt.preventDefault();
  console.debug('addStoryAndAddToPage');
  
  const title = $('#title').val();
  const author = $('#author').val();
  const url = $('#url').val()

 let story = await storyList.addStory(currentUser,{title, author, url});
  
  //hide the form and reset
  $storyForm.hide();
  $storyForm.trigger("reset");
  
  putStoriesOnPage();
  // updateUIOnUserLogin();
    
}

$postStoryBtn.on('click', addStoryAndAddToPage);


//***************delete story**************/
async function deleteStory(){
  console.debug("deleteStory");

  let storyId = $(this).parents('li').attr('id');
  await storyList.removeStory(currentUser, storyId);
  console.log("deleteStory ownstory", currentUser.ownStories);
  //regenerate story-list
  await putUserStoriesOnPage();

}

$ownStories.on('click', '.fa-trash-alt', deleteStory);

/*****handle favorite/un-favorite a story*******/
  
 async function toggleFav(){
    console.debug('toggleFav');
      
      $(this).toggleClass('far fas')
      let storyId = $(this).parents('li').attr('id');
      const story = storyList.stories.find(s => s.storyId ===storyId);
      // let {...story} =storyList.stories.filter(story => story.storyId === storyId);
      
      if((this).classList.contains('fas')){
        await currentUser.addToFav(story);
        
      } else {
        await currentUser.removeFromFav(storyId);
      }
  }

  $storiesList.on('click', '.fa-star', toggleFav);
 

