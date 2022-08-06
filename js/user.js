"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */


//this function is used as a callback function of event listener, that's why the parameter set is evt
async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
  //reset() is javascript method, but in jQuery there is no method like reset(), however you can use the jQuery trigger() method to trigger the JavaScript native reset() method, like this:.trigger("reset");

}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  //The location.reload() method reloads the current URL, like the Refresh button.
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  //if currentUser exists, put token and username to local storage
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");
  hidePageComponents()
  addStars('far');
  addDeletebtn();
  $allStoriesList.show();
  
  updateNavOnLogin();
  
}

function addStars(className){
   const $star = $(`<i class = "${className} fa-star"></i>`)
  $('li').prepend($star);
}

function addDeletebtn(){
  const $deleteBtn = $(`<i class="fas fa-trash-alt"></i>`);
  $('li').prepend($deleteBtn);
}

$allStoriesList.on('click', '.fa-star', toggleFav);
 
  
 async function toggleFav(){
    console.debug('toggleFav');

      $(this).toggleClass('far fas')
      let storyId = $(this).parents('li').attr('id');
      console.log(storyId);
      // let {...story} =storyList.stories.filter(story => story.storyId === storyId);
      
      if((this).classList.contains('fas')){
        await currentUser.addToFav(storyId);
        
      } else {
        await currentUser.removeFromFav(storyId);

      }
  }
 
  $allStoriesList.on('click', '.fa-trash-alt', deleteStory);

  async function deleteStory(){
    let storyId = $(this).parents('li').attr('id');
    await storyList.removeStory(currentUser, storyId);
    console.log("removedStory");

    $(this).parents('li').remove();


  }