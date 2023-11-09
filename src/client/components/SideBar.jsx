'use client';

import React, { useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import Logo from './icons/Logo';
import Link from 'next/link';

export default function SideBar({ session }) {
  const [authDropdown, setAuthDropdown] = useState(false);

  return (
    <>
      <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex h-fit items-start p-2 mt-4 ml-3 text-sm rounded-lg sm:hidden focus:outline-none focus:ring-2 text-gray-800 hover:bg-gray-700 focus:ring-gray-600 focus:text-white">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
        </svg>
      </button>
      <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidenav">
        <div className="overflow-y-auto py-5 px-3 h-full border-r bg-gray-800 border-gray-700">
          <ul className="space-y-2">
            <li className="mb-10 flex flex-col items-center gap-2">
              <Logo width="125" />
              <h5 className="font-jockeyOne text-4xl text-center text-white">
                RhombiChess
              </h5>
            </li>
            <li>
              <a href="#a" className="flex items-center p-2 text-base font-normal  rounded-lg text-white  hover:bg-gray-700 group">
                <svg className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16.5A2.493 2.493 0 0 1 6.51 18H6.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .921-3.182 2.477 2.477 0 0 1 1.875-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 11 3.5m0 13v-13m0 13a2.492 2.492 0 0 0 4.49 1.5h.01a2.467 2.467 0 0 0 2.403-3.154 2.98 2.98 0 0 0 .847-5.274 2.468 2.468 0 0 0-.921-3.182 2.479 2.479 0 0 0-1.875-3.344A2.5 2.5 0 0 0 13.5 1 2.5 2.5 0 0 0 11 3.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M19 8.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185" />
                </svg>
                <span className="ml-3">
                  Play
                </span>
              </a>
            </li>
            <li>
              <Link href="api/rules">
                <div className="flex items-center p-2 w-full text-base font-normal rounded-lg transition duration-75 group text-white hover:bg-gray-700">
                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <span className="flex-1 ml-3 text-left whitespace-nowrap">
                  Rules
                </span>
                </div>
              </Link>
            </li>
            <li>
              <button onClick={() => { setAuthDropdown(!authDropdown); }} type="button" className="flex items-center p-2 w-full text-base font-normal rounded-lg transition duration-75 group text-white hover:bg-gray-700" aria-controls="dropdown-authentication" data-collapse-toggle="dropdown-authentication">
                <svg className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 11 14H9a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 10 19Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <div className="w-full text-left text-ellipsis overflow-auto">
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">
                    {session ? (session?.user.name) : ('Account')}
                  </span>
                </div>
                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
              <ul id="dropdown-authentication" className={`${!authDropdown && 'hidden'} pt-2 space-y-2`}>
                {!session ? (
                  <>
                    <li>
                      <button type="button" onClick={() => signIn()} className="flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group text-white hover:bg-gray-700">
                        Sign In
                      </button>
                    </li>
                    <li>
                      <a href="#a" className="flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group  text-white hover:bg-gray-700">
                        Sign Up
                      </a>
                    </li>
                    <li>
                      <a href="#a" className="flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group  text-white hover:bg-gray-700">
                        Forgot Password
                      </a>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button type="button" onClick={() => signOut()} className="flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group text-white hover:bg-gray-700">
                        Sign Out
                      </button>
                    </li>
                    <li>
                      <a href="#a" className="flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group  text-white hover:bg-gray-700">
                        Reset Password
                      </a>
                    </li>

                  </>
                )}
              </ul>
            </li>
          </ul>
          <ul className="pt-5 mt-5 space-y-2 border-t border-gray-700">
            <li>
              <a href="#a" className="flex items-center p-2 text-base font-normal rounded-lg transition duration-75  hover:bg-gray-700 text-white group">
                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-400 group-hover: group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                <span className="ml-3">Settings</span>
              </a>
            </li>
            <li>
              <a href="#a" className="flex items-center p-2 text-base font-normal rounded-lg transition duration-75  hover:bg-gray-700 text-white group">
                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-400 group-hover: group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" /></svg>
                <span className="ml-3">Help</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="text-gray-500 hidden absolute bottom-2 left-0 justify-center p-4 space-x-4 w-full lg:flex bg-gray-800 z-20 border-r border-gray-700">
          RhombiChess© 2023
        </div>
      </aside>
    </>
  );
}
