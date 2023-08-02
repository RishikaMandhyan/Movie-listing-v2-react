import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import ContentEditable from "react-contenteditable";   //this one helps to make our html element editable


function EditMovie(){

const location= useLocation();
const id= location.pathname.split("/")[2];   // to get the id of the movie tht we wanna edit
 
const [movieItem, setmovieItem]= useState([]);   //stores the movie shown on the screen and after we edit then also it shows the updated value

var temp= JSON.parse(localStorage.getItem("editedMovies"));  
if(temp== null) temp=new Array(0);

//in local storage we have stored an array of all movies we have edited and once we have edited this one, it also needs to this array called editedItem
const [editedItem, setEditedItem]= useState(temp);
var title, year, actors, awards, genre, foundInLocal=false;

useEffect(() => {

    getmovieItemfromLocal();
    getmovieItem();
 
 },[]);   //when we have a single empty array in the dependency part of useeffect, 
 //it means tht the function writtten inside it will be executed only once only every time this particular page/component is rendered

useEffect(()=>{

//console.log("stored in local");
localStorage.setItem("editedMovies", JSON.stringify(editedItem));
getmovieItemfromLocal();
getmovieItem();

 },[editedItem]);



//this function checks if the item we are looking for is present in the editedItem array in the local storage or not
function getmovieItemfromLocal(){

var temp2= JSON.parse(localStorage.getItem("editedMovies"));
console.log("local was called");
    if(temp2!=null)  
    {
        temp2.map(function(item)
        {
            if(item.imdbID==id)
            {
                // console.log("found from local");
                setmovieItem(item);
                foundInLocal=true;     //this is used for the logic tht if we find our movie in local storage then we dont need to call the api          
            }
        })
    }
}

//this function asks for movie from api after its not present in the local storage
async function getmovieItem()
{
  //console.log("api was called");

    if(!foundInLocal)
    {
        console.log(movieItem.length);
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
            setmovieItem(data);
            //console.log("found from api, ");
        })
        .catch(error => 
        {
            console.log('Error:', error.message);
        });
    }
}


//the below functions manage change in the movie details
function handleTitleChange(e){

    title=e.target.value;

}
function handleYearChange(e){

    year=e.target.value;

}
function handleActorsChange(e){

    actors=e.target.value;

}
function handleAwardsChange(e){

    awards=e.target.value;

}
function handleGenreChange(e){

    genre=e.target.value;

}


//this function is called when submit button is clicked
//there are two possibilities
//possibility1: the movie we edited was alredy present in the edited array in local storage in tht case we need to capture tht movie, remove it from the array and push the updated movie
//possibility2: the movie wasnt previously present in the array so we need to just push this particular movie
function saveChanges()
{
    //making the updated movie object
    var y={...movieItem, Title: title? title: movieItem.Title, Year: year? year: movieItem.Year, Awards: awards? awards:movieItem.Awards, 
        Actors: actors? actors: movieItem.Actors, Genre: genre? genre: movieItem.Genre};

    var found=false;

    //possibility 1
    for(var i=0;i<editedItem.length;i++){
        if(editedItem[i].imdbID==movieItem.imdbID){
            found=true;
            var copy=[...editedItem.splice(0,i), ...editedItem.splice(i+1)];
           setEditedItem([...copy,y]);
        }
    }

    //possibility 2
    if(!found){
        setEditedItem([...editedItem, y]);
    }
}


return (<>

        <img src={movieItem.Poster}></img>
        <br/>
        <p>Title: <ContentEditable
                    html={`${movieItem.Title}`} // innerHTML of the editable div
                    disabled={false}      // use true to disable editing
                    onChange={(e)=>{handleTitleChange(e)}} // handle innerHTML change
                    tagName='span'    //specifies the tag to enclose the above html content, its div by default if we dont specify it
                    /></p>

        <p>Year: <ContentEditable
                    html={`${movieItem.Year}`} 
                    disabled={false}     
                    onChange={(e)=>{handleYearChange(e)}} 
                    tagName='span'
                    /></p>

        <p>Actors: <ContentEditable
                    html={`${movieItem.Actors}`}
                    disabled={false}   
                    onChange={(e)=>{handleActorsChange(e)}}
                    tagName='span'
                    /></p>

        <p>Awards: <ContentEditable
                    html={`${movieItem.Awards}`}
                    disabled={false}   
                    onChange={(e)=>{handleAwardsChange(e)}}
                    tagName='span'
                    /></p>
                    
        <p>Genre: <ContentEditable
                    html={`${movieItem.Genre}`}
                    disabled={false}   
                    onChange={(e)=>{handleGenreChange(e)}}
                    tagName='span' 
                    /></p>

        <button onClick={saveChanges}>Save</button>
</>)

}


export default EditMovie;