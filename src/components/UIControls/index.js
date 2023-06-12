import React from 'react'
import "./styles.css"

const UIControls = (props) => {
    return (
        <div className="ui-wrapper">
            <h1 className="ui-title">Search</h1>
            <div className="ui-header">
                <input type="text" className="nes-input is-dark" placeholder="Search"/>
                <div className="nes-select is-dark" style={{width: '340px'}}>
                    <select>
                        <option defaultValue="all">All Regions</option>
                        <option value="USA">USA</option>
                        <option value="Europe">Europe</option>
                        <option value="Japan">Japan</option>
                    </select>
                </div>
                <button type="button" className="nes-btn">+</button>
            </div>
            {/*<div className="nes-container is-dark with-title ui-rom-wrapper"></div>*/}
        </div>
    )
}

export default UIControls;