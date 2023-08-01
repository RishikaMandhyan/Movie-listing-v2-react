import { BrowserRouter as Router, Routes, Route,} from "react-router-dom";
import { useState } from "react";
import List from "./components/Home";
import LikedMovies from "./pages/LikedMovies";
import MovieItem from "./components/MovieItem";



function App()
{

  var x=JSON.parse(localStorage.getItem("likedmovies"));
  if(x==null) x=new Array(0);
  const [likedmovies, setLikedmovies]=useState(x);


return (<>
 
    <Router>
        <Routes>
                <Route path="/" element={<List likedmovies={likedmovies} setLikedmovies={setLikedmovies}/>}></Route>
                <Route path="/movie/:id" element={<MovieItem/>}></Route>
                <Route path="/likes" element={<LikedMovies likedmovies={likedmovies}/>}></Route>
        </Routes>
    </Router>
    </>
)
}

export default App;