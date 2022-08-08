"use strict";

//this is base URL for API
const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    const {hostname} = new URL(this.url);
    return hostname;
    // return new URL(this.url).host;
  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method? because this will create original first StoryList.before this there is no instance of storyList created.

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory(user, newStory) {
    //this addStory is created as the method of StoryList because we need to update this.stories
    const token = user.loginToken;
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "POST",
      data: {token, story: newStory},
      });

      let story = new Story(response.data.story);
      this.stories.unshift(story);
      //adding newStory to this.stories(which equal to global Variable "storyList" because we will use this method lie this "storyList.addStory")
      // console.log("this.stories", this.stories);
      user.ownStories.unshift(story);
      //also need to update the user's ownStories array.
      
      return story;
  }

  async removeStory(user, storyId) {
    const token = user.loginToken;
    const response = await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "DELETE",
      data:{ token }
    });
    
    //filter out the story whose ID we are removing
    this.stories = this.stories.filter(story => story.storyId !== storyId);

    //do the same thing for the user's list of stories & their favorites
    user.ownStories = user.ownStories.filter(story => story.storyId !== storyId );
    user.favrites = user.favorites.filter(story => story.storyId !== storyId);
  }

}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories

    //what happens if we don't do this? ==> if we do not do this this.favorite will have normal object, not the instance of story. since all stories pulled out from API is turned into the instance of story. It would be better to make all story object into instance of story.
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));
    

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  async addToFav(story){
    console.debug('addStoryToFav');
    //update favorites of User instance
    this.favorites.push(story);
    
    //add story to API database
    await axios({
    url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
    method: "POST",
    data: { token: this.loginToken },
    });
   
  }

 async removeFromFav(storyId){
    console.debug('removeStoryFromFav');
    //add to favorites of User instance
    this.favorites = this.favorites.filter(s => s.storyId !== storyId);
    
    //remove from API data
    await axios({
    url: `${BASE_URL}/users/${this.username}/favorites/${storyId}`,
    method: "DELETE",
    data: { token: this.loginToken },
    });
    console.log("removed story from fav")
    
  }

  
  isFavorite(story){
    return this.favorites.some(s=>(s.storyId === story.storyId));
  }


}

