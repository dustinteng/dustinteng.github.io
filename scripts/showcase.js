import * as contentful from "/scripts/contentful.js";

/* init()
 * Initialization function
 * Will be executed once during the first loading of the page
 * This is an async function as we need to wait for the compile functions to finish to scroll to the target id
 */
export const init = async () => {
  await contentful.init();
  await compileShowcases();

  // As the fetching of content and insertion to the HTML document may have delays,
  // The browser might not scroll to the hash, so do it manually
  if (window.location?.hash) {
    document.querySelector(window.location.hash).scrollIntoView({
      behavior: "smooth",
    });
  }
};

/* convertToHTML()
 * A helper function that converts values returned by contentful to HTML string
 */
const convertToHTML = (row) => {
  let result = "";
  let node = undefined;
  switch (row?.nodeType) {
    case "unordered-list":
      result += `<ul>`;
      row?.content?.forEach((listItem) => {
        while (listItem?.nodeType != "text") {
          listItem = listItem.content[0];
        }
        result += `<li>${listItem.value}</li>`;
      });
      result += "</ul>";
      return result;

    case "ordered-list":
      result += `<ol>`;
      row?.content?.forEach((listItem) => {
        while (listItem?.nodeType != "text") {
          listItem = listItem.content[0];
        }
        result += `<li>${listItem.value}</li>`;
      });
      result += "</ol>";
      return result;

    case "heading-3":
      result += `<h3>`;
      node = row.content[0];
      while (node?.nodeType != "text") {
        node = node.content[0];
      }
      result += `${node.value}`;

      result += "</h3>";
      return result;

    case "paragraph":
      result += `<p>`;
      node = row.content[0];
      while (node?.nodeType != "text") {
        node = node.content[0];
      }
      result += `${node.value}`;

      result += "</p>";
      return result;

    case "heading-4":
      result += `<h4>`;
      node = row.content[0];
      while (node?.nodeType != "text") {
        node = node.content[0];
      }
      result += `${node.value}`;

      result += "</h4>";
      return result;

    default:
      return "";
  }
};

/* compileShowcases()
 * A helper function that fetches the showcase content from contentful and insert it into the HTML document
 */
const compileShowcases = async () => {
  let mainSection = document.getElementById("main");
  let response = await contentful.getShowcases();
  let data = response?.items;
  console.log(data);
  if (data) {
    data.forEach((obj) => {
      let element = document.createElement("section");
      element.id = obj.fields.id["en-US"];
      let innerHTML = `
        <h2>${obj.fields.showcaseTitle}</h2>
      `;

      obj.fields.images?.forEach((image) => {
        innerHTML += `
          <figure>
            <picture>
              <source media="(max-width: 600px)" srcset="https:${image.fields?.file?.url}?w=850">
              <img width="${image.fields?.file?.details?.image?.width}" height="${image.fields?.file?.details?.image?.height}" alt="${image.fields?.title}" src="https:${image.fields?.file?.url}" />
            </picture>
            <figcaption>${image.fields?.description}</figcaption>
          </figure>
        `;
      });

      obj.fields.videos?.links.forEach((link) => {
        innerHTML += `
          <iframe 
            src="${link}" 
            frameborder="0" 
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            class="video"
          ></iframe>
        `;
      });

      obj.fields.content.content.forEach((object) => {
        innerHTML += convertToHTML(object);
      });

      if (obj.fields.sideNote) {
        innerHTML += "<aside>";
        obj.fields.sideNote.content.forEach((object) => {
          innerHTML += convertToHTML(object);
        });
        innerHTML += "</aside>";
      }

      element.innerHTML = innerHTML;

      mainSection.appendChild(element);
    });
  }
};
