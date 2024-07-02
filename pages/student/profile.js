import React, { useState } from "react";
import withRoleProtection from "../../hoc/authWrap.jsx";

function Profile() {
  const [imageSrc, setImageSrc] = useState('4'); // Changed to represent a student

  return (
    <>
      <main className="profile-page">
        <section className="relative block h-500-px">
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
                        <div className="relative w-48 h-auto rounded-full overflow-hidden -mt-20">
                          <img
                            alt="..."
                            src="https://th.bing.com/th/id/R.40234cb99a7ec9b843d806a5aba57caf?rik=kPRWo%2fcNM47m7w&pid=ImgRaw&r=0" // Replace with a student's image URL
                            className="object-cover h-full w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0"></div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 pt-3 text-center">
                        <span className="text-sm text-blueGray-400">
                          Courses Taken
                        </span>
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          12
                        </span>
                      </div>
                      <div className="mr-4 pt-3 text-center">
                        <span className="text-sm text-blueGray-400">
                          Major
                        </span>
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          Linguistics
                        </span>
                      </div>
                      <div className="lg:mr-4 pt-3 text-center">
                        <span className="text-sm text-blueGray-400">
                          Enrollment Year
                        </span>
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          2020
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-12">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                    Alex Johnson
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                    University Language Department
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <div className="text-left">
                        <h4 className="text-2xl font-semibold leading-normal mb-2 text-blueGray-700">
                          Academic Profile
                        </h4>
                        <ul className="list-disc list-inside text-blueGray-600">
                          <li><strong>Courses Taken:</strong> Intro to Linguistics, Phonetics, Syntax, Semantics, etc.</li>
                          <li><strong>Degree:</strong> Bachelor of Arts in Linguistics</li>
                          <li><strong>Minor:</strong> Spanish Language</li>
                          <li><strong>Current GPA:</strong> 3.8</li>
                          <li><strong>Research Interests:</strong> Language acquisition, bilingualism</li>
                          <li><strong>Extracurricular Activities:</strong> Language club president, study abroad in Spain</li>
                        </ul>
                      </div>
                      {/* <div className="flex mt-4 justify-center">
                        <div className="w-full">
                          <CardSocialTraffic />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default withRoleProtection(Profile, ['student']);
