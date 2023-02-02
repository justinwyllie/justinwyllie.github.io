import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import * as jose from "jose";
window.decodeJwt = jose.decodeJwt;

import {  LABELS } from "./Constants";
import ErrorMessageDisplay from "./Components/Components";
//import { CapitalizeFirstLetter } from "./helpers";
import reactStringReplace from './Utilities/react-string-replace-with-index';
import {  Check, X, Plus, Dash} from 'react-bootstrap-icons';
import { Base64 } from 'base64-string';

const DOMAIN = "dev.kazanenglishacademy.com";

const CapitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const App = () => {

    return <>
        <Data></Data>
    </>

}

const Data = () => {

    const [grammarTerms, setGrammarTerms] = useState(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        //TODO - we have a problem when we have > 100 
        const enc = new Base64();
        let headers = new Headers(); //browser api?
        headers.set('Authorization', 'Basic ' + enc.encode('dev' + ":" + 'hjgyt65$!H')); 
        //preflight does not send creds so need to fix server not to require creds for OPTIONS 
        //did this use an If - request check to only check for creds if not options
        fetch('https://' + DOMAIN + '/wp-json/wp/v2/grammar_terms?per_page=100',
        {
            method:'GET',
            headers: headers
            
        })
        .then(response => response.json())
        .then(data =>  
                {
                    const grammarTermsKeyed = {};
                    data.forEach((term) => {
                        grammarTermsKeyed[term.id] = {description: term.description, 
                            count: term.count, 
                            slug: term.slug};
                    });
                    setGrammarTerms(grammarTermsKeyed);
                }    
        ).catch(function (error) {
            setError(true);
            setErrorMessage(error.message);
        });


    }, []);

    return(
        
        error
            ? <ErrorMessageDisplay message={errorMessage} />
            : <GapFillExercise grammarTermsKeyed={grammarTerms} />
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






const GapFillExercise = (props) =>
{
    
    const [exercise, setExercise] = useState(undefined);
    const [meta, setMeta] = useState(undefined);
    const [questionAnswerSets, setQuestionAnswerSets] = useState(undefined);
    const [grammarTags, setGrammarTags] = useState([]);
    const [error, setError] = useState(false);
    const [checkButtonActive, setCheckButtonActive] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const userLang = 'en';
    const loc = window.location;
    const urlParams = new URLSearchParams(loc.search);
    const slug = urlParams.get("q");
    const direct = urlParams.get("d");
    const [fieldState, setFieldState] = useState("is-valid");
    

    //load in page fires AFTER this script is parsed
    //so this func. should be available when the page obtains user data from cookie or google login callback
    
    if (window.specialReactHook == undefined)
    {
        console.log("defining srh");
        window.specialReactHook = function(userData)
        {
            console.log("srh in react", userData);
            setUserName(userData.name);
            setUserEmail(userData.email);
        }
    }

    const grammarTermsKeyed = props.grammarTermsKeyed;
    
    const getUnLinkedCopy = (obj) =>
    {
        return structuredClone(obj);
    }

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
                    console.log("result", data)
                });

    }

    const check = () =>
    {
        if (userName == "")
        {
            setFieldState("is-invalid");
            return;
        }
        
        let scorePoss = 0;
        let scoreMistakes = 0;
        let errors = [];

        if ((typeof questionAnswerSets != "undefined") && 
        (Object.keys(questionAnswerSets).length >= 1) ) {
             
                let newQuestionAnswerSets = getUnLinkedCopy(questionAnswerSets);
               
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
                console.log("newQuestionAnswerSets2", newQuestionAnswerSets);
                //for info - rather than wiping it you can modify parts of it:
                //https://bobbyhadz.com/blog/react-update-nested-state-object-property
                setQuestionAnswerSets( 
                        newQuestionAnswerSets
                );
                let scorePositive = scorePoss - scoreMistakes;
                reportResult((scorePositive + "-" + scorePoss), errors);


        }
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
                console.log("reset", newQuestionAnswerSets);
                setQuestionAnswerSets( 
                        newQuestionAnswerSets
                );
                setCheckButtonActive(true);
        }
    }

    const setUserNameWrapper = (name) =>
    {
        if (name != '')
        {
            setFieldState("is-valid");
        }
        setUserName(name);
    }

    const handleChange = (e, questionNumber, fieldNumber) =>
    {
        console.log("handleChange", e.currentTarget.value,questionNumber  );
        
        //TODO try to do this with the shallow copy technique. 
        let newQuestionAnswerSets = getUnLinkedCopy(questionAnswerSets);
        newQuestionAnswerSets[questionNumber].userAnswers[fieldNumber] = e.currentTarget.value;
        setQuestionAnswerSets( 
                newQuestionAnswerSets
        );
    }

    const processMeta = (metaData) =>
    {
        const meta = JSON.parse(metaData);
        const loc = window.location.pathname;
        console.log("loc", loc);
        
        let qLength;
        let qaPairs = {};
        console.log("meta",meta );
        meta.questions.forEach((question, idx) => {
            
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
        setMeta(meta);
    }

    useEffect(() => {
        
        if ((exercise != undefined) && (grammarTermsKeyed != null) && 
            (exercise.grammar_terms.length > 0))
        {
            let tags = [];
            exercise.grammar_terms.forEach((termId) =>
            {   
                tags.push(grammarTermsKeyed[termId].description);
            });
            setGrammarTags(tags);
        }

    },[exercise, grammarTermsKeyed]);    //TODO detect change to userSettings as well...    
    //fetch("https://dev.kazanenglishacademy.com/test.php",
    
    useEffect(() => {
        const enc = new Base64();
        let headers = new Headers(); //browser api?
        headers.set('Authorization', 'Basic ' + enc.encode('dev' + ":" + 'hjgyt65$!H')); 
        //preflight does not send creds so need to fix server not to require creds for OPTIONS 
        //did this use an If - request check to only check for creds if not options
        fetch('https://dev.kazanenglishacademy.com/wp-json/wp/v2/activity_gap_fills?slug=' + slug + '&data=json',
        {
            method:'GET',
            headers: headers
            
        })
            .then(response => response.json())
            .then(data => 
                {
                    processMeta(data[0].meta._activity_gap_fill_meta);
                    //setMeta(meta);
                    setExercise(data[0]);
                }    
        ).catch(function (error) {
            setError(true);
            setErrorMessage(error.message);
        });

        return function cleanUp() {

        }
        
    },[]);    
    
    let questions;
   
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
    userLang={userLang}></Buttons>;


    return (
        error ? <ErrorMessageDisplay message={errorMessage} />
        : <div >
            <h1 className="text-center">{meta ?  meta.title : ''}</h1>
            
            <div className="mt-3 mb-3 input-group has-validation">
            <label htmlFor="userName" className="form-label me-2">Name  </label> 
            <input id="userName" className={fieldState} value={userName} onChange={(e) =>
                        setUserNameWrapper(e.currentTarget.value)}  maxlength="20" />
                <div className="invalid-feedback">
                    Please enter your name
                </div>
            </div>
            

            <div >
                <div>
                    {/* TODO langs from constants/deployment config - nb also used in language-blocks */}
                    {<Instructions models={meta ? meta.models  : undefined}
                        explanation={meta ? meta.explanation  : undefined}
                        instructions={meta ? meta.instructions  : undefined} langs={['ru', 'en']} 
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
  
    const {userLang, check, showCorrectAnswers, resetExercise, checkButtonActive} = props;

    let opts = {};
    if (checkButtonActive == false)
    {
        opts['disabled'] = 'disabled';
    }

    return (
        <div className="mt-3">
            <Button variant="primary" className="me-3" onClick={check} {...opts}>
                {CapitalizeFirstLetter(LABELS[userLang]['check']['infinitive'])}
            </Button>

            <Button variant="primary" className="me-3" onClick={showCorrectAnswers}>
            {CapitalizeFirstLetter(LABELS[userLang]['showCorrectAnswers']['infinitive'])}
            </Button>

            <Button variant="primary" onClick={resetExercise}>
                        {CapitalizeFirstLetter(LABELS[userLang]['reset']['infinitive'])}
            </Button>
        </div>
    )
}

const Question = (props) =>
{
    
    const {question, handleChange} = props;
    

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
            {
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

    let html = reactStringReplace(question.question, /(___)/g, (match, i) => 
    {
        return <input  value={question.userAnswers[i]}  key={i} 
        onChange={(e) => handleChange(e, question.questionNumber, i)}   />
    });

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