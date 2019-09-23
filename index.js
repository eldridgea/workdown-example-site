addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Fetch and log a request
 * @param {Request} request
 */

async function rawHtmlResponse(html) {
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8"
    }
  };

  return new Response(html, init);
}

async function rawCssResponse(css) {
    const init = {
          headers: {
                  "content-type": "text/css; charset=UTF-8"
          }
    };
      return new Response(css, init);
}

async function handleRequest(request) {
  const url = request.url;
  var removeHttp = url.slice(url.indexOf("//") + 2); //removes everything before the doubleslash, e.g. http://
  var page_name = removeHttp.slice(removeHttp.indexOf("/") + 1); //removes everything before the slash
  if (page_name === "") {
    //if page name not supplied, set to "index"
    var page_name = 'index';
    var getCache = () => pages.get(page_name);
    var page = await getCache();
  } else if (page_name.startsWith("css/")) {
    //gets from css namespace if example.com/css/$PATHs
    var removeCss = page_name.slice(page_name.indexOf("/") + 1)
    var getCache = () => css.get(removeCss);
    var content = await getCache();
    return rawCssResponse(content)
  } else {
    var getCache = () => pages.get(page_name);
    var page = await getCache();
  }
  return rawHtmlResponse(page)
}

