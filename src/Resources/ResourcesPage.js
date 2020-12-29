import React, { useEffect, useState, useRef } from "react";
import PublicationsList from "./PublicationsList";
import { getProjects, getPublications } from "./resourcesAPI";
import SearchBar from "./SearchBar";

const ResourcesPage = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [publications, setPublications] = useState([]);
  const [allPublications, setAllPublications] = useState([]);
  const [projectsMap, setProjectsMap] = useState(null);


  useEffect(() => {
    async function fetchData() {
      let values = await Promise.all([getProjects(), getPublications()]);
      
      let _publications = values[1]._embedded.edition;
      const publicationsPageCount = values[1].page_count;
      let _projects = values[0].map;
      const projectsPageCount = values[0].page_count;

      setProjectsMap(values[0].map);
      setPublications(_publications);
      setIsLoading(false);

      // load all publications in-memory
      for (let i = 2; i <= publicationsPageCount; i++) {
        values = await getPublications(i, 100);
        _publications = _publications.concat(values._embedded.edition);
      }
      setPublications(() => [..._publications]);
      setAllPublications(() => [..._publications]);
      
      // load all projects in-memory
      for (let i = 2; i <= projectsPageCount; i++) {
        values = await getProjects(i, 100);
        _projects = _projects.concat(values._embedded.edition);
      }
      setProjectsMap(_projects);
    }
    fetchData();

  }, []);

  const updateInput = async (input) => {
    if (input.length === 0) {
      setPublications(() => [...allPublications]);
    } else {
      const filtered = allPublications.filter(pub => {
        return pub.name.toLowerCase().includes(input.toLowerCase())
      })
      setPublications(filtered);
    }
    setInput(input);

  }

  return (
    <>
      <SearchBar
        keyword={input}
        setKeyword={updateInput}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
          <PublicationsList
            publications={publications}
            projectsMap={projectsMap}
          />
        )}
    </>
  );
};

export default ResourcesPage;