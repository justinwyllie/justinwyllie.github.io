import React from "react";

const Loading = () =>
{
    return(<div>loading...</div>)
}




const CapitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



export 
{
    Loading,
    CapitalizeFirstLetter
}
