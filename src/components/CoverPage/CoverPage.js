import React,{ useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CC_logo from "../../assets/img/CrowdConnect1.png";
import vote_logo from "../../assets/img/vote.png";
import group_logo from "../../assets/img/group.png";
import collab_logo from "../../assets/img/group-idea.png";
import group_discc from "../../assets/img/67Z_2112.w009.n001.86Z.p3.86.jpg";
import userFriendly_logo from "../../assets/img/UserFriendly.png";
import "./CoverPage.css";

const CoverPage = () => {
  const [headingText, setHeadingText] = useState("");
  const [subheadingText, setSubheadingText] = useState("");
  const fullText = "Join the Problem-Solving Community";
  const fullSubheadingText = "To Ask, Solve, and Collaborate";
  const [typingComplete, setTypingComplete] = useState(false);


  useEffect(() => {
    let index = 0;
    setHeadingText(""); // Reset the heading text on component mount

    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setHeadingText(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        let subIndex = 0;
        const typeSubheading = setInterval(() => {
          if (subIndex <= fullSubheadingText.length) {
            setSubheadingText(fullSubheadingText.substring(0, subIndex));
            subIndex++;
          } else {
            clearInterval(typeSubheading);
            setTypingComplete(true); // Set typing complete flag when subheading typing is complete
          }
        }, 75); // Speed of subheading typing
      }
    }, 75); // Adjust the speed of the typing effect (100ms delay)

    return () => clearInterval(typingInterval); // Cleanup interval on unmount
  }, [fullText,fullSubheadingText]);

  return (
    <div className="relative bg-gray-100 min-h-screen scroll-smooth">
      {/* Sticky Header Section */}
      <header className="navbar fixed top-0 left-0 right-0 flex justify-between items-center w-full px-5 py-2 bg-white shadow-md z-50">
        {/* Logo */}
        <img
          src={CC_logo}
          alt="CrowdConnect Logo"
          className="logo w-32"
          loading="lazy"
        />

        {/* Navigation */}
        <nav className="flex">
          {/* Login Link */}
          <Link
            to="/login"
            className="button text-green-500 hover:text-green-600 transition transform hover:scale-105 py-2 px-4 rounded"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="button text-green-500 hover:text-green-600 transition transform hover:scale-105 py-2 px-4 rounded"
          >
            SignUp
          </Link>
        </nav>
      </header>

      {/* Main Content Section */}
      <main className="flex flex-col items-center justify-center pt-16 pb-1">
        {/* Hero Section */}
        <section className="w-full h-screen bg-green-50 px-20 py-20 flex flex-col md:flex-row items-center justify-between">
          <div className="flex-shrink-0 p-8 ml-26 md:p-16">
            {/* Image with resized width */}
            <img
              src={group_discc}
              alt="Dream website builder"
              className="w-72 md:w-96"
            />
          </div>
          <div className="w-full md:w-8/12 px-6 lg:px-20 text-center md:text-left mt-8 md:mt-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-500">
              {headingText}
            </h1>
            <h4 className="mt-4 text-base sm:text-lg md:text-xl text-green-500">
              {subheadingText}
            </h4>
            <div className="mt-6">
              {/* Primary Call-to-Action */}
              { typingComplete && (
                <Link
                  to="/signup"
                  aria-label="Start solving problems on CrowdConnect"
                  className="button btn-lg bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 duration-300"
                >
                  Get started
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features py-3 w-full h-full ">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-green-600">Our Features</h2>

            {/* Feature Cards */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              {/* Feature 1: Real-Time Collaboration */}
              <div className="w-full md:w-1/3 p-4">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                  {/* Feature Icon */}
                  <img
                    src={collab_logo}
                    alt="Real-Time Collaboration"
                    className="w-16 mx-auto"
                  />
                  <h3 className="text-xl font-semibold mt-4">
                    Real-Time Collaboration
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Work with the community in real-time to solve pressing
                    challenges together.
                  </p>
                </div>
              </div>

              {/* Feature 2: Crowdsourced Solutions */}
              <div className="w-full md:w-1/3 p-4">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                  <img
                    src={group_logo}
                    alt="Crowdsourced Solutions"
                    className="w-16 mx-auto"
                  />
                  <h3 className="text-xl font-semibold mt-4">
                    Crowdsourced Solutions
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Get multiple perspectives and solutions from experts
                    worldwide.
                  </p>
                </div>
              </div>

              {/* Feature 3: Vote for the Best Ideas */}
              <div className="w-full md:w-1/3 p-4">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                  <img
                    src={vote_logo}
                    alt="Vote for the Best Ideas"
                    className="w-16 mx-auto"
                  />
                  <h3 className="text-xl font-semibold mt-4">
                    Vote for the Best Ideas
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Upvote solutions that work best, ensuring the best ideas
                    rise to the top.
                  </p>
                </div>
              </div>

              {/* Feature 4: User-Friendly Interface */}
              <div className="w-full md:w-1/3 p-4">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                  <img
                    src={userFriendly_logo}
                    alt="Vote for the Best Ideas"
                    className="w-16 mx-auto"
                  />
                  <h3 className="text-xl font-semibold mt-4">
                    User-Friendly Interface
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Navigate easily through the platform, making problem posting
                    and solution submission intuitive for everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
};

export default CoverPage;
