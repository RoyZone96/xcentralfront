import React from 'react';
import './Footer.css'; // Assuming you have some CSS for styling

export default function Footer () {
    return (
        <footer className="footer">
            <div >
                <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
        </footer>
    );
};

 