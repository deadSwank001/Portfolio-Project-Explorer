# Portfolio Project Explorer

A searchable portfolio of [@deadSwank001's public repositories](https://github.com/deadSwank001?tab=repositories),
with curated highlights and filters for topic and language.

Open `index.html` in a browser or run `python -m http.server` in this directory.
The page reads the public GitHub API from the visitor's browser, including all
pages of results. If the API is unavailable or rate-limited, it displays the
bundled snapshot and says so. No authentication or private repository data is
used. The snapshot can be regenerated with GitHub CLI:

```bash
gh repo list deadSwank001 --visibility public --limit 1000 \
  --json name,description,url,primaryLanguage,pushedAt,homepageUrl,isFork,isArchived \
  | node scripts/snapshot.js > projects-data.js
```

Topics are inferred from repository names and descriptions and are only
approximate. The screenshot and featured project selection are curated in
`app.js`; demo links appear only when a repository has an HTTPS homepage.
Run `node --test explorer.test.js` to check filtering and URL handling.
