(function() {
  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) {
      var appendString = '';

      for (var i = 0; i < results.length; i++) {
        var item = store[results[i].ref];
        appendString += '<li class="search-list"><a href="' + item.url + '"><h3>' + item.title + '</h3></a>';
        appendString += '<p>' + item.excerpt + '</p></li>';
      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<li>No results found</li>';
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('query');

  if (searchTerm) {
    document.getElementById('search-box').setAttribute("value", searchTerm);
    document.querySelector('h2.post-title-single').innerHTML = "Here's what we got for '" + searchTerm + "'";

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('categories', { boost: 2 });
      this.field('content');
      this.field('excerpt', { boost: 5 });
    });

    for (var key in window.store) {
      idx.add({
        'id': key,
        'title': window.store[key].title,
        'author': window.store[key].author,
        'categories': window.store[key].categories,
        'content': window.store[key].content,
        'excerpt': window.store[key].excerpt
      });

      var results = idx.search(searchTerm);
      displaySearchResults(results, window.store);
    }
  }
})();