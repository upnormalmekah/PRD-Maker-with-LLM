import React, { useState } from 'react';

const Navbar = () => {
    return (
        <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">PRD Maker</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://media.licdn.com/dms/image/v2/D560BAQFXNWmkiLNccw/company-logo_200_200/company-logo_200_200/0/1708245223676?e=1740614400&v=beta&t=v-15F2A35whw0l7sQgVEdm3JaYVbDRA-v_6l42wYyYY" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    );  
};

export default Navbar;