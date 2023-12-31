"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

const IMAGE_PLACEHOLDER = "https://tinyurl.com/tv-missing";
const TVMAZE_URL = "https://api.tvmaze.com/";   // search/shows?"

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const queryParams = {
    "q": term
  }
  const params = new URLSearchParams(queryParams);
  console.log(queryParams);
  console.log(params);

  const response = await fetch(TVMAZE_URL+`search/shows?${params}`);
  const showsData = await response.json();

  let series = [];
  for (let tvShow of showsData) {
    series.push({
      id: tvShow.show.id,
      name: tvShow.show.name,
      summary: tvShow.show.summary,
      image: !tvShow.show.image ? IMAGE_PLACEHOLDER : tvShow.show.image.medium
    });
  }
  console.log("series",series);

  return series;

  // This is an example of the expected subset of the response object.
  /*
  return [
    {
      id: 1767,
      name: "The Bletchley Circle",
      summary:
        `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
           women with extraordinary skills that helped to end World War II.</p>
         <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
           normal lives, modestly setting aside the part they played in
           producing crucial intelligence, which helped the Allies to victory
           and shortened the war. When Susan discovers a hidden code behind an
           unsolved murder she is met by skepticism from the police. She
           quickly realises she can only begin to crack the murders and bring
           the culprit to justice with her former friends.</p>`,
      image:
          "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
    }
  ]
  */
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button id="btn-${show.id}" class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);


    $showsList.append($show);
    $(`#btn-${show.id}`).on('click',displayEpisodes);
  }
  console.log('displayShows',displayShows);
}

function sayHi() {
  console.log('Congratulations on clicking a button.');
  return 'You clicked something.';
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm (evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
// input: id of the show
//

async function getEpisodesOfShow(id) {

  const episodeResponse = await fetch(TVMAZE_URL+"shows/"+id+"/episodes");
  const episodeData = await episodeResponse.json();

  //id, name, season number

  let tvShow = [];
  for (let show of episodeData) {
    tvShow.push ({
      "id": show.id,
      "name": show.name,
      "season": show.season,
      "number": show.number
      })
    }
  console.log('getEpisodesOfShow',getEpisodesOfShow);
  return tvShow;
}

/** Write a clear docstring for this function... */

function displayEpisodes(episodes) {

}



$('episodesList').on('click',getEpisodesOfShow);

// add other functions that will be useful / match our structure & design
