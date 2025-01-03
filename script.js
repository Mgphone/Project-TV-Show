//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

  // console.log(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const getMain = document.querySelector("main");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  //create div container

  //small container inside title and episode name
  //small container inside image(medium size image)
  // small container inside paragraph(summary text)

  //   //create small container inside div
  episodeList.map((episode) => {
    //create div and add as class name episode
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode");
    //create title
    const title = document.createElement("h2");
    const formattedSeason = String(episode.season).padStart(2, "0");
    const formattedNumber = String(episode.number).padStart(2, "0");
    title.textContent = `${episode.name}-${formattedSeason}${formattedNumber}`;
    //create image
    const img = document.createElement("img");
    img.src = episode.image.medium;
    img.alt = `${episode.name}-${episode.season}-${episode.number}`;
    //create button
    const refButton = document.createElement("button");
    refButton.textContent = "Reference";
    refButton.addEventListener("click", function () {
      window.open(`${episode.url},"_blank"`);
    });
    //create description
    const description = document.createElement("p");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = episode.summary;
    description.textContent = tempDiv.textContent || tempDiv.innerText;

    //add to episode div
    episodeDiv.appendChild(title);
    episodeDiv.appendChild(img);
    episodeDiv.appendChild(refButton);
    episodeDiv.appendChild(description);
    //add to root
    getMain.appendChild(episodeDiv);
  });
}

window.onload = setup;
