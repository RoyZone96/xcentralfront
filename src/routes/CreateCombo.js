import React, { useState, useEffect } from "react";
import aimxios from "axios";
import BitSelect from "../components/BitSelect";
import BladeSelect from "../components/BladeSelect";
import RachetSelect from "../components/RachetSelect";


export default function CreateCombo(){

return (
    <div>
        <h1>Create Combo</h1>
        <form className="combo-form">
            
            <label htmlFor="bladeSelect">Blade Type:</label>
            <BladeSelect />
            <label htmlFor="rachetSelect">Rachet Type:</label>
            <RachetSelect />
            <label htmlFor="bitSelect">Bit Type:</label>
            <BitSelect />
            <button type="submit">Create Combo</button>
        </form>
    </div>
);

}
