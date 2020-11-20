const https = require("https");

exports.sampleRequest = function (req, res) {
  console.log("inside fetch news");
  https.get("https://time.com/", (response) => {
    let html = "";
    response.on("data", (chunk) => {
      html += chunk;
    });
    response.on("end", () => {
      var flag1 = 0,
        strarr = [];
      fullpagearray = html.split(" ");
      fullpagearrayLength = fullpagearray.length;
      for (var k = 0; k < fullpagearrayLength; k++) {
        if (fullpagearray[k] == 'decoration-arrow">Latest') {
          flag1 = 1;
        }
        if (fullpagearray[k] == "<section") {
          flag1 = 0;
        }
        if (flag1 == 1) {
          strarr.push(fullpagearray[k]);
        }
      }
      length = strarr.length;
      var count = 0,
        flag = 0,
        mainarr = [];
      var newsarray = [
        { title: "", link: "" },
        { title: "", link: "" },
        { title: "", link: "" },
        { title: "", link: "" },
        { title: "", link: "" },
      ];
      for (i = 0; i < length; i++) {
        if (strarr[i].includes("href")) {
          linkbeta = strarr[i].split("/");
          newsarray[count].link =
            "https://time.com/" + linkbeta[1] + "/" + linkbeta[2];
          count++;
          flag = 1;
        }
        if (strarr[i].includes("</h2>")) {
          mainarr.push(strarr[i]);
          flag = 0;
        }
        if (flag == 1) {
          mainarr.push(strarr[i]);
        }
      }
      str = mainarr.join(" ");
      const regex = /(?<=\>).+?(?=\<)/g;
      let m;
      let indx = 0;
      while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
          if (newsarray.length > indx) {
            newsarray[indx].title = match;
            indx += 1;
          }
        });
      }
      var my = JSON.stringify(newsarray);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(my);
    });
  });
};
