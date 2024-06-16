import React, { useEffect, useState } from 'react'
import { newBookmark } from '../content_script';
interface data extends newBookmark {
  url: string;
}
const Popup = () => {
  const [run, setRun] = useState(false);
  const [newData, setNewData] = useState<data[]>();
  useEffect(() => {
    const fun = async () => {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    }
    fun();
  }, []);
  useEffect(() => {
    const fun = async () => {
      const data = await chrome.storage.sync.get(null);
      console.log(data);
      const dataArr = [];
      for (let [key, value] of Object.entries(data)) {
        const valueData = JSON.parse(value) as newBookmark
        const newObj = {
          url: key,
          ...valueData
        }
        dataArr.push(newObj);
      }
      setNewData([...dataArr]);
    }
    fun();
  }, [run]);
  const deleteData = async () => {
    await chrome.storage.sync.clear();
    setRun(p=>!p);
  }
  const playVideo = async (url: string, time: number) => {
    /*
    url = https://www.youtube.com/watch?v=EFn_yAb5ac0
    tab[0].url = https://www.youtube.com/watch?v=-pcGfrp3RNk
    */
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    const windowUrl = new URL(tabs[0].url!);
    const v1 = windowUrl.searchParams.get('v')

    if (url === v1) {
      chrome.tabs.sendMessage(tabs[0].id!, {
        type: "PLAY",
        value: time,
      });
    }
    else {
      try {
        window.open(`https://www.youtube.com/watch?v=${url}&t=${time}s`, '_blank');
      } catch (error) {
        console.log(error)
      }
    }
  }
  const deleteVideo = async (url: string) => {
    try {
      await chrome.storage.sync.remove(url);
      setRun(p=>!p);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <ul style={{ minWidth: "700px", minHeight: "50px", padding: "10px", borderRadius: "16px"}} >
        {newData && newData.map((item, index: number) => (
          <li key={index} style={{ display: 'flex', justifyContent: "space-between", backgroundColor: '#e6e8d3',borderRadius: "16px", marginTop:"10px", marginBottom:"10px" }}>
            <img src={item.videoThumbnailUrl} style={{ height: '44.8px', width: '80px', cursor: 'pointer',borderTopLeftRadius: "16px",borderBottomLeftRadius: "16px" }} />
            <h3>{item.videoTitle}</h3>
            <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                onClick={() => playVideo(item.url, item.time)}
                src="assets/play.png"
                style={{ height: '40px', width: '40px', cursor: 'pointer', marginLeft: '5px', marginRight: '5px',borderRadius: "9999px" }}
              />
              <img
                onClick={() => deleteVideo(item.url)}
                src='assets/delete.png'
                style={{ height: '40px', width: '40px', cursor: 'pointer', marginLeft: '5px', marginRight: '5px', borderRadius: "9999px" }}
              />
            </span>
          </li>
        ))}
      </ul>
      <div style={{ backgroundColor: '#708aff', display: 'flex', justifyContent: 'center', alignItems: 'center',borderRadius: "16px" }}>
        <button style={{cursor: 'pointer', padding: '5px', backgroundColor: '#143fff', color: 'white',borderRadius: "16px" }} onClick={deleteData}>Delete all</button>
      </div>
    </>
  );
};

export default Popup