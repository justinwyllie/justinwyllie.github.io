import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import * as jose from "jose";
window.decodeJwt = jose.decodeJwt;

import {  LABELS, MODE } from "./Constants";
import ErrorMessageDisplay from "./Components/Components";
//import { CapitalizeFirstLetter } from "./helpers";
import reactStringReplace from './Utilities/react-string-replace-with-index';
import {  Check, X, Plus, Dash} from 'react-bootstrap-icons';
import { Base64 } from 'base64-string';

const DOMAIN = "dev.kazanenglishacademy.com";

/*
for github - use our reportResult
in Data - change the link to get the data from "dev.kazanenglishacademy.com"; and params from query string
remove this line from Data headers.set('X-Requested-With', 'XMLHttpRequest');
*/

const Loading = () =>
{
    return(<div>loading...</div>)
}

const CapitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const App = () => {

    return <>
        <Data />
    </>

}

const Data = () => {

   
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [exercise, setExercise] = useState(undefined);
    const [slug, setSlug]  = useState('');
    const [exKey, setExKey]  = useState('');

    let bits;
    useEffect(() => {
        let headers;
        if (MODE == 'dev')
        {
            const enc = new Base64();
            headers = new Headers(); //browser api?
            headers.set('Authorization', 'Basic ' + enc.encode('dev' + ":" + 'hjgyt65$!H')); 
            
            //preflight does not send creds so need to fix server not to require creds for OPTIONS 
            //did this use an If - request check to only check for creds if not options
        }
        headers.set('Content-Type', 'application/json; charset=UTF-8');
        //headers.set('X-Requested-With', 'XMLHttpRequest');

        const query = window.location.search;
        const urlParams = new URLSearchParams(query);
        const postId = urlParams.get('postId');
        const key = urlParams.get('key');

        //https://justinwyllie.github.io/?q=past-simple-v-present-perfect-v-present-perfect-continuous&postId=2796&key=200408289 
        //CHANGE FOR GITHUB wp-json/kea_activities/v1/json_post/2750/1784148523   
        fetch('https://' + DOMAIN + '/wp-json/kea_activities/v1/json_post/' + postId + "/" +  key,
        {
            method:'GET',
            headers: headers
            
        })
        .then(response => {
            if (response.ok)
            {
                return response.json();
            }
            
            throw new Error();
            
        })
        .then(data =>  
                {
                    //TODO here work out exercise type. 
                    if (data.success)
                    {  
                        setExercise(data);
                    }
                    else
                    {
                        throw new Error(data.message);
                    }
                    
                }    
        ).catch(function (error) {
            setError(true);
            setErrorMessage(error.message);
        });


    }, []);

    return(
            error ? <ErrorMessageDisplay message={errorMessage} /> :  exercise ? <GapFillExercise  exKey={exKey} slug={slug} exercise={exercise} /> : <Loading />
        );


}

/* TODO
bring all comps into this file, delete all modules and then reexport

 import vle gap fill and pass it props 
 obtain the needed props by a fetch call in a wrapper so they are up to date
 this app should just wrap gapfill
  get the slug dynamically 
  email the results! (this is one reason to integrate it into the schools google domain.. 
    or they have to sign in with google?)
*/


const StopHacking = () =>
{
    return (<div class="alert alert-danger" role="alert">
        Stop hacking my site!
  </div>)
}


const GapFillExercise = (props) =>
{
    
    //const [exercise, setExercise] = useState(undefined);
    const [questionAnswerSets, setQuestionAnswerSets] = useState(undefined);
    const [grammarTags, setGrammarTags] = useState([]);
    const [error, setError] = useState(false);
    const [checkButtonActive, setCheckButtonActive] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmMessage, setConfirmMessage] = useState(undefined);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [hacker, setHacker] = useState(false);
   
    const userLang = 'en';
    const loc = window.location;
    const [fieldState, setFieldState] = useState("is-valid");
  
    const direct = DIRECT;
    //const [exercise, setExercise] = useState(props.exercise ? props.exercise : undefined);
    

    
/** SECTION FOR JS LOGIN - FIX UP */

    
if (window.specialReactHook == undefined)
{
    
    window.specialReactHook = function(userData)
    {
        setUserName(userData.name);
        setUserEmail(userData.email);
    }
}

window.signin();



    const produceQASets = (exercise) =>
    {
        
        let qLength;
        let qaPairs = {};
      
        exercise.questions.forEach((question, idx) => {
            
            let answer = question.answer.replace(/\|$/, '');
        
            const correctAnswers = answer.split('|');
            
            qLength = correctAnswers.length;
           
            var userAnswers = new Array();
            for (let i = 0; i < qLength; i++)
            {
                userAnswers.push('');
            }
            
           
            qaPairs[question.questionNumber] = {
                questionNumber: question.questionNumber,
                question: question.question,
                userAnswers:  userAnswers,
                correctAnswers: correctAnswers,
                status: "unmarked",
                length: qLength
            }
            
        })
 
        setQuestionAnswerSets(qaPairs);
       
    }
    
    const getUnLinkedCopy = (obj) =>
    {
        return structuredClone(obj);
    }

    const feedback = (results) =>
    {
        
        console.log("results", results, userLang);
        
      

        let message = "";
        if (results.scorePercent >= 90)
        {
            message = CapitalizeFirstLetter(LABELS[userLang]['congratulations']['infinitive']);
        }
        else if (results.scorePercent > 65)
        {
            message = CapitalizeFirstLetter(LABELS[userLang]['welldone']['infinitive']);
        }
        else
        {
            message = CapitalizeFirstLetter(LABELS[userLang]['keeptrying']['infinitive']);
        }

        message = CapitalizeFirstLetter(LABELS[userLang]['youscored']['infinitive']) + ": " + results.scorePercent +
            CapitalizeFirstLetter(LABELS[userLang]['percentsign']['nominative']) + ". " + message + ".";

        setConfirmMessage(message);
    }

    //CHNAGE FOR GITHUB - we use our own reportResult
    const reportResult = (score, errors) =>
    {
       
        fetch('https://online.kazanenglishacademy.com/ajax-handler.php',
        {
            method:'POST',
            body: JSON.stringify({score: score, slug: slug, name: userName, 
                    email: userEmail, direct: direct, errors: errors})
            
        })
            .then(response => response.json())
            .then(data => 
                {
                    setConfirmMessage(CapitalizeFirstLetter(LABELS[userLang]['results_sent']['nominative']))
                });

    }

    const check = () =>
    {
        if (userName == "")
        {
            setFieldState("is-invalid");
            return;
        }
        /*
        * if mode is without key what is different?
        * we cannot calculate a score or produce a list of errors
        * nothing should be marked as incorrect or correct
        *
        */
        const mode = props.exercise.mode;
        
        let scorePoss = 0;
        let scoreMistakes = 0;
        let errors = [];

        if ((typeof questionAnswerSets != "undefined") && 
        (Object.keys(questionAnswerSets).length >= 1) ) {
             
                
            let newQuestionAnswerSets;
            if (mode == "withkey")
            {
                newQuestionAnswerSets = getUnLinkedCopy(questionAnswerSets);
                for (const qNumber in newQuestionAnswerSets)
                {
                    newQuestionAnswerSets[qNumber].status = "correct";
                    newQuestionAnswerSets[qNumber].correctAnswers.forEach( (answer, idx) => {
                        scorePoss++;
                        const answerVariations = answer.split(":");
                        if (!answerVariations.includes(newQuestionAnswerSets[qNumber].userAnswers[idx]))
                        {
                            newQuestionAnswerSets[qNumber].status = "incorrect";  
                            scoreMistakes++;  
                        }
                    });
                    if (newQuestionAnswerSets[qNumber].status == "incorrect")
                    {
                        errors.push(qNumber);
                    }
                }
                //for info - rather than wiping it you can modify parts of it:
                //https://bobbyhadz.com/blog/react-update-nested-state-object-property
                setQuestionAnswerSets( 
                    newQuestionAnswerSets
                );
            }   
            

            let questionsAndStudentAnswers;
            let score;
            if (newQuestionAnswerSets == undefined)
            {
                questionsAndStudentAnswers = questionAnswerSets;
                score = null;
            }
            else
            {
                questionsAndStudentAnswers = newQuestionAnswerSets;
                score = (scorePoss - scoreMistakes)  + " out of " +  scorePoss; //TODO out of 
            }
            

            
            let results = {
                scorePercent: Math.round(((scorePoss - scoreMistakes)  / scorePoss * 100)),
                score: score,
                errors: errors,
                questionsAndStudentAnswers: questionsAndStudentAnswers
            }
            if (mode == "withoutKey")
            {
                reportResult(results); 
                

            }
            else
            {
                feedback(results);
            }
    }
    }

  
    const submitAnswers = () =>
    {
        
        check();
    
    }
  

    const showCorrectAnswers = () =>
    {
        
        if ( (typeof questionAnswerSets != "undefined")  && 
        (Object.keys(questionAnswerSets).length >= 1)  ) {

                let newQuestionAnswerSets = getUnLinkedCopy(questionAnswerSets);

                for (const qNumber in newQuestionAnswerSets)
                {
                    newQuestionAnswerSets[qNumber].status = "showCorrect";
                }

                setQuestionAnswerSets( 
                        newQuestionAnswerSets
                );
                setCheckButtonActive(false);
        }
             
    }

    const resetExercise = () =>
    {
        if ( (typeof questionAnswerSets != "undefined") && 
             (Object.keys(questionAnswerSets).length >= 1) ) {

                let newQuestionAnswerSets = getUnLinkedCopy(questionAnswerSets);

                
                for (const qNumber in newQuestionAnswerSets)
                {
                    newQuestionAnswerSets[qNumber].status = "unmarked";
                    newQuestionAnswerSets[qNumber].userAnswers.forEach( (answer, idx) => {
                        newQuestionAnswerSets[qNumber].userAnswers[idx] = "";
                    })
                }
                setQuestionAnswerSets( 
                        newQuestionAnswerSets
                );
                setCheckButtonActive(true);
                setConfirmMessage(undefined);
        }
    }

    const setUserNameWrapper = (name) =>
    {

        if (name.length > 30)
        {
            setHacker(true);
            name = name.substr(0, 30);
        }
        else
        {
            setHacker(false);
        }

        if (name != '')
        {
            setFieldState("is-valid");
        }
        setUserName(name);
    }

    const handleChange = (e, questionNumber, fieldNumber) =>
    {
        
       
       /* this is the old version which replaces the object completely 
       
        let newQuestionAnswerSets = getUnLinkedCopy(questionAnswerSets);
        newQuestionAnswerSets[questionNumber].userAnswers[fieldNumber] = e.currentTarget.value;
        setQuestionAnswerSets( 
                newQuestionAnswerSets
        );
            */ 
        
           
        /* TODO - the main problem is a chnage to any question causes all questions to be rerendered.
            how to solve this?
            

             https://alexsidorenko.com/blog/react-update-nested-state/ interesting? 

             for ref: 
             qaPairs[question.questionNumber] = {
                questionNumber: question.questionNumber,
                question: question.question,
                userAnswers:  userAnswers,
                correctAnswers: correctAnswers,
                status: "unmarked",
                length: qLength
            }

            this is an attempt, not working, to do the array update in place
            https://stackoverflow.com/questions/76756681/react-how-to-update-a-nested-object-when-the-keys-are-variables
             
            userAnswers : [...prevState[questionNumber].userAnswers.slice(0, fieldNumber), e.currentTarget.value, 
                    ...prevState[questionNumber].userAnswers.slice(fieldNumber + 1, 
                        prevState[questionNumber].userAnswers.length)]
                }
             */

    
        let newUserAnswers = questionAnswerSets[questionNumber].userAnswers.map( (val, idx) => {
            if (idx == fieldNumber) 
            {
                return e.currentTarget.value;
            }
            else
            {
                return val;
            }
        });
   

        /* this actually works - see SO post. But I prefer the readability of the map
        let newVal = e.currentTarget.value;
        [...prevState[questionNumber].userAnswers.slice(0, fieldNumber), newVal, 
                    ...prevState[questionNumber].userAnswers.slice(fieldNumber + 1, 
                        prevState[questionNumber].userAnswers.length)]
                
        */
        

        setQuestionAnswerSets((prevState) => { 
                return {...prevState,
                    [questionNumber] : {
                    ...prevState[questionNumber],
                    userAnswers : newUserAnswers
                    }
                }
       });
       
           
        

    }

    

    useEffect(() => {

        setGrammarTags(props.exercise.labels); //TDDO - test empty array case
        produceQASets(props.exercise);
       
        
        
    },[props.exercise]);   


    
    let questions;
    const exercise = props.exercise;

   
    if ((typeof questionAnswerSets != "undefined") && 
    (Object.keys(questionAnswerSets).length >= 1)  )
    {
            let questionsIterable = Object.keys(questionAnswerSets);
            
            questions = questionsIterable.map((question) => {
                return <Question question={questionAnswerSets[question]}  
                    key={question} 
                    handleChange={handleChange} /> 
        });
    }

    let buttons = <Buttons check={check} checkButtonActive={checkButtonActive}
        resetExercise={resetExercise} showCorrectAnswers={showCorrectAnswers} 
        userLang={userLang}
        mode={exercise.mode}
        submitAnswers={submitAnswers}></Buttons>;

    let message = '';
    if (hacker)
    {
        message = <StopHacking />
    }
    let confirmMessageDisplay = '';
    if (confirmMessage != undefined)
    {
        confirmMessageDisplay = <ConfirmMessageDisplay message={confirmMessage} />
    }


    

    return (
        error ? <ErrorMessageDisplay message={errorMessage} /> 
        : <div >
            <h1 className="text-center">{exercise ?  exercise.title : ''}</h1>

             {message}  
             {confirmMessageDisplay} 
             
            
            <div className="mt-3 mb-3 input-group has-validation">
            <label htmlFor="userName" className="form-label me-2">Name  </label> 
            <input id="userName" maxLength="30"  className={fieldState} value={userName} onChange={(e) =>
                       setUserNameWrapper(e.currentTarget.value)}   />
                <div className="invalid-feedback">
                    Please enter your name
                </div>
            </div>
            

            <div >
                <div>
                    {/* TODO langs from constants/deployment config - nb also used in language-blocks */}
                    {<Instructions models={exercise ? exercise.models  : undefined}
                        explanation={exercise ? exercise.explanation  : undefined}
                        instructions={exercise ? exercise.instructions  : undefined} langs={['ru', 'en']} 
                        userLang={userLang}  />}
                </div>
                
                <div className="mt-3">
                    <h4>
                        {CapitalizeFirstLetter(LABELS[userLang]['questions']['nominative'])}:
                    </h4>
                    <div>
                        {questions}
                    </div>
                    <div>
                        {buttons}
                    </div>
                     
                </div>
            </div>  
      
            <div className="grammar-tags mt-3 pb-3">{grammarTags.map( (tag, idx) => 
                <span className="badge rounded-pill bg-info text-dark" key={idx}>{tag}</span>
            )}</div>
            
        </div>
    )

}

const Buttons = (props) =>
{
  
    const {userLang, check, showCorrectAnswers, resetExercise, checkButtonActive, mode, submitAnswers} = props;

    let opts = {};
    if (checkButtonActive == false)
    {
        opts['disabled'] = 'disabled';
    }

    return (
        <div className="mt-3">
            {mode == 'withkey' ?
                <Button variant="primary" className="me-3" onClick={check} {...opts}>
                    {CapitalizeFirstLetter(LABELS[userLang]['check']['infinitive'])}
                </Button> : ''
            }

            {mode == 'withkey' ?
                <Button variant="primary" className="me-3" onClick={showCorrectAnswers}>
                {CapitalizeFirstLetter(LABELS[userLang]['showCorrectAnswers']['infinitive'])}
                </Button> : ''
            }

            {mode == 'withoutkey' ?
                <Button variant="primary" className="me-3" onClick={submitAnswers}>
                {CapitalizeFirstLetter(LABELS[userLang]['submitformarking']['infinitive'])}
                </Button> : ''
            }

            <Button variant="primary" onClick={resetExercise}>
                        {CapitalizeFirstLetter(LABELS[userLang]['reset']['infinitive'])}
            </Button>
        </div>
    )
}

const Question = (props) =>
{
    
    const {question, handleChange} = props;
    console.log("propts", question);
    

    const getField = (question) =>
    {
        let html;
        if (question.status == "showCorrect")
        {
            html = reactStringReplace(question.question, /(___)/g, (match, i) => 
            {
                const answerVariants = question.correctAnswers[i].split(":");
                return <span key={i} className="correct-answer">{answerVariants[0]}</span>
            })
        }
        else
        {
            
            html = reactStringReplace(question.question, /(___)/g, (match, i) => 
            {console.log("question", question.userAnswers[i], i);
                return <input value={question.userAnswers[i]}  key={i} onChange={(e) =>
                        handleChange(e, question.questionNumber, i)}   />
            })
        }
        
        return html;
    }
    
    

    let feedback;
    
    if (question.status == "correct")
    {
        feedback = <Check color="green" size={24} />;
    }
    else if (question.status == "incorrect")
    {
        feedback = <X color="red" size={24} />;
    }
    else
    {
        feedback = <span></span>;
    }

    /*
    let html = reactStringReplace(question.question, /(___)/g, (match, i) => 
    {
        return <input  value={question.userAnswers[i]}  key={i} 
        onChange={(e) => handleChange(e, question.questionNumber, i)}   />
    });
    */

    return (
        <div className="exercise-question unmarked mt-3">
            {question.questionNumber}.<span> </span>
            {
                getField(question)
            }
            {feedback}
             
        </div>
    )
}


/*
    @param (array) langs all langs which user has access to 
    @param (string) activeLang user's current choice of site lang. 
        TODO ultimately get this from store and update on change
*/
const Instructions = (props) =>
{
    /* userLang is the global site wide current choice? 
        langs is coded above but will be total available site langs? 
        the supported langs for site must match those for each ex. curr. en and ru. 
    */
    const {instructions, langs, userLang, models, explanation} = props;
    const [showModels, setShowModels] = useState(true);
    const [showExplanation, setShowExplanation] = useState(false);

    let availableLangsWithFlag = [];
    langs.forEach(lang => {
        let langObj = {
            lang: lang,
            active: false
        }
        if (lang == userLang)
        {
            langObj.active = true;
        }
        availableLangsWithFlag.push(langObj);

    });

    const [activeUserLang, setActiveUserLang] = useState(userLang);
    const [availableLangs, setAvailableLangs] = useState(availableLangsWithFlag);

    const flags = availableLangs.map(function(langObj, i) {
        let flagLang;
        if (langObj.lang == "en")
        {
            flagLang = "gb" ;
        }
        else
        {
            flagLang = langObj.lang;   
        }
        return <span key={i}>
            <span  onClick={() => setActiveLang(langObj.lang)} 
                className={langObj.active ? `pointer selected-lang me-1 fp ${flagLang} ` 
                    : `pointer me-1 fp ${flagLang} `}>
                
            </span>
            
            </span>
        
    });

    const setActiveLang = (lang) =>
    {
        let availableLangsCopy = [...availableLangs];
        availableLangsCopy.forEach(langObj => {
            if (langObj.lang == lang)
            {
                langObj.active = true;
            }
            else
            {
                langObj.active = false;    
            }
        });
        setActiveUserLang(lang);
        setAvailableLangs(availableLangsCopy);
    }

   

    let modelsText = {__html: ''};
  
    if (models != undefined && models != "")
    {
        modelsText.__html = models;
    }

    let explanationText = {__html: ''};
  
    let explanationBlock = '';
    if (explanation != undefined && explanation != "")
    {
        explanationText.__html = explanation;
        explanationBlock = 
        <div className="mt-3">
            <h4 className=" d-inline">
                    {CapitalizeFirstLetter(LABELS[userLang]['explanation']['nominative'])}
                
            </h4>

            {showExplanation 
                ? <Dash  size={36} className="pointer symbols mt-n2" onClick={() => setShowExplanation(false)}/>
                : <Plus  size={36} className="pointer symbols mt-n2" onClick={() => setShowExplanation(true)} />
            }
            
            {showExplanation && 
                <p dangerouslySetInnerHTML={explanationText}></p>
            }
        </div>
    }

    
    

    return (
        <>
            <h4>
                {CapitalizeFirstLetter(LABELS[userLang]['instructions']['nominative'])}:
            </h4>
            <div>
                {flags}
            </div>
            
            <div>
                {instructions ? instructions[activeUserLang] : ''}
            </div>
            <div className="mt-3">
                <h4 className=" d-inline">
                    {CapitalizeFirstLetter(LABELS[userLang]['models']['nominative'])}
                
                </h4>

                {showModels 
                    ? <Dash  size={36} className="pointer symbols mt-n2" onClick={() => setShowModels(false)}/>
                    : <Plus  size={36} className="pointer symbols mt-n2" onClick={() => setShowModels(true)} />
                }
                
                {showModels && 
                    <p dangerouslySetInnerHTML={modelsText}></p>
                }

                {explanationBlock}

            </div>
        </>
    )

}





export {
    App,
    GapFillExercise
}