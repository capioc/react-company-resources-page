import React, { useEffect, useRef, useState } from "react";

const PublicationsList = ({ publications, projectsMap }) => {

  // add loader refrence 
  const loader = useRef(null);
  // tracking on which page we currently are
  const [page, setPage] = useState(1);
  const [visiblePubs, setVisiblePubs] = useState([]);
  const [hideLoader, setHideLoader] = useState({ display: "block" });

  useEffect(() => {
    var options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    // initialize IntersectionObserver
    // and attaching to Load More div
    const observer = new IntersectionObserver(handleObserver, options);

    if (loader.current) {
      observer.observe(loader.current)
    }

    return function cleanup() {
      observer.disconnect();
    };

  }, []);

  useEffect(() => {
    // here we simulate adding new posts to List
    setVisiblePubs(publications.slice(0, page * 10))
    if (publications.length === visiblePubs.length) {
      setHideLoader({ display: "none" });
    } else {
      setHideLoader({ display: "block" });
    }
  }, [page, publications])

  // here we handle what happens when user scrolls to Load More div
  // in this case we just update page variable
  const handleObserver = (entities) => {
    const target = entities[0];
    console.log(visiblePubs.length)
    if (target.isIntersecting) {
      setPage((page) => page + 1)
    }
  }


  return (
    <>
      <section className="publications-container">
        {visiblePubs.map((p) => (
          <div
            key={p.id}
            className="publication"
          >
            <img
              alt="publication thumbnail"
              src={`https://picsum.photos/seed/${p._embedded.title.id}/200/150`}

            />

            <div>
              <span className="publication-project">
                {projectsMap.get(p._embedded.title.id).name}
              </span>
              <h4 className="publication-title">{p.name}</h4>
            </div>
          </div>
        ))}
      </section>
      <div className="loading" ref={loader} style={hideLoader}>
        <h5>Loading...</h5>
      </div>
    </>
  );
};

export default PublicationsList;