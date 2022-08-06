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

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  console.debug("hostName", hostName);
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

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

async function addStoryAndAddToPage(evt){
  evt.preventDefault();
  console.debug('addStoryAndAddToPage');
  
  const title = $('#title').val();
  const author = $('#author').val();
  const url = $('#url').val()

 
  $storyForm.hide();
  console.debug('hideStoryForm');
  // why this does not work ?
  // const newStory = {title, author, url}
  // let story = await storyList.addStory(currentUser, newStory);

  let story = await storyList.addStory(currentUser,
    {title, author, url});

  $storyForm.trigger("reset");
  
  storyList.stories.unshift(story);
  
  putStoriesOnPage();
  updateUIOnUserLogin();
  
    
}

