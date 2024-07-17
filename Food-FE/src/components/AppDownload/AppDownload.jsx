import { assets } from "../../assets/assets";
import "./AppDownload.css";
const AppDownload = () => {
  return (
    <div>
      <div className="app-download" id="app-download">
        <p>
          For Better Experience Download <br />
          FoodFS
        </p>
        <div className="app-download-platforms">
          <a
            href="https://play.google.com/store/search?q=shopee+food&c=apps&hl=vi-VN"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={assets.play_store} alt="" />
          </a>
          <a
            href="https://apps.apple.com/vn/app/shopeefood-%E1%BB%A9ng-d%E1%BB%A5ng-giao-m%C3%B3n/id1137866760?l=vi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={assets.app_store} alt="" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppDownload;
