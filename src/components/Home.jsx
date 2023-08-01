
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";



function Searchbar(props){

    function takeSearchInput(e){
        props.setInput(e.target.value);
    }

    function search_func(){
        props.setSearch(props.input);
    }

    return (
    <>
    <input type="text" value={props.input} onChange={takeSearchInput}></input>
    <button onClick={search_func}> Search</button>
    </>)
}

function NavigationBar(props){
   
    
    function goToNext(){
        props.setPage(props.page+1);
    }

    function goToPrev(){
        props.setPage(props.page-1);
    }
    return(
    <>
    <button onClick={goToPrev}>Previous</button>
    <button onClick={goToNext}>Next</button>
    </>)
}



function FilterBar(props){

    function takeUserFilter(e){
        props.setFilter(e.target.value);
    }

    function filterByYear(){

        var filteredMovies=new Array(0);
        props.movies.map(function(item){

            //console.log(item.Year, props.filter);
            if(item.Year==props.filter){
                filteredMovies.push({...item, display:true});
            }
            else filteredMovies.push({...item, display:false});
        });

        props.setMovies(filteredMovies);
    }

    function cancel_filter(){
        
        var filteredMovies=new Array(0);
        props.movies.map(function(item){
            
            filteredMovies.push({...item, display:true});

        })
        props.setMovies(filteredMovies);
        props.setFilter("");
    }

    return (
        <>
            <input value={props.filter} onChange={takeUserFilter}></input>
            <button onClick={filterByYear}>Filter</button>
            <button onClick={cancel_filter}>Cancel</button>
        </>
    )
}


function List(props){

    const [movies, setMovies]= useState([]);  //this one only stores 10 movies that is for the current page
    const [movies_3pages, setMovies_3pages]= useState([]);   //this one stores objects that contain page number and corresponding movie arrays
    const [search, setSearch]= useState(["star_wars"]);
    const [input, setInput]=useState([""]);
    const [page, setPage]=useState(1);
    const [filter, setFilter]= useState("");

    
    async function getMovies()
    {
        //this if covers the cases for which we need to make an api call
        //that is if the cache is empty or if cache contains 3 pages of some other movie or if our required page is not their in current cache
        if(movies_3pages.length==0 || search!= movies_3pages[0].search || (movies_3pages[0].page!= page && movies_3pages[1].page!= page && movies_3pages[2].page!= page))
        {
            var apiUrls = [
                `https://www.omdbapi.com/?i=tt3896198&apikey=c34c97b2&s=${search}&page=${page}`,
                `https://www.omdbapi.com/?i=tt3896198&apikey=c34c97b2&s=${search}&page=${page+1}`,
                `https://www.omdbapi.com/?i=tt3896198&apikey=c34c97b2&s=${search}&page=${page+2}`,
              ];
    
            var apiResponses =await Promise.all(apiUrls.map(url => fetch(url)));
            var apiData = await Promise.all(apiResponses.map(response => response.json()));
            //above apidata is an array of 3 objects, 1 for each of the api responses

            setMovies(apiData[0].Search);   
            //console.log(apiData);

            var i=0;
            var x=new Array(0);
           
            setMovies_3pages([]); //see in this one we are making a new apicall, we need to make the current cache empty to make space fot the next batch of cache
           
            apiData.map(function(item)
            {
                var new_entry={
                    search: search, //search value for this particular cache
                    page: page+i,  //page number
                    movies_page: item.Search     //movies array for tht particular page
                }
                i++;

                //console.log(new_entry);
                x.push(new_entry);
    
            })
            
            setMovies_3pages(x);
            //console.log(movies_3pages);
        }


        //this else handles the cases when we dont need to make an api call, that is when our required search value and required page number is available in cache
        else 
        {
             if(page==movies_3pages[0].page){

                console.log("1st");
                setMovies(movies_3pages[0].movies_page)
             }

             else if(page==movies_3pages[1].page){
                console.log("2nd");
                setMovies(movies_3pages[1].movies_page)
             }
             else if(page==movies_3pages[2].page){

                console.log("3rd");
                setMovies(movies_3pages[2].movies_page)
             }

             else console.log("error");
        }


      
        
       // await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=c34c97b2&s=${search}&page=${page}`)
       // .then((response) => 
        // {
        // if (!response.ok) 
        // {
        //     throw new Error('Network response was not OK');
        // }
        // return response.json();
        // })
        // .then((data) => 
        // {
        //   setMovies(data.Search);
        // })
        // .catch(error => 
        // {
        // console.log('Error:', error.message);
        // });
        
       

        
    }
    
    useEffect(() => {

       getMovies();

    },[search, page]);

    useEffect(()=>{

            
        localStorage.setItem("movies_3pages", JSON.stringify(movies_3pages));
    }, [movies_3pages]);


    console.log(movies);


    function likemovie(movieItem, id){

      //means user has either liked for the first time or turned from unliking to liking
      if(movieItem.liked==null || movieItem.liked==false) 
      {
        movieItem.liked=true;
        props.setLikedmovies([...props.likedmovies, movieItem]); 
      }

      //means user is unliking it after liking it
      else 
      {
        movieItem.liked=false;
        var new_arr=[...props.likedmovies];
          for(var i=0;i<new_arr.length;i++)
          {
             if(new_arr[i].imdbID==id)
             {
                new_arr.splice(i,1);
             }
          }

          props.setLikedmovies(new_arr);
      }

    }

    useEffect(()=>{

        localStorage.setItem("likedmovies", JSON.stringify(props.likedmovies));

    },[props.likedmovies])


    return (<>

    <h2>Movie List</h2>

    <Searchbar input={input} setInput={setInput} search={search} setSearch={setSearch}/>
    <NavigationBar page={page} setPage={setPage}/>
    <FilterBar filter={filter} setFilter={setFilter} movies={movies} setMovies={setMovies}/>

    <button>
        <Link to={`/likes`}>View Liked Movies</Link>
    </button>
    <ul>

    {movies.map(function(item)
    {
      {if(item.display==null || item.display==true)
      return (
        <>
            <li>
            <Link to= {`/movie/${item.imdbID}`}>{item.Title}</Link>
            <button onClick={()=>{likemovie(item, item.imdbID)}}>Like</button>
            </li>

        </>)}
    })}
    </ul>
    </>)
}

export default List;