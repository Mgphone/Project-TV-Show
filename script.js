// JavaScript code for Level 200 implementation

function setup() {
  fetchEpisodes("https://api.tvmaze.com/shows")
    .then((allShows) => {
      if (allShows) {
        // console.log(allShows);
        selectShows(allShows);
      }
    })

    .catch((error) => console.error(error));
}
function fetchEpisodes(url) {
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Fetching Problem");
      }
    })
    .catch((error) => console.error(error));
}
function selectShows(allShows) {
  const selectedShow = document.getElementById("select-show");
  const showSelect = document.createElement("select");
  showSelect.id = "showList-selector";

  // Default episode path (if no show is selected)
  let episodePath = "https://api.tvmaze.com/shows";
  //first display the episodes

  fetchEpisodes(episodePath)
    .then((allEpisodes) => {
      // console.log("Default episodes:", allEpisodes);
      makePageForEpisodes(allEpisodes);
      // initializeSearchAndDropdown(allEpisodes);
    })
    .catch((error) => {
      console.error("Error fetching default episodes:", error);
    });
  const selectedShows = allShows.sort((a, b) => a.name.localeCompare(b.name));

  selectedShows.map((allShow) => {
    // console.log(allShow);
    const option = document.createElement("option");
    option.value = allShow.id;
    option.textContent = allShow.name;

    showSelect.appendChild(option);
  });

  showSelect.addEventListener("change", () => {
    const selectedOption = showSelect.options[showSelect.selectedIndex];
    // console.log(selectedOption);
    const showId = selectedOption.value;
    // const showName = selectedOption.textContent;

    episodePath = `https://api.tvmaze.com/shows/${showId}/episodes`;

    fetchEpisodes(episodePath)
      .then((allEpisodes) => {
        // console.log("Selected episodes:", allEpisodes);
        initializeSearchAndDropdown(allEpisodes);
      })
      .catch((error) => {
        console.error("Error fetching episodes for selected show:", error);
      });
  });

  selectedShow.append(showSelect);
}

function makePageForEpisodes(episodeList) {
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = ""; // Clear previous episodes

  episodeList.forEach((episode) => {
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode");

    const title = document.createElement("h2");
    const formattedSeason = String(episode.season || "0").padStart(2, "0");
    const formattedNumber = String(episode.number || "0").padStart(2, "0");
    title.textContent = `${episode.name}${
      episode.season ? `- S${formattedSeason}E${formattedNumber}` : ""
    } `;

    const img = document.createElement("img");
    img.src = episode.image.medium;
    img.alt = `${episode.name} - S${formattedSeason}E${formattedNumber}`;

    const refButton = document.createElement("button");
    refButton.textContent = "Reference";
    refButton.addEventListener("click", () => {
      window.open(episode.url, "_blank");
    });

    const description = document.createElement("p");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = episode.summary;
    description.textContent = tempDiv.textContent || tempDiv.innerText;

    episodeDiv.append(title, img, refButton, description);
    mainContainer.appendChild(episodeDiv);
  });
}

function initializeSearchAndDropdown(allEpisodes) {
  const rootElem = document.getElementById("root");
  //default show all
  makePageForEpisodes(allEpisodes);
  const existingControls = document.getElementById("controls");
  if (existingControls) {
    existingControls.remove();
  }
  // Create search bar
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
  searchInput.id = "search-bar";

  //make it episode label
  const selectLabel = document.createElement("label");
  selectLabel.setAttribute("for", "episode-label");

  // Create dropdown
  const episodeSelect = document.createElement("select");
  episodeSelect.id = "episode-selector";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an episode...";
  episodeSelect.appendChild(defaultOption);

  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    const formattedSeason = String(episode.season).padStart(2, "0");
    const formattedNumber = String(episode.number).padStart(2, "0");
    option.value = `${episode.name}`;
    option.textContent = `S${formattedSeason}E${formattedNumber} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });

  // Event listeners
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary.toLowerCase().includes(searchTerm);
      return nameMatch || summaryMatch;
    });
    makePageForEpisodes(filteredEpisodes);
    updateEpisodeCount(filteredEpisodes.length, allEpisodes.length);
  });

  episodeSelect.addEventListener("change", () => {
    const selectedValue = episodeSelect.value;
    if (selectedValue === "") {
      makePageForEpisodes(allEpisodes);
      updateEpisodeCount(allEpisodes.length, allEpisodes.length);
    } else {
      const selectedEpisode = allEpisodes.filter(
        (episode) => episode.name === selectedValue
      );
      makePageForEpisodes(selectedEpisode);
      updateEpisodeCount(selectedEpisode.length, allEpisodes.length);
    }
  });

  // Add elements to DOM
  const controlsDiv = document.createElement("div");
  controlsDiv.id = "controls";
  // controlsDiv.appendChild(selectLabel);
  controlsDiv.append(searchInput, selectLabel, episodeSelect);
  rootElem.prepend(controlsDiv);

  // Episode count display
  const episodeCount = document.createElement("p");
  episodeCount.id = "episode-count";
  controlsDiv.append(episodeCount);
  updateEpisodeCount(allEpisodes.length, allEpisodes.length);
}

function updateEpisodeCount(filtered, total) {
  const episodeCount = document.getElementById("episode-count");
  episodeCount.textContent = `Displaying ${filtered} / ${total} episodes.`;
}

window.onload = setup;
