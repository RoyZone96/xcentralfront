import React from "react";
import "./Landing.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

export default function Landing() {
  //const hasToken = localStorage.getItem('token');

  return (
    <div id="landing-blurb">
      <h1 className="intro">Welcome to the X Tower!</h1>

      <article className="forward">
        <b>
          The X Tower is a platform for bladers to showcase their combinations
          in comparison to others around the world.
        </b>
        <br />
        <section>
          <p>
            This app is currently in constant development. If you have any
            suggestions for what to add to the app email me at: {" "}
            <a href="mailto:royzone4@gmail.com">
              <FontAwesomeIcon icon={faEnvelope}/>royzone4@gmail.com
            </a>
          </p>
        </section>
      </article>
    </div>
  );
}
