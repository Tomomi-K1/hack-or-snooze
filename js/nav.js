"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function NavLinkToLoadStoriesOnPage(evt) {
  console.debug("NavLinkToLoadStoriesOnPage", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", NavLinkToLoadStoriesOnPage);

/**Show Story submit form on licking story "submit" */
function navSubmitStoryClick(evt){
  console.debug(navSubmitStoryClick, evt);
  hidePageComponents();
  $allStoriesList.show();
  $storyForm.show();
}

$submitStoryLink.on('click', navSubmitStoryClick);

/**show Favorite stories on click on "favorites" */
function navFavoritesclick(evt){
  console.debug(navFavoritesclick, evt);
  $favoritedStories.empty();
  hidePageComponents();
  putFavStoriesOnPage();
}

$body.on('click', "#favorites", navFavoritesclick);

/**Show User's Own Stories on clicking "my stories" */
function navMyStoriesclick(evt){
  console.debug(navMyStoriesclick, evt);
  $ownStories.empty();
  hidePageComponents();
  putUserStoriesOnPage();
}

$body.on('click', '#my-stories', navMyStoriesclick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/**hide everything but profile on click "profile" */

function navProfileClick(evt){
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on('click', navProfileClick);


/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $navMiddle.show();
}











