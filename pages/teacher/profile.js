import React from "react";

import { useRouter } from 'next/router';
import { useState } from 'react';
import CardSocialTraffic from "../../components/Cards/CardSocialTraffic.js";
import CardTeacherExp from "../../components/Cards/CardTeacherExperienc.js";

export default function Profile() {
  const [imageSrc, setImageSrc] = useState('3');
  const router = useRouter();
  return (
    <>
      {/* <Navbar transparent /> */}
      <main className="profile-page">
        <section className="relative block h-500-px">
          {/* <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div> */}
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-16"
            style={{ transform: "translateZ(0)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-blueGray-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      {imageSrc && (
                   <div class="relative w-48 h-48 rounded-full overflow-hidden -mt-20 ">
                   <img
                     alt="..."
                     src="https://www.pointloma.edu/sites/default/files/styles/basic_page/public/images/20180702_SOEJessica_MCE_022-%281%29.jpg?itok=_bdljWF0"
                     className="object-cover h-full w-full "
                   />
                 </div>
                 
                   
                      )}
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      {/* <button
                        className="bg-blueGray-700 active:bg-blueGray-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                        type="button"
                      >
                        Connects
                      </button> */}
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 pt-3 text-center">
                        
                        <span className="text-sm text-blueGray-400">
                          Dialogue Sessions
                        </span>
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          22
                        </span>
                      </div>
                      <div className="mr-4 pt-3 text-center">
                        
                        <span className="text-sm text-blueGray-400">
                         Languages
                        </span>
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          10
                        </span>
                      </div>
                      <div className="lg:mr-4 pt-3 text-center">
                       
                        <span className="text-sm text-blueGray-400">
                         Teaching Since
                        </span>
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          1989
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-12">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                    Jenna Stones
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{" "}
                    Language Academy
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <CardTeacherExp />
                      <div className="flex mt-4 justify-center">
                        {/* <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                          <CardPageVisits />
                        </div> */}
                        <div className="w-full ">
                          <CardSocialTraffic />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
}
