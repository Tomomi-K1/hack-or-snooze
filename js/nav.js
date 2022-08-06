"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function NavLinkToLoadStoriesOnPage(evt) {
  console.debug("NavLinkToLoadStoriesOnPage", evt);
  hidePageComponents();
  start();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", NavLinkToLoadStoriesOnPage);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $navMiddle.show();
}

$submitStoryLink.on('click', function(){
  $storyForm.show();
});

$postStoryBtn.on('click', addStoryAndAddToPage);

$favLink.on('click', function(){

  console.debug('favLinkClick');

  $allStoriesList.empty();

  for(let favStory of currentUser.favorites){
    const $story = generateStoryMarkup(favStory);
    $allStoriesList.append($story);
  }
  addStars('fas');
   
 console.log(currentUser.favorites);
})

 

