// JavaScript code for Level 200 implementation

function setup() {
  fetchEpisodes("https://api.tvmaze.com/shows/2/episodes")
    .then((allEpisodes) => {
      if (allEpisodes) {
        // console.log(allEpisodes);
        initializeSearchAndDropdown(allEpisodes);
        // makePageForEpisodes(allEpisodes);
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

function makePageForEpisodes(episodeList) {
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = ""; // Clear previous episodes

  episodeList.forEach((episode) => {
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode");

    const title = document.createElement("h2");
    const formattedSeason = String(episode.season).padStart(2, "0");
    const formattedNumber = String(episode.number).padStart(2, "0");
    title.textContent = `${episode.name} - S${formattedSeason}E${formattedNumber}`;

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
