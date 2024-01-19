import { GapFillExercise } from './gapfill';
import { MultipleChoiceExercise } from './multiplechoice';
import React, { useState, useEffect } from "react";
import {  DOMAIN, MODE, JSONPATH } from "../Constants";
import { ErrorMessageDisplay } from "./components";
import { Base64 } from 'base64-string';
import { Loading } from './shared-components';




const ExerciseContainer = () => {

    const [getJson, setGetJson] = useState(false);
   
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [exercise, setExercise] = useState(undefined);
    const [exerciseType, setExerciseType] = useState(undefined);
    const [slug, setSlug]  = useState('');
    const [exKey, setExKey]  = useState(null);

    let bits;
    useEffect(() => {
        

        const path = window.location.pathname;
        bits = path.split('/');
       


        /*
            3 sites to support
            in each case, lets get the JSON to keep things simple
            the problem is: on repi the url contains the slug and postId and key which is need for the node endpoint
            so we get it from the node endpoint

            but on kea we only have the slug. and we don't want to make a cross-domain request so we have to get it 
                from the custom endpoint or the default post endpoint via slug. 
                for now we get it from the default endpoint via slug NO - too many problems inc. that we don't have grammar terms on the XML/converted JSON
                        but we do on the special table json

  
            DO this: the alternative is to call a new custom endpoint which gets it from the slug probably by doing an extra lookup
                    to get the postId for the slug OR by putting the slugs into the special table. - this latter would be the fastest TODO

            github urls cyrrently have the same structure as repi only with params: q=slug2&postId=307&key=2709469327
            and currently get json from kea custom endpoint which in fact uses only the postId. 

        */
        let url;
        let request;
        if (DOMAIN == "onlinerepititor.ru")
        {
            if (bits.length > 3)
            {
                setGetJson(true);
                setSlug(bits[1]);
                setExKey(bits[3]);
                //this is to the node app on repi? 2 is postId
                //the ex. returned has mode withkey or withoutkey
                url = '//' + JSONPATH + '/json/' + bits[1] + "/" +  bits[2] + "/" + bits[3];
                request = {
                    method: "GET"
                }
            }
           
        }
        else if (DOMAIN.match(/kazanenglish/gi) !== null)
        {
            //register_rest_route( 'kea_activities/v1', '/json_post/(?P<post_id>\d+)/(?P<key>\d+)', array( is custom endpoint gets json from spec table
            setSlug(bits[4]);
            url = '//' + JSONPATH + '/wp-json/kea_activities/v1/json_post2/' + bits[4];
            //so - the ex returned does not have mode on it? and does not have a key (as in id not answer key!) as this was never in the url/part of the story on kea
            //do we add mode=withkey here so that in gapfill the right buttons are displayed? how come they are displayed right now? or in WP endpoint?
            request = {
                method: "GET"
            }
           
           
        }
        else //will be gitbub and url will be query string
        {

            
       
            const enc = new Base64();
            let headers;
            headers = new Headers(); //browser api?
            headers.set('Authorization', 'Basic ' + enc.encode('dev' + ":" + 'hjgyt65$!H')); 
            
            //preflight does not send creds so need to fix server not to require creds for OPTIONS 
            //did this use an If - request check to only check for creds if not options
        
            headers.set('Content-Type', 'application/json; charset=UTF-8');
            //headers.set('X-Requested-With', 'XMLHttpRequest');

            console.log("headers", headers);
            request = {
                method: "GET",
                headers: headers
            }

            // e.g. https://justinwyllie.github.io/?q=modals-in-the-past-2&postId=3937&key=2103456251
            const query = window.location.search;
            console.log("d1", query);
            const urlParams = new window.URLSearchParams(query);
            console.log("d2", urlParams);
            const q = urlParams.get('q');
            setSlug(q);
            const key = urlParams.get('key');
            setExKey(key);
            const postId = urlParams.get('postId');

          
            setExKey(bits[3]);
            url =  'https://' + JSONPATH + '/wp-json/kea_activities/v1/json_post/' + postId + "/" +  key;
        }

        console.log("url", DOMAIN, JSONPATH, url);


        fetch(url, request).then(response => {
            if (response.ok)
            {
                return response.json();
            }
            
            throw new Error();
            
        })
        .then(data =>  
                {
                    console.log("data", data);
                    
                    if ( data.success )
                    {  

                        setExercise(data);
                        setExerciseType(data.activity_type);
                    }
                    else
                    {
                        throw new Error(data.message);//TODO message?
                    }
                    
                }    
        ).catch(function (error) {
            setError(true);
            setErrorMessage(error.message);
        });


    }, []);

 

    let activityComponent;
    if (exerciseType == "gapfill")
    {
        activityComponent = <GapFillExercise  exKey={exKey} slug={slug} exercise={exercise} /> ;
    }
    else
    {
        activityComponent = <MultipleChoiceExercise  exKey={exKey} slug={slug} exercise={exercise} /> 
    }

    return(
            error ? <ErrorMessageDisplay message={errorMessage} /> :  (exercise && exerciseType) ? activityComponent : <Loading />
        );


}

export {

    ExerciseContainer
}