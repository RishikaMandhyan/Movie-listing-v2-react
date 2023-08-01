import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom"



function MovieItem(){

    const location= useLocation();
    const id= location.pathname.split("/")[2];
    //console.log(id);

    const [movieItem, setMovieItem]= useState([]);

    async function getMovieItem()
    {
        await fetch(`https://www.omdbapi.com/?i=${id}&apikey=c34c97b2`)
        .then((response) => 
        {
        if (!response.ok) 
        {
            throw new Error('Network response was not OK');
        }
        return response.json();
        })
        .then((data) => 
        {
        setMovieItem(data);
        //console.log(data);
        })
        .catch(error => 
        {
        console.log('Error:', error.message);
        });
    }
    
    useEffect(() => {

       getMovieItem();

    },[]);


    return (<>

    <img src={movieItem.Poster}></img>
    <p>{movieItem.Title}</p>
    <p>{movieItem.Year}</p>
    <p>{movieItem.Actors}</p>
    <p>{movieItem.Awards}</p>
    <p>{movieItem.Genre}</p>

    </>)
}


export default MovieItem;