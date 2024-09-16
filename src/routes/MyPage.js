import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AccountPage (){
  const [submissions, setSubmissions] = useState([]);

  const token = localStorage.getItem('token');

    //get the submissions of the user

  return (
    <div className='scroll-container'>
      <h2>My Bookmarks</h2>
      {submissions.map(bookmark => (
        <div key={bookmark.url}>
          {/* Implement functionality to update stats or delete the submission in question */}
        </div>
      ))}
    </div>
  );
};