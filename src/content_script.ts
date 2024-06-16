export interface newBookmark {
  time: number;
  videoThumbnailUrl: string;
  videoTitle: string;
  des: string;
}

export interface ScriptData {
  "@context":       string;
  "@type":          string;
  description:      string;
  duration:         string;
  embedUrl:         string;
  interactionCount: string;
  name:             string;
  thumbnailUrl:     string[];
  uploadDate:       Date;
  genre:            string;
  author:           string;
}


async function setBookmark(newBookmark: {
  time: number;
  des: string;
}, videoCode: string) {
  console.log(newBookmark);
  return new Promise<void>((resolve, rejest) => {
    chrome.storage.sync.set({
      [videoCode!]: JSON.stringify(newBookmark)
    }, () => {
      if (chrome.runtime.lastError) {
        rejest(chrome.runtime.lastError);
      }
      else {
        resolve();
      }
    });
  });
}

async function clickBookmark(e: MouseEvent) {
  const script = document.querySelector("#microformat > player-microformat-renderer > script")
  const data = JSON.parse(script?.innerHTML!) as ScriptData
  const youtubePlayer = document.getElementsByClassName('video-stream')[0] as HTMLVideoElement;
  const currentVideo = new URL(window.location.href);
  const videoCode = currentVideo.searchParams.get('v');
  const imageUrl = data.thumbnailUrl[0];
  const videoTitle = data.name;


  console.log(videoTitle)
  const currentTime = youtubePlayer.currentTime;
  const time = getTime(currentTime);
  const newBookmark: newBookmark = {
    time: currentTime,
    videoThumbnailUrl: imageUrl,
    videoTitle: videoTitle!,
    des: `time: ${time}`
  }
  console.log(videoTitle)
  console.log(newBookmark)
  await setBookmark(newBookmark, videoCode!);
}
function getTime(time: number) {
  const date = new Date(0);
  date.setSeconds(time);
  const ntime = date.toISOString().substring(11, 19);
  return ntime
}
const addBookMark = async () => {
  const youtubeRigtControls = document.getElementsByClassName("ytp-left-controls")[0];
  const bookmarkBtn = document.createElement('img');
  bookmarkBtn.style.cursor = 'pointer';
  bookmarkBtn.src = chrome.runtime.getURL('assets/bookmark.png');
  bookmarkBtn.title = 'Click to bookmark current timestamp';
  bookmarkBtn.addEventListener('click', clickBookmark)
  youtubeRigtControls.appendChild(bookmarkBtn);
}
addBookMark();

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  const youtubePlayer = document.getElementsByClassName('video-stream')[0] as HTMLVideoElement;
  try {
    const { type, value } = msg as { type: string, value: number };
    if (type === 'PLAY' && (typeof value === 'number')) {
      youtubePlayer.currentTime = value;
    } else {
      sendResponse("send valid value");
    }
  } catch (error) {
    console.log(error)
  }
});
