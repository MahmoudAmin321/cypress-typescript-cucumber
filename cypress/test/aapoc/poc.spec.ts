// pl
// https://www.youtube.com/playlist?list=PLqu9_YNKFaC8PbD3QhOOrZarlvuoInDhG

// get href array from youtube
// go to ezmp3
// for each href
// -- convert
// -- download

describe(`poc`, () => {
  // before(() => {
  //   cy.log("before all tests in this suite");
  // });

  // beforeEach(() => {
  //   cy.log("before each test in this suite");
  // });

  // afterEach(() => {
  //   cy.log("after each test in this suite");
  // });

  // after(() => {
  //   cy.log("after all tests in this suite");
  // });

  it("get href array from youtube", () => {
    const totalVideos = 500;
    const cssSelectorOfVideos = "ytd-playlist-video-renderer a#video-title";

    cy.visit(
      "https://www.youtube.com/playlist?list=PLqu9_YNKFaC8PbD3QhOOrZarlvuoInDhG"
    );

    cy.wait(5000);

    function scrollUntilVideosLoaded(totalVideos: number) {
      // cy.get("yt-formatted-string#index")
      //   .last().scr
      //   .click({ scrollBehavior: "top" }); // Scroll to the bottom
      cy.scrollTo("bottom");

      cy.wait(5000); // Wait for content to load

      cy.get(cssSelectorOfVideos).then(($videos) => {
        const videos = $videos.toArray();
        if (videos.length < totalVideos) {
          scrollUntilVideosLoaded(totalVideos); // Call the function recursively
        }
      });
    }

    // Call the function with the total number of videos expected
    scrollUntilVideosLoaded(totalVideos);

    cy.then(() => {
      cy.get(cssSelectorOfVideos).then(($videos) => {
        const videos = $videos.toArray();
        const hrefs = [];
        videos.forEach((video) => {
          // append to array
          hrefs.push(`https://www.youtube.com${video.getAttribute("href")}`);

          // store in file
          cy.writeFile("cypress/fixtures/hrefs.json", hrefs);
        });
      });
    });
  });

  it("convert & download", () => {

  });
});
