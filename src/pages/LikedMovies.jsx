
import LikedMoviesList from "../components/LikedMoviesList";


function LikedMovies(props){
    return (
        <>
            <LikedMoviesList likedmovies={props.likedmovies}/>
        </>
    )
}


export default LikedMovies;