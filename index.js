let currentSong = new Audio();
let songs;
let currfolder;

function secondToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;

}


async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        // console.log(element)
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    
    //Show all the songs in the playlist
    let songUL = document.querySelector(".songlists").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                               <img class="invert" src="./IMG/music.svg" alt="">
                               <div class="info">
                                   <div>${song.replaceAll("%20"," ")}</div>
                                   <div>Sandeep</div>
                               </div>
   
                               <div class="playnow">
                                   <span>Play Now</span>
                               <img class="invert" src="./IMG/play.svg" alt="">
                               </div>
   </li>`
    }
    // let audio = new Audio(songs[0]);
    // audio.play();

    // Attach an event listener to each song
    Array.from(document.querySelector(".songlists").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    return songs
}

const playMusic = (track,pause = false) => {
    // let audio = new Audio("/songs/" + track)
    // currentSong.src = `${currfolder}` + decodeURI(track);
    currentSong.src = `/${currfolder}/` + track   
    if (!pause) {
        currentSong.play();
        play.src = "./IMG/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main(){
    //Get the list of all the songs
    songs = await getSongs("songs/ncs");
    playMusic(songs[0], true);
    // console.log(songs)

    //play the first song

    //Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "./IMG/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "./IMG/play.svg"
        }
    });

    //listen for timeupdate event

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondToMinutesSeconds(currentSong.currentTime)}/${secondToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration * 100 + "%");
    });

     // Add an event listener to seekbar

     document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // Add an event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

     //Add an event listener to previous
     previous.addEventListener("click", () => {
        currentSong.pause
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log(songs,index)
        // let index = songs.indexOf(currentSong.src [0]);
        if ((index - 1) >=  0) {
            playMusic(songs[index - 1])
        }
    })

    //Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
            console.log(index)
        }
    })

    //Add an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100;
    })

     //Load the playlist whenever card  is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })


    document.querySelector(".volume>img").addEventListener("click",(e)=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = 0.2;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }
    })

}

main()
