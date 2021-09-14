import React from 'react'
import ethereum from '../ethereum.png';
import icon from "../icon.png"
const Nav = (props) => {
    return (
        <div>
            <nav class="navbar navbar-light bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">
                        <img src={ethereum} alt="" width="30" height="30" class="d-inline-block align-text-top me-2" />
                        D-Loto
                    </a>
                    <div className="account" style={{
                        display: "flex",
                        alignItems: "center"
                    }}>
                        <p className="me-2 mt-3">Your Account : <strong className="text-secondary">{props.account}</strong></p>
                        <img src={icon} alt="" width="30" height="30" class="d-inline-block align-text-top me-2" />
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Nav
