import { Link } from "react-router-dom";

function LikedMoviesList(props){
    //console.log(props.likedmovies);

    return (
        <>
        <h2>Liked Movies</h2>
            {props.likedmovies.map(function(item)
            {
            return(
                    <>
                        <li>
                        <Link to={`/movie/${item.imdbID}`}>{item.Title}</Link>
                        </li>
                    </>
                )
            })}
        </>
    )
    
}

export default LikedMoviesList;